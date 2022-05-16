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

# deployment
# . ./openrc.sh; 
# ansible-playbook deploy_mrc.yaml; 
# ./openstack_inventory.py --list > inventory_info.json; 
# ./hosts_gen.py; 
# ansible-playbook -i config/hosts deploy_ins.yaml; 
# ansible-playbook -i config/hosts deploy_db.yaml; 

ansible-playbook -i config/hosts deploy_harvester.yaml; 
ansible-playbook -i config/hosts deploy_backend.yaml;
ansible-playbook -i config/hosts deploy_frontend.yaml; 
# Melbourne-s-urban-livability
