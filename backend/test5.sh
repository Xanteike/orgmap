mrp=`cat data/mrp`

curl -X POST http://localhost:3000/api/connect \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
 -d '{"users": {"mrp": "boss", "mrsp": "subordinate"}}'

echo ''

mrsp=`cat data/mrsp`

curl -X POST http://localhost:3000/api/connect \
 -H "Content-Type: application/json" \
 -H "Auth: $mrsp" \
 -d '{"name": "mrp team"}'

echo ''
