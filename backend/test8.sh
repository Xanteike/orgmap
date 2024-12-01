mrp=`cat data/mrp`
mrsp=`cat data/mrsp`
jrpz=`cat data/jrpz`


curl http://localhost:3000/api/graph \
 -H "Content-Type: application/json" \
 -H "Auth: $mrp" \
  -d '{"start": "profile_mrp"}'

echo ''

curl http://localhost:3000/api/graph \
 -H "Auth: $mrp"

echo ''

curl http://localhost:3000/api/graph?user=mrp \
 -H "Auth: $mrp"

echo ''

curl http://localhost:3000/api/graph?user=mrsp \
 -H "Auth: $mrp"

echo ''

curl http://localhost:3000/api/graph?team=0 \
 -H "Auth: $mrp"

echo ''

curl http://localhost:3000/api/graph?department=0 \
 -H "Auth: $mrp"

echo ''