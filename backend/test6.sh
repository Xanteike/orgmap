mrp=`cat data/mrp`

teamId=`curl -X POST http://localhost:3000/api/team \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
 -d '{"name": "mrp team"}'`

echo $teamId > data/teamId

echo ''

teamId=`cat data/teamId`

curl http://localhost:3000/api/team/$teamId \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp"

echo ''

curl -X POST http://localhost:3000/api/connect \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
 -d '{"users": {"mrsp": "teamlead"}, "teams": {"0": "teamlead"}}'

echo ''

curl http://localhost:3000/api/team/$teamId \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp"

echo ''