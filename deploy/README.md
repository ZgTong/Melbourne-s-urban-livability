


## To run the script

1. Copy id_rsa_ccc.pem from ./config to your ~/.ssh/ directory

2. run ./run_app.sh

3. Enter password of mrc by copying ./config/mrc_pass


**The script would generate a 3-instance-3-nodes couchdb cluster**

**Check ./hosts and obtain the couchdb master node**

**I left one instance for other possible uses**


to check the membership, use curl -X GET "http://admin:admin@${node}:5984/_membership"

