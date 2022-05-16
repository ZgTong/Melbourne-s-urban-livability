#!/usr/bin/env python3

# Part of Assignment 2 - COMP90024 Cluster and Cloud Computing 2022 S1
#
# Team 28
# 
# Authors: 
#
#  * Yuanzhi Shang (Student ID: 1300135)
#  * Zuguang Tong (Student ID: 1273868)
#  * Ruoyi Gan (Student ID: 987838)
#  * Zixuan Guo (Student ID: 1298930)
#  * Jingyu Tan (Student ID: 1184788)
#
# Location: Melbourne
#
import json
import os
import shutil
def main():

    with open("inventory_info.json", 'r') as f:
        hosts = []
        inventory_data = json.load(f)
        recur_parse(inventory_data, hosts)
        gen_hosts(hosts)
        gen_config(hosts)
        
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


def gen_config(hosts):
    couchdbNodes = hosts[:len(hosts) - 1]
    accessNode = hosts[len(hosts) - 1]
    for i, host in enumerate(couchdbNodes):
        path = "config/" + str(host)
        if not os.path.exists(path):
            os.mkdir(path)
        gen_harvester_config(path + "/dbconfig.py", host)
        shutil.copy("config/token/" + "credential" + str(i) + ".py", path  + "/credential.py")


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
