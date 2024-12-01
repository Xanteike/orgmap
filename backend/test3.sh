mrp=`cat data/mrp`

curl -X PUT http://localhost:3000/api/profile \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
 -d '{"role":"Admin","username":"Mr.Penis"}'

echo ''