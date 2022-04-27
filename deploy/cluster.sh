export declare -a nodes=(172.26.129.134 172.17.0.3 172.17.0.2)
export masternode=`echo ${nodes} | cut -f1 -d' '`
export declare -a othernodes=`echo ${nodes[@]} | sed s/${masternode}//`
export size=${#nodes[@]}
export user="team28"
export pass="team28"
export VERSION='latest'
export cookie='a192aeb9904e6590849337933b000c99'

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

docker pull couchdb:${VERSION}

for node in "${nodes[@]}" 
  do
    if [ ! -z $(docker ps --all --filter "name=couchdb${node}" --quiet) ] 
       then
         docker stop $(docker ps --all --filter "name=couchdb${node}" --quiet) 
         docker rm $(docker ps --all --filter "name=couchdb${node}" --quiet)
    fi 
done

# for node in "${nodes[@]}" 
#   do
#     docker create\
#       --name couchdb${node}\
#       --env COUCHDB_USER=${user}\
#       --env COUCHDB_PASSWORD=${pass}\
#       --env COUCHDB_SECRET=${cookie}\
#       --env ERL_FLAGS="-setcookie \"${cookie}\" -name \"couchdb@${node}\""\
#       couchdb:${VERSION}
# done


docker create\
    --name couchdb172.17.0.2 \
    --env COUCHDB_USER=${user}\
    --env COUCHDB_PASSWORD=${pass}\
    --env COUCHDB_SECRET=${cookie}\
    --env ERL_FLAGS="-setcookie \"${cookie}\" -name \"couchdb@172.17.0.2 \""\
    couchdb:${VERSION}


docker create\
    --name couchdb172.17.0.3 \
    --env COUCHDB_USER=${user}\
    --env COUCHDB_PASSWORD=${pass}\
    --env COUCHDB_SECRET=${cookie}\
    --env ERL_FLAGS="-setcookie \"${cookie}\" -name \"couchdb@172.17.0.3 \""\
    couchdb:${VERSION}



docker create\
    --name couchdb${masternode}\
    --env COUCHDB_USER=${user}\
    --env COUCHDB_PASSWORD=${pass}\
    --env COUCHDB_SECRET=${cookie}\
    -p 5984:5984\
    --env ERL_FLAGS="-setcookie \"${cookie}\" -name \"couchdb@${masternode}\""\
    couchdb:${VERSION}



declare -a conts=(`docker ps --all | grep couchdb | cut -f1 -d' ' | xargs -n${size} -d'\n'`)


for cont in "${conts[@]}"; do docker start ${cont}; done


for node in ${othernodes} 
do
    curl -XPOST "http://${user}:${pass}@${masternode}:5984/_cluster_setup" \
      --header "Content-Type: application/json"\
      --data "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\",\
             \"username\": \"${user}\", \"password\":\"${pass}\", \"port\": \"5984\",\
             \"remote_node\": \"${node}\", \"node_count\": \"$(echo ${nodes[@]} | wc -w)\",\
             \"remote_current_user\":\"${user}\", \"remote_current_password\":\"${pass}\"}"
done


for node in ${othernodes}
do
    curl -XPOST "http://${user}:${pass}@${masternode}:5984/_cluster_setup"\
      --header "Content-Type: application/json"\
      --data "{\"action\": \"add_node\", \"host\":\"${node}\",\
             \"port\": \"5984\", \"username\": \"${user}\", \"password\":\"${pass}\"}"
done

curl -XPOST "http://${user}:${pass}@${masternode}:5984/_cluster_setup"\
    --header "Content-Type: application/json" --data "{\"action\": \"finish_cluster\"}"


for node in "${nodes[@]}"; do  curl -X GET "http://${user}:${pass}@${node}:5984/_membership"; done
