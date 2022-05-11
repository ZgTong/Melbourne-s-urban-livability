


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
       1. credential.py, 包括了接入推特api所需要的证书
   
       2. dgconfig.py，定义了当前twitter harvester所需要连接的数据库的配置。
   
    3. 通过twitter harvest的repo中的Dockerfile，来构建twitter harvester的image
   
    4. 运行twitter harvester
    
