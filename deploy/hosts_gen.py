#!/usr/bin/env python3
import json

def main():

    with open("inventory_info.json", 'r') as f:
        hosts = []
        inventory_data = json.load(f)
        recur_parse(inventory_data, hosts)
        gen_hosts(hosts)

def gen_hosts(hosts):

    couchdbNodes = hosts[:len(hosts) - 1]
    accessNode = hosts[len(hosts) - 1]

    with open("config/hosts", 'w') as f:
        f.write("[CouchdbMaster]\n")
        f.write(couchdbNodes[0] + '\n'*3)
        f.write("[CouchdbAllNodes]\n")
        for host in couchdbNodes:
            f.write(host)
            f.write('\n')
        f.write("\n[accessNode]\n")
        f.write(accessNode + '\n')
        pass
    
    with open("roles/couchdb-make-cluster/defaults/main.yaml", 'w') as f:
        f.write("masternode: " + "\""+couchdbNodes[0]+"\"")

    with open("config/dbconfig.py", 'w') as f:
        f.write("DATABASE_USERNAME = " + '\"admin\"\n' 
                + "DATABASE_PASSWORD = " + "\"admin\"\n" 
                + "DATABASE_MASTER = " + "\""+couchdbNodes[0]+"\"\n"
                + "DATABASE_SLAVE0 = " + "\""+couchdbNodes[1]+"\"\n"
                + "DATABASE_SLAVE1 = " + "\""+couchdbNodes[2]+"\"\n"
                + "DATABASE_VERSION = " + "'3.0.0'\n"
                + "DATABASE_COOKIE = " + "'gQ7wygusPdkybBsmMr4uwGXq'\n")

    # gen_harvester_config("config/twharvester/dbconfig0.py", couchdbNodes[0])
    # gen_harvester_config("config/twharvester/dbconfig1.py", couchdbNodes[1])
    # gen_harvester_config("config/twharvester/dbconfig2.py", couchdbNodes[2])
    


def gen_harvester_config(filename, ip):
    with open(filename, 'w') as f:
        f.write("DATABASE_USERNAME = " + '\"admin\"\n' 
                + "DATABASE_PASSWORD = " + "\"admin\"\n" 
                + "DATABASE_URL = " + '\"http://' + str(ip) + ":5984/\"\n"
                + "DATABASE_VERSION = " + "'3.0.0'\n"
                + "DATABASE_COOKIE = " + "'gQ7wygusPdkybBsmMr4uwGXq'\n")

'''
Parse ip address of remotes
'''
def recur_parse(meta, hosts):

    for key in meta.keys():
        try:
            if (key == "ansible_host"):
                hosts.append(meta[key])
                return
            recur_parse((meta[key]), hosts)
        except Exception:
            continue

if __name__ == '__main__':
    main()