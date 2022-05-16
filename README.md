# Melbourne-s-urban-livability


## Introduction 

1. The teams should	develop	a Cloud-based solution that	exploits a multitude of virtual machines (VMs) across the MRC for harvesting tweets through the Twitter	APIs.
2. The teams are expected to have multiple instances of this harvesting application	running	on the MRC together with an associated CouchDB	database	containing the amalgamated collection of Tweets and leveraging the MapReduce ability.
3. Teams are expected to develop a range of analytic scenarios

## User guide
 
Our project source code repository is located at Github repository https://github.com/ZgTong/Melbourne-s-urban-livability. The project structure is allocated as follows.
```
MELBOURNE-S-URBAN-LIVABILTY
deploy
 - ansibe-playbook
 - config
frontend
 - frontend project files
tweet_harvesting
 - twitter harvester
 - pre-processed data
backend
 - backend server
```
 
### System deployment
In order to deploy the whole system, **firstly** the localhost is required to have ansible installed. Viewing the [installation guide](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) to install the ansible.
 
**Secondly**, clone the project repository and change directory to "deploy/". For running the script, openstack requires an authorization identification password which is located in "deploy/config/mrc_pass".
 
**Finally**, run run_app.sh then fill in the password. A series of deployment process defined in file namd "deploy_*.yaml" would be executed.
 
To see the project front end application

view **http://172.26.131.100:3000** 
 
 