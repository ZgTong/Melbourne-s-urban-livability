# Run once for deployment


. ./openrc.sh; 
ansible-playbook deploy_mrc.yaml; 
./openstack_inventory.py --list > inventory_info.json; 
./hosts_gen.py; 
ansible-playbook -i config/hosts deploy_ins.yaml; 
ansible-playbook -i config/hosts deploy_db.yaml; 
ansible-playbook -i config/hosts deploy_harvester.yaml; 
ansible-playbook -i config/hosts deploy_frontend.yaml; 
ansible-playbook -i config/hosts deploy_backend.yaml
Melbourne-s-urban-livability