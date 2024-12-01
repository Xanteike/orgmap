import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { createClient } from "redis";
import express from "express";
import expressListEndpoints from "express-list-endpoints";


async function argon2hash(_pswd) {
	let _salt = `Состав морской соли следующий:
Хлорид (Cl-) - 55.03%
Натрий (Na+) - 30.59%
Сульфат (SO42-) - 7.68%
Магний (Mg2-) - 3.68%
Кальций (Ca2-) - 1.18%
Калий (K+) - 1.11%
Бикарбонат (HCO3-) - 0.41%
Бромид (Br-) - 0.19%
Борат (BO33-) - 0.08%
Стронций (Sr2+) - 0.04%
Остальные примеси: 0.01%`;
	return Buffer.from((await argon2.hash(_pswd, { salt: Buffer.from(_salt) })).split("$").at(-1), 'base64').toString("hex");
}

function isEmpty(obj) {
	return Object.keys(obj).length === 0;
}


const redis_client = createClient({ url: "redis://@176.108.249.117" })
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const jwtKey = "PNihoGE7eADXl";

let compileAndCacheGraph = async () => {
	
}

app.route('/auth/*').all(async (request, response, next) => {
	console.info(`auth request to ${request.url}`)
	next();
})

app.post('/auth/signup', async (request, response) => {
	let username = request.headers.username;
	let password = request.headers.password;

	if (typeof username !== "string") return response.sendStatus(400);
	if (typeof password !== "string") return response.sendStatus(400);

	let check = await redis_client.get(`user_${username}`);
	if (check !== null) return response.status(400).send("username is used");
	await redis_client.set(`user_${username}`, await argon2hash(password));
	await redis_client.set(`profile_${username}`, JSON.stringify({
		"username": "",
		"status": "Пьёт пиво",
		"role": "",
		"email": "",
		"phone": "",
		"tg": null,
		"connections": []
	}))
	response.sendStatus(202)
})

app.post('/auth/login', async (request, response) => {
	let username = request.headers.username;
	let password = request.headers.password;

	if (typeof username !== "string") return response.sendStatus(400);
	if (typeof password !== "string") return response.sendStatus(400);

	let check = await redis_client.get(`user_${username}`);
	if (check === null) return response.sendStatus(404);
	if (await argon2hash(password) !== check) return response.status(400).send("wrong password");
	let token = jwt.sign({ username: username, created: new Date() }, jwtKey, { expiresIn: '1d' });
	response.send(token);
})

app.post('/auth/refresh', async (request, response) => {
	let token = request.headers.auth;

	if (typeof token !== "string") return response.sendStatus(400);

	try {
		let decoded = jwt.verify(token, jwtKey);
		let username = decoded.username;
		let newToken = jwt.sign({ username: username, created: new Date() }, jwtKey, { expiresIn: '1d' });
		response.send(newToken);
	} catch (e) {
		response.sendStatus(401);
	}
})

app.post('/auth/check', async (request, response) => {
	let token = request.headers.auth;

	try {
		jwt.verify(token, jwtKey);
		response.sendStatus(200);
	} catch {
		response.sendStatus(401);
	}
})

app.route('/api/*').all(async (request, response, next) => {
	let token = request.headers.auth;

	if (typeof token !== "string") return response.sendStatus(401);

	try {
		let decoded = jwt.verify(token, jwtKey);
		let username = decoded.username;
		if (!await redis_client.get(`profile_${username}`)) return response.status(401).send("token is valid but user doesn't exist");
		console.info(`request [${request.method}] to ${request.url}`)
		request.headers.username = username;
		next();
	} catch {
		console.error(`failed request to ${request.url}`)
		response.sendStatus(401);
	}
})

let priveledgedRoles = [ "CEO", "Admin", "Project Manager" ]

let rightsUpper = [ "boss", "owner", "t_team", "owner_d", "department_m", "d_team" ]
let rightsEqual = [ "peer", "collab", "teamlead" ]
let rightsLower = [ "subordinate", "project", "t_member", "department", "d_member", "department_t" ]

let userConnections = [ "boss", "subordinate", "peer", "owner", "t_member", "owner_d", "d_member" ]
let teamConnections = [ "project", "collab", "t_team", "department_t" ]
let departmentConnections = [ "department", "department_m", "d_team" ]

