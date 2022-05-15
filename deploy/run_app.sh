# Run once for deployment

. ./openrc.sh; ansible-playbook deploy_mrc.yaml; ./openstack_inventory.py --list > inventory_info.json; ./hosts_gen.py; ansible-playbook -i config/hosts deploy_db.yaml