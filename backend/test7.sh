mrp=`cat data/mrp`

departmentId=`curl -X POST http://localhost:3000/api/department \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
 -d '{"name": "mrp department"}'`

echo $departmentId > data/departmentId

echo ''

departmentId=`cat data/departmentId`

curl http://localhost:3000/api/department/$departmentId \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp"

echo ''

curl -X POST http://localhost:3000/api/connect \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
 -d '{"users": {"jrpz": "d_member"}, "departments": {"0": "department_m"}}'

echo ''

curl -X POST http://localhost:3000/api/connect \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
 -d '{"teams": {"0": "d_team"}, "departments": {"0": "department_t"}}'

echo ''

curl http://localhost:3000/api/department/$departmentId \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp"

echo ''