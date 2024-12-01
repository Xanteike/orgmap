mrp=`cat data/mrp`
mrsp=`cat data/mrsp`
jrpz=`cat data/jrpz`

echo "mrp:"
curl -H "auth: $mrp" localhost:3000/api/profile
echo ''

echo "mrsp:"
curl -H "auth: $mrsp" localhost:3000/api/profile
echo ''

echo "jrpz:"
curl -H "auth: $jrpz" localhost:3000/api/profile
echo ''