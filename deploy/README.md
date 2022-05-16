


## Delopy 
### Ansible

(这段凑字数，主要是吹为什么要用脑瘫ansible来部署任务增加工作量)

介绍ansible，以及为什么使用ansible

使用ansible的原因：为了实现‘dynamic deployment‘进行模块化的动态部署。

ansible通过ssh协议和远程主机通信，从而可以部署远程主机，远程的主机可以是虚拟或者物理主机

“Ansible is a radically simple IT automation engine that automates cloud provisioning, configuration management, application deployment, intra-service orchestration, and many other IT needs.” [来自](https://www.ansible.com/overview/how-ansible-works?hsLang=en-us)

通过这样的方式，解决了多台云实例的运维问题

Ansible提供脚本功能。Ansible脚本的名字叫Playbook，playbook是一组描述remote tasks的蓝图， 使用的是简答的标记语言YAML的格式。在本次项目中，我们使用ansible-playbook来解决部署问题。

“Ansible is a radically simple IT automation engine that automates cloud provisioning, configuration management, application deployment, intra-service orchestration, and many other IT needs.

“Designed for multi-tier deployments since day one, Ansible models your IT infrastructure by describing how all of your systems inter-relate, rather than just managing one system at a time.”[来自](https://www.ansible.com/overview/how-ansible-works?hsLang=en-us)

所以，总结一下ansible的好处就是避免了开发人员人为的在多个远程主机上进行繁琐的部署任务，而且ansible对mrc所使用的openstack平台提供了丰富的api使得其非常适合本次proejct

### Dynamic deployment details

（上下文，不用写在report，目前mrc上的资源是4个实例，其中三个用来部署harvester和couchdb cluster，也许还有后端。剩下一个实例用来部署前端和其他）

#### Overall
Overall，在这次project我们团队对asd任务进行了模块化拆分，使得各项任务顺序清晰明了。并且，通过对openstack in memory inventory的configuration and implementation， 我们很好的支持了"dynamic deployment"的需求。总的来说，本次project的部署分为以下步骤

1. 通过同时对项目资源大小和项目的性能考量，定义mrc上cloud instances and related resources，包括（image type，volumn size，security group，）

2. 定义完cloud instances 之后，在其中install common tools pacakge （docker，python etc）并且make file system and mount the corresponding volumn
3. Deploy couchdb on each “DataNode” （就是部署couchdb的instance，有三个，总共有4个）
4. Deploy twitter harvester on each “DataNode”

5. Deploy front end?（这边目前还没做)
6. Deploy backend end?（这边目前还没做）


#### Details

（这边描述部署的一些细节，以及资源调动等。）

1. mrc resource allocation
   1. 为了使ansible playbook正确运行，首先安装python以及相关资源package。而后安装openstack package为remote cloud instance communication进行必要准备
   
   2. 部署volumn，volumn在openstack中的定义是一个物理的储存设备，类似外接usb。经过对twitter harvester在不同场景下的data size 以及docker容器储存层占用情况的评估。我们对data和docker 分别allocate 50GB和10GB的卷空间
   
   3. 部署安全组（security group），安全组定义了network access rule。再次步骤，我们对instance开放了以下端口
      1. 80 for http commu
   
      2. 22 for ssh access
   
      3. 5984 for couchdb cluster access port

      4. 4369 for couchdb internal erlang communication for cluster setup （from couchdb cluster document）[from](https://docs.couchdb.org/en/3.2.0/setup/cluster.html)
   
      5. 9100-9200 for couchdb documententation commu range
   4. 根据以上配置，在mrc上生成对应的云实例

   5. 在云实例上安装相应的software package，如docker，和各种工具链

2. deploy couchdb cluster
    - 在这个步骤需要注意的是
      1. 确保instances之间开放了相应的通信端口
   
      2. 确保docker进行了正确的端口映射
   
      3. cluster内部有相同的cookie
    
    - Then the following steps are performed on ansible pllaybook

      1. Shutdown existing couchdb container 
   
      2. Enable couchdb on all DataNode
   
      3. Choose one MasterNode, for the rest of couchdNodes, perform enable cluster, join cluster and finish cluster. 

3. Deploy twitter harvester
    1. 首先clone对应branch的project repo
   
    2. Then, the configuration file of each twitter harvester would be dynamic assign by ansible. The configuration file of twitter harvester include following
       1. credential.py, 包括了接入推特api所需要的证书（balala一堆介绍需要的什么token，api-secret）
   
       2. dgconfig.py，定义了当前twitter harvester所需要连接的数据库的配置。（包括数据库username，password，version，cookie，ip 地址）
   
    3. 通过twitter harvest的repo中的Dockerfile，来构建twitter harvester的image
   
    4. 运行twitter harvester
    
### About dynamice deployment
- 
    在本次project，我们实现了一键部署启动整个项目的目标。下面是有关于此的dynamic deployment的细节

    在上述步骤的第一步，也就是部署mrc 资源的时候。此刻我们的脚本当前的hosts只有localhost，只有当完全了对mrc上云实例的部署之后，我们才能得到相应的ip地址，并且
    手动的添加到hosts文件中，在进行下一步操作。

    显然，这样子的实现是不符合dynamic deployment的要求的。为此我们应用了inventory script, openstack_inventory.py for dynamicly pull information facts of mrc openstack instance. 然后，通过hosts_gen.py 文件，我们递归的求出了mrc云实例上的ip地址，并且动态地生成了hosts文件给后续步骤使用


- 对于twitter harvester来说，经过我们的测试，多个harvester同时使用一个token会导致爬取速率下降。我们希望所有instance上的harvester都读写他们本地的couchdb，这样做可以降低单个couchdb的压力，并且不用经受instance之间网络通信的延迟。所以，我们定位了两个问题
    1. 如何让不同instance上的harvester使用不同的token
    2. 如何让不同instance上的harvester读不同ip地址的couchdb
   
   好在我们在上一节动态的获取了ip地址，对于这两个，我们只要在ansible处根据不同的ip地址对不同的instance进行credentials.py和dbconfig.py文件的分发即可



## User guide

Our project source code repository is located at Github repository https://github.com/ZgTong/Melbourne-s-urban-livability. The project structure is allocated as following.
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

**Secondly**, clone the project repository and change directory to "deploy/". For running the script, openstack required a authorization indentification password which located in "deploy/config/mrc_pass".

**Finally**, run run_app.sh then fill in the password. A series of deployment process defined in file namd "deploy_*.yaml" would be execute.

To see the project front end application, view **http://172.26.131.100:3000** (这边需要跟前端确认)


### Details

The ansible-playbook is defined in run.sh which is shown as following.

```
. ./openrc.sh; ansible-playbook deploy_mrc.yaml; ./openstack_inventory.py --list > inventory_info.json; ./hosts_gen.py; ansible-playbook -i config/hosts deploy_ins.yaml; ansible-playbook -i config/hosts deploy_db.yaml; ansible-playbook -i config/hosts deploy_harvester.yaml; ansible-playbook -i config/hosts deploy_frontend.yaml; ansible-playbook -i config/hosts deploy_backend.yaml
```
The instructions in the middle of each delimiter indicate a series of command to be performed according to specific file (e.g. .yaml, .py and .sh). Table X shows the details of the functionality of each file.

(这边我用的markdown 表格)

|NAME|FUNCTIONALITY|
|----|----|
|openrc.sh|openstack client enviroment script for authorization|
|deploy_mrc.yaml|cloud resources deployment|
|openstack_inventory.py|obtain remote host details |
|hosts_gen.py|generate hosts file and configuration file|
|deploy_ins.py|cloud instances setup|
|deploy_db.yaml|couchdb cluster setup|
|deploy_harvester.yaml|twitter harvester deployment|
|deploy_frontend.yaml|frontend deployment|
|deploy_backend.yaml|backend deployment|

To run each component individually, simply copy the corresponding command from run.sh. (e.g. $ansible-plabook -i config/hosts deploy_ins.yaml). Make sure config/hosts file is generated.





### Couchdb Cluster

Couchdb is a Document-oriented and NoSql DBMS which allocate and store data as structured documentation. As a distributed database, it has the feature of availability by sharding and replication and has the feature of parition-tolerance by using MVCC. 

In this project, couchdb cluster is deployed on three nodes (called "couchdbAllNodes" in ansible scripts)



#### Cluster setup

In this project, we use a stable version docker image of couchdb for starting three couchdb container on corresponding instances. Then, by setting up the configuration, we let the three couchdb container to form a cluster. For doing this, the ansible scripts "couchdb-start.yaml" and "couchdb-make-cluster.yaml" are responsible for all couchdb setup work.

First, in the process of "couchdb-start.yaml", a stale version of couchdb docker image is used. For the later configuration of the cluster setup, there are few configuration parameter needs to declare.

The first one is port number. Couchdb need three port group for inner and outer communication. The cloud security groups are need to open for 5984 (All http request), 4369 (Erlang port mapper daemon ) and 9100-9200 (documentation transfer).

In addition, it is important to have a uniform cookie accorss three cluster nodes. This is also done by ansible docker enviroment module.


The second setup defined in "couchdb-make-cluster.yaml". Couchdb expose the "_cluster_setup" endpoint for setting up cluster by transfering series url. The procedures are shown as follows

1. Enable cluster
2. Join cluster
3. Finish cluster

These actions is performed at each couchdb nodes except couchdb master node.











## Challenage

Firstly, we use Windows sub-linux system to opearate the mrc instances. But after using cisco vpn, the remote instances cannot be connect via ansible or ssh script. By searching on the issues online, we find that it's unresolved DNS name issue by using cisco vpn. Therefore, we simply change to use macOS for deployment.

Setting up the couchdb cluster is difficult and tedious especially using ansible and docker container to set them up. Different couchdb version has its own setup rules and it is hard to trace the problem. We using docker container for more flexiability but couchdb offical does not have a clear standard for cluster setup via docker. Since the docker internal network is different from outside, we ends up with the connection refused issue by strictly following the tutorial demo and changing the ip address correspondingly. We finally setup the couchdb cluster via ansible scripts with couchdb version 3 with corresponding port expose and security group opened.
