let getManagers = async (obj) => {
	let a = JSON.parse(await redis_client.get(`profile_${obj}`));
	let connections = JSON.parse(await redis_client.get(`profile_${obj}`)).connections;
	connections = connections.filter(x => x[1] !== obj);
	connections = connections.filter(x => rightsUpper.includes(x[0]));
	let upperConnections = [];
	for (let i = 0; i < connections.length; i++) {
		let connection = connections[i];
		let result = await getObjectManagers(`${getObjectTypeByConnection(connection[0])}${connection[1]}`);
		if (result.length > 0)
			upperConnections.push(...result);
	}
	return [...connections, ...upperConnections].filter((v, i, a) => a.indexOf(v) == i)
}

let canManage = async (subj, obj) => {
	console.debug(subj, obj)
	if (subj === obj) return true;
	return (await getManagers(obj)).includes(subj);
}

let getObjectTypeByConnection = (connection, _also_etc) => {
	if (userConnections.includes(connection)) return "profile_";
	if (teamConnections.includes(connection)) return "team_";
	if (departmentConnections.includes(connection)) return "department_";
	if (connection === "teamlead") return (typeof _also_etc == "number") ? "team_" : "profile_";
}

let getObjectManagers = async (obj) => {
	let connections = JSON.parse(await redis_client.get(obj)).connections;
	connections = connections.filter(x => rightsUpper.includes(x[0]) || (x[0] == "teamlead" && typeof x[1] != "string"));
	let upperConnections = [];
	for (let i = 0; i < connections.length; i++) {
		let connection = connections[i];
		upperConnections.push(...(await getObjectManagers(getObjectTypeByConnection(connection[0]) + connection[1])))
	}
	connections = connections.map(connection => getObjectTypeByConnection(connection[0]) + connection[1])
	return [...connections, ...upperConnections].filter((v, i, a) => a.indexOf(v) == i)
}

let canManageObject = async (subj, obj) => {
	if (`profile_${subj}` === obj) return true;
	return ((await getObjectManagers(obj)).includes(`profile_${subj}`));
}

let isPriveledged = (user) => { return priveledgedRoles.includes(user.role) }

function reverseRole(role) {
	switch (role) {
		// boss - subordinate (users)
		case "boss": return "subordinate";
		case "subordinate": return "boss";
		// peer - peer (users)
		case "peer": return "peer";
		// project manager - team (user to team)
		case "owner": return "project";
		case "project": return "owner";
		// collab - collab (teams)
		case "collab": return "collab";
		// teamlead - team (team to user)
		case "teamlead": return "teamlead";
		// member - team (team to user)
		case "t_team": return "t_member";
		case "t_member": return "t_team";
		// department - owner (department to user)
		case "department": return "owner_d";
		case "owner_d": return "department";
		// member - department (user to department)
		case "department_m": return "d_member";
		case "d_member": return "department_m";
		// team - department (team to department)
		case "department_t": return "d_team";
		case "d_team": return "department_t";
	}
}

app.get('/api/id', async (request, response) => {
	response.send(request.headers.username);
})

app.route('/api/connect').post(async (request, response) => {
	let user = JSON.parse(await redis_client.get(`profile_${request.headers.username}`));
	if (Object.keys(request.body.users || {}).length + Object.keys(request.body.teams || {}).length + Object.keys(request.body.departments || {}).length != 2) return response.sendStatus(400);

	if (!isPriveledged(user)) return response.status(403).send("not enough privileges");
	if (Object.keys(request.body.users || {}).length > 0) {
		let others = Object.keys(request.body.users).filter(x => x !== request.headers.username)
		console.debug(others)
		const asyncSome = async (arr, predicate) => {
			for (let e of arr)
				if (await predicate(e)) return true;
			return false;
		};
		if (await asyncSome(others, async other => await canManage(other, request.headers.username)))
			return response.status(403).send("cannot manage profile");
	}
	if (Object.keys(request.body.teams || {}).length > 0) {
		let others = Object.keys(request.body.teams)
		const asyncSome = async (arr, predicate) => {
			for (let e of arr)
				if (await predicate(e)) return true;
			return false;
		};
		if (await asyncSome(others, async other => await canManageObject(`team_${other}`, `profile_${request.headers.username}`)))
			return response.status(403).send("cannot manage team");
	}
	if (Object.keys(request.body.departments || {}).length > 0) {
		let others = Object.keys(request.body.departments)
		const asyncSome = async (arr, predicate) => {
			for (let e of arr)
				if (await predicate(e)) return true;
			return false;
		};
		if (await asyncSome(others, async other => await canManageObject(`department_${other}`, `profile_${request.headers.username}`)))
			return response.status(403).send("cannot manage department");
	}
	let user_roles = request.body.users || {};
	let team_roles = request.body.teams || {};
	let department_roles = request.body.departments || {};
	let users = Object.keys(user_roles);
	let teams = Object.keys(team_roles);
	let departments = Object.keys(department_roles);
	let obj1, obj2, type1, type2, role1, role2;
	if (Object.keys(users).length == 2) {
		[ obj1, obj2 ] = [ users[0], users[1] ];
		[ type1, type2 ] = [ "profile", "profile" ];
		[ role1, role2 ] = [ user_roles[`${obj2}`], user_roles[`${obj1}`] ];
	} else if (Object.keys(teams).length == 1 && Object.keys(users).length == 1) {
		[ obj1, obj2 ] = [ users[0], teams[0] ];
		[ type1, type2 ] = [ "profile", "team" ];
		[ role1, role2 ] = [ user_roles[`${obj1}`], team_roles[`${obj2}`] ];
	} else if (Object.keys(departments).length == 1 && Object.keys(users).length == 1) {
		[ obj1, obj2 ] = [ users[0], departments[0] ];
		[ type1, type2 ] = [ "profile", "department" ];
		[ role1, role2 ] = [ department_roles[`${obj2}`], user_roles[`${obj1}`] ];
	} else if (Object.keys(departments).length == 1 && Object.keys(teams).length == 1) {
		[ obj1, obj2 ] = [ teams[0], departments[0] ];
		[ type1, type2 ] = [ "team", "department" ];
		[ role1, role2 ] = [ team_roles[`${obj2}`], department_roles[`${obj1}`] ];
	} else if (Object.keys(teams).length == 2) {
		[ obj1, obj2 ] = [ teams[0], teams[1] ];
		[ type1, type2 ] = [ "team", "team" ];
		[ role1, role2 ] = [ team_roles[`${obj2}`], team_roles[`${obj1}`] ];
	} else return response.status(400).send("mrp");
	if ((role1 !== reverseRole(role2)) && (role2 !== reverseRole(role1)))
		response.status(400).send("incorrect roles");
	let obj1_data = JSON.parse(await redis_client.get(`${type1}_${obj1}`));
	let obj2_data = JSON.parse(await redis_client.get(`${type2}_${obj2}`));
	if (type1 !== "profile") obj1 = +obj1;
	if (type2 !== "profile") obj2 = +obj2;
	obj1_data.connections.push([role1, obj2]);
	obj2_data.connections.push([role2, obj1]);
	await redis_client.set(`${type1}_${obj1}`, JSON.stringify(obj1_data));
	await redis_client.set(`${type2}_${obj2}`, JSON.stringify(obj2_data));
	response.sendStatus(200);
})

app.route('/api/disconnect').post(async (request, response) => {
	let user = JSON.parse(await redis_client.get(`profile_${request.headers.username}`));
	if ((request.body.users || []).length + (request.body.teams || []).length + (request.body.departments || []).length != 2) return response.sendStatus(400);

	if (!isPriveledged(user)) return response.status(403).send("not enough privileges");

	let objects = [];

	(request.body.users || []).forEach(x => objects.push([ "profile", x ]));
	(request.body.teams || []).forEach(x => objects.push([ "team", x ]));
	(request.body.departments || []).forEach(x => objects.push([ "department", x ]));

	let [ [ type1, obj1 ], [ type2, obj2 ] ] = objects;

	let obj1_data = JSON.parse(await redis_client.get(`${type1}_${obj1}`));
	let obj2_data = JSON.parse(await redis_client.get(`${type2}_${obj2}`));
	if (type1 !== "profile") obj1 = +obj1;
	if (type2 !== "profile") obj2 = +obj2;
	obj1_data.connections = obj1_data.connections.filter(c => c[1] !== obj2);
	obj2_data.connections = obj2_data.connections.filter(c => c[1] !== obj1);
	await redis_client.set(`${type1}_${obj1}`, JSON.stringify(obj1_data));
	await redis_client.set(`${type2}_${obj2}`, JSON.stringify(obj2_data));
	response.sendStatus(200);
})


app.route('/api/profile').all(async (request, response) => {
	let options = {
		method: request.method,
		headers: { auth: request.headers.auth },
	};
	if (!isEmpty(request.body)) {
		options.body = JSON.stringify(request.body);
		options.headers["content-type"] = "application/json"
	}
	let redirect = await fetch(`http://localhost:3000/api/profile/${request.headers.username}`, options);
	response.status(redirect.status).send(await redirect.text());
})

app.route('/api/profile/:id')
	.get(async (request, response) => {
		let data = JSON.parse(await redis_client.get(`profile_${request.params.id}`));
		data.allowedToManage = await canManage(request.headers.username, request.params.id);
		response.send(data);
	})
	.put(async (request, response) => {
		let current = JSON.parse(await redis_client.get(`profile_${request.params.id}`));
		let updates = request.body;
		if (await canManage(request.headers.username, request.params.id))
			await redis_client.set(`profile_${request.params.id}`, JSON.stringify({...current, ...updates}))
		else
			return response.status(403).send("cannot manage profile");
		response.sendStatus(200);
	})
	.delete(async (request, response) => {
		let changer = request.headers.username;

		if (!await canManage(changer, request.params.id)) return response.status(403).send("cannot manage profile");

		let data = JSON.parse(await redis_client.get(`profile_${request.params.id}`));

		for (let i = 0; i < data.connections.length; i++) {
			let connection = data.connections[i];
			let type = connection[0];
			let id = connection[1];
			if (typeof id === "string") continue;
			if (type == "teamlead") {
				let result = JSON.parse(await redis_client.get(`team_${id}`));
				result.connections = result.connections.filter(c => c[1] !== request.params.id);
				await redis_client.set(`${getObjectTypeByConnection(type)}_${id}`, JSON.stringify(result));
				continue;
			}
			let result = JSON.parse(await redis_client.get(`${getObjectTypeByConnection(type)}${id}`));
			result.connections = result.connections.filter(c => c[1] !== request.params.id);
			await redis_client.set(`${getObjectTypeByConnection(type)}_${id}`, JSON.stringify(result));
		}

		await redis_client.del(`profile_${request.params.id}`)
		await redis_client.del(`user_${request.params.id}`)
		response.sendStatus(200);
	})

app.route('/api/team')
	.post(async (request, response) => {
		let user = JSON.parse(await redis_client.get(`profile_${request.headers.username}`));
		if (!isPriveledged(user)) return response.status(403).send("not enough privileges");

		let name = request.body.name;
		if (typeof name !== "string") return response.sendStatus(400);

		let index = +(await redis_client.get("teams"));

		await redis_client.set("teams", 1 + index);

		await redis_client.set(`team_${index}`, JSON.stringify({
			"name": name,
			"connections": [
				["owner", request.headers.username]
			]
		}));
		user.connections.push(["project", +index]);
		await redis_client.set(`profile_${request.headers.username}`, JSON.stringify(user));

		response.send(`${index}`);
	})

app.route('/api/team/:id')
	.get(async (request, response) => {
		let id = request.params.id;

		let data = JSON.parse(await redis_client.get(`team_${id}`));

		data.allowedToManage = await canManageObject(request.headers.username, `team_${request.params.id}`);

		response.send(data);
	})
	.put(async (request, response) => {
		let id = request.params.id;

		if (!(await canManageObject(request.headers.username, `team_${request.params.id}`))) return response.sendStatus(403);

		let current = JSON.parse(await redis_client.get(`team_${request.params.id}`));
		let updates = request.body;

		if (await canManage(request.headers.username, request.params.id))
			await redis_client.set(`team_${request.params.id}`, JSON.stringify({...current, ...updates}))
		else
			return response.status(403).send("cannot manage profile");
		response.sendStatus(200);
	})
	.delete(async (request, response) => {
		if (!(await canManageObject(request.headers.username, `team_${request.params.id}`))) return response.sendStatus(403);

		let data = JSON.parse(await redis_client.get(`team_${request.params.id}`));

		for (let i = 0; i < data.connections.length; i++) {
			let connection = data.connections[i];
			let type = connection[0];
			let id = connection[1];
			if (typeof id === "string") return;
			let data = JSON.parse(await redis_client.get(`${getObjectTypeByConnection(type)}_${id}`));
			data.connections = data.connections.filter(c => c[1] !== +request.params.id);
			await redis_client.get(`${getObjectTypeByConnection(type)}_${id}`, JSON.stringify(data));
		}

		await redis_client.del(`team_${request.params.id}`);

		response.sendStatus(200);
	})

app.route('/api/department')
	.post(async (request, response) => {
		let user = JSON.parse(await redis_client.get(`profile_${request.headers.username}`));
		if (!isPriveledged(user)) return response.status(403).send("not enough privileges");

		let name = request.body.name;
		if (typeof name !== "string") return response.sendStatus(400);

		let index = +(await redis_client.get("departments"));

		await redis_client.set("departments", 1 + index);

		await redis_client.set(`department_${index}`, JSON.stringify({
			"name": name,
			"connections": [
				["owner_d", request.headers.username]
			]
		}));
		user.connections.push(["department", +index]);
		await redis_client.set(`profile_${request.headers.username}`, JSON.stringify(user));

		response.send(`${index}`);
	})

app.route('/api/department/:id')
	.get(async (request, response) => {
		let id = request.params.id;

		let data = JSON.parse(await redis_client.get(`department_${id}`));

		data.allowedToManage = await canManageObject(request.headers.username, `department_${request.params.id}`);

		response.send(data);
	})
	.put(async (request, response) => {
		let id = request.params.id;

		if (!(await canManageObject(request.headers.username, `department_${request.params.id}`))) return response.sendStatus(403);

		let current = JSON.parse(await redis_client.get(`department_${request.params.id}`));
		let updates = request.body;

		if (await canManage(request.headers.username, request.params.id))
			await redis_client.set(`department_${request.params.id}`, JSON.stringify({...current, ...updates}))
		else
			return response.status(403).send("cannot manage department");
		response.sendStatus(200);
	})
	.delete(async (request, response) => {
		if (!(await canManageObject(request.headers.username, `department_${request.params.id}`))) return response.sendStatus(403);

		let data = JSON.parse(await redis_client.get(`department_${request.params.id}`));

		for (let i = 0; i < data.connections.length; i++) {
			let connection = data.connections[i];
			let type = connection[0];
			let id = connection[1];
			if (typeof id === "string") return;
			let data = JSON.parse(await redis_client.get(`${getObjectTypeByConnection(type)}_${id}`));
			data.connections = data.connections.filter(c => c[1] !== +request.params.id);
			await redis_client.get(`${getObjectTypeByConnection(type)}_${id}`, JSON.stringify(data));
		}

		await redis_client.del(`department_${request.params.id}`);

		response.sendStatus(200);
	})

let requestReqursiveGraph = async (obj, _objs) => {
	if (!_objs) _objs = [];
	if (_objs.includes(obj)) return;
	_objs.push(obj);
	let connections = JSON.parse(await redis_client.get(obj)).connections;
	console.log("123", connections)
	connections = connections.filter(x => rightsLower.includes(x[0]) || x[0] == "teamlead");
	console.log("321", connections)
	let lowerConnections = [];
	for (let i = 0; i < connections.length; i++) {
		let connection = connections[i];
		console.log("\t\t/", getObjectTypeByConnection(connection[0], connection[1]) + connection[1])
		let lower = await requestReqursiveGraph(getObjectTypeByConnection(connection[0], connection[1]) + connection[1], _objs);
		console.log('\t\t', lower)
		if (lower) lowerConnections.push(...(lower))
	}
	_objs = [..._objs, ...connections.map(c => getObjectTypeByConnection(c[0], c[1]) + c[1]).filter((v, i, a) => a.indexOf(v) == i)];
	connections = connections.map(connection => getObjectTypeByConnection(connection[0], connection[1]) + connection[1])
	let result = [...connections, ...lowerConnections, obj].filter((v, i, a) => a.indexOf(v) == i)
	return result;
}

app.get('/api/graph', async (request, response) => {
	let start;
	let code = 200;
	if (Object.keys(request.query).length == 0) start = await redis_client.get("graph_start");
	if (request.query.user) {
		if (!(await redis_client.get(`profile_${request.query.user}`))) code = 400;
		else start = `profile_${request.query.user}`;
	}
	if (request.query.team) {
		if (!(await redis_client.get(`team_${request.query.team}`))) code = 400;
		else start = `team_${request.query.team}`;
	}
	if (request.query.department) {
		if (!(await redis_client.get(`department_${request.query.department}`))) code = 400;
		else start = `department_${request.query.department}`;
	}

	let objects = await requestReqursiveGraph(start);

	let result = [];

	for (let i = 0; i < objects.length; i++) {
		result.push(JSON.parse(await redis_client.get(objects[i])));
	}

	response.status(code).send(JSON.stringify(result))
})

app.post('/api/graph', async (request, response) => {
	let user = JSON.parse(await redis_client.get(`profile_${request.headers.username}`));
	if (user.role !== "Admin") return response.status(403).send("not enough privileges");

	let start = request.body.start;
	if (typeof start != "string") return response.sendStatus(400);
	if (!(await redis_client.get(start))) return response.sendStatus(404);

	await redis_client.set("graph_start", `${start}`);

	return response.sendStatus(200);
})

app.get('/api/mrp', async (request, response) => {
	response.status(418).send("meow meow meow meow");
})

redis_client.connect().then(async () => {
	console.debug("Redis connected");
	if (!(await redis_client.get("teams")))
		await redis_client.set("teams", "0");
	if (!(await redis_client.get("departments")))
		await redis_client.set("departments", "0");
})


app.listen(3000, () => {
	console.debug(`App working`)
})

// const endpoints = expressListEndpoints(app);

// console.log(endpoints);