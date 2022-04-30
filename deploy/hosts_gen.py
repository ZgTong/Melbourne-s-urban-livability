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

    with open("hosts", 'w') as f:
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