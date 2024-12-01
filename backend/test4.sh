mrp=`cat data/mrp`
mrsp=`cat data/mrsp`
jrpz=`cat data/jrpz`

curl -X DELETE http://localhost:3000/api/profile \
-H "Auth: $mrp"

curl -X DELETE http://localhost:3000/api/profile \
 -H "Auth: $mrsp"

echo ''

curl -X DELETE http://localhost:3000/api/profile \
 -H "Auth: $jrpz"

echo ''
