curl -d '' -H "username: mrp" -H "password: mrp" localhost:3000/auth/signup
curl -d '' -H "username: mrsp" -H "password: mrsp" localhost:3000/auth/signup
curl -d '' -H "username: jrpz" -H "password: jrpz" localhost:3000/auth/signup

curl -d '' -H "username: mrp" -H "password: mrp" localhost:3000/auth/login > data/mrp
curl -d '' -H "username: mrsp" -H "password: mrsp" localhost:3000/auth/login > data/mrsp
curl -d '' -H "username: jrpz" -H "password: jrpz" localhost:3000/auth/login > data/jrpz

echo ''