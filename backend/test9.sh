mrp=`cat data/mrp`

curl -X POST http://localhost:3000/api/disconnect \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
 -d '{"users": ["mrp", "mrsp"]}'