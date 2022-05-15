
## Quick Start

./deploy.sh 之后输入密码
OTljMmNlOTBlYzA3YTIw

<!-- - 目前还在测试，启动之后进入instance输入以下来解决权限问题
  - sudo chmod 666 /var/run/docker.sock
  - systemctl restart docker -->

## trouble shooting

1. 同样的脚本在本机wsl下出现ansible syntax error "-name ^ here"
    - 解决：win和linux编码问题，重新复制或者重制wsl即可
      - 建议不要在windows运行和测试

2. 使用forticlent vpn无法进入instance，使用网络uom-internl可以进入。cisco提示中国区无法使用
    - 解决：直接使用cisco，学校web页面提示属于骗人

3. 使用cisco vpn，wsl出现dns域名解析问题，无法连接mrc instance
    - 无法解决，无法使用wsl进行部署，更换macos
    - 或使用远程linux服务器（未尝试）

4. macos brew无法现在
    - 解决，brew core损坏，找到uninstall指令卸载然后重装即可

5. macos出现no found maintest，m1芯片导致的无法拉取镜像问题
    - 尝试 --platform=linux_x86，后续脚本会出现系统版本和镜像版本不一致的问题
    - 尝试拉取couchdb:lastest，在脚本后面依旧会出现版本不一致的情况
    - 建议使用ubuntu系统

6. mrc拉取镜像需要用docker proxy代理吗?
   1. 墨大的代理服务器是啥？
   2. 暂时不用

7. cookie?
   1. 暂时用tutor的

8. 使用compose构建？
   1. 暂时不用

9.  ansible连接docker出现错误fatal: [172.26.133.0]: FAILED! => {"can_talk_to_docker": false, "changed": false, "msg": "Error connecting: Error while fetching server API version: ('Connection aborted.', PermissionError(13, 'Permission denied'))"}
    1.  目测是没有正确添加用户组
    2.  要手动添加吗。。。
    3.  目前手动添加，需要root用户才能access docker socket
    4.  进入instance输入sudo chmod 666 /var/run/docker.sock

10. 拉取镜时 Error pulling ibmcom/couchdb3 - code: None message: open /var/lib/docker/tmp/GetImageBlob517118589: no such file or directory
    1. 挂载数据卷覆盖了docker源文件
       1. 重新启动docker守护进程
       2. systemctl restart docker
        
11. 注意docker容器命名规则

12. curl无法连接''{{inventory_name}}''
    1.  未解决

13. 还需要解决
    1.  动态获得各种host的ip地址
    2.  docker权限
        1.  become: yes
    3.  volumes覆盖
        1.  先做文件系统，在部署docker
    4.  curl connection

14. curl问题很可能是镜像问题
    1.  是/opt/date的权限问题
    2.  如果进行挂载，则用root写，couchdb打不开，出现permission denied，错误
    3.  master端口映射


- 问题，harvester线上问题

- ip: 112
    - docker logs

        ```
        [nltk_data] Downloading package stopwords to /root/nltk_data...
        [nltk_data]   Unzipping corpora/stopwords.zip.
        [nltk_data] Downloading package punkt to /root/nltk_data...
        [nltk_data]   Unzipping tokenizers/punkt.zip.
        ['_replicator', '_users', 'aurin-bars', 'aurin-cafes', 'aurin-carparks', 'aurin-dwellings', 'aurin-employees', 'aurin_sports', 'city', 'foods', 'sports', 'traffic', 'user', 'weather', 'weather-past-10years']
        Connected to Twitter API!
        Search starts
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 40
        ```

    - config/credential.py

        API_KEY = "ExFd8gEydeWtKxE6mRhia7d6T"
        API_KEY_SECRET = "P7FBy0BVQx0bbwbcG258Gb2PBvrf3b3XWR0DT2Q9TBCv3sQxjD"
        ACCESS_TOKEN = "2714319452-6SvB3qxmnMtuazE8olqmSkFOxnV6mVQv7Dl6V2b"
        ACCESS_TOKEN_SECRET = "AMnimdbQgO3DOJk5kdTh8OR0IFcZPeqAysV9hhoVBjEyG"

    - config/dbconfig.py
        ```
        DATABASE_USERNAME = "admin"
        DATABASE_PASSWORD = "admin"
        DATABASE_URL = "http://172.26.133.112:5984/"
        DATABASE_VERSION = '3.0.0'
        DATABASE_COOKIE = 'gQ7wygusPdkybBsmMr4uwGXq'
        ```


- ip:138
    - docker logs
        ```
        [nltk_data] Downloading package stopwords to /root/nltk_data...
        [nltk_data]   Unzipping corpora/stopwords.zip.
        [nltk_data] Downloading package punkt to /root/nltk_data...
        [nltk_data]   Unzipping tokenizers/punkt.zip.
        ['_replicator', '_users', 'aurin-bars', 'aurin-cafes', 'aurin-carparks', 'aurin-dwellings', 'aurin-employees', 'aurin_sports', 'city', 'foods', 'sports', 'traffic', 'user', 'weather', 'weather-past-10years']
        Connected to Twitter API!
        Search starts
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        Stream encountered HTTP error: 401
        ```

    - config/credential.py
        API_KEY = "vTRkuDzcs03q1ivojqreTfNtl"
        API_KEY_SECRET = "jJ1RpLCEb9XptncDEAPJocoHduG3bn4mheFHK1XTRna2hf1UUp"
        ACCESS_TOKEN = "1511218854865031170-g2SRaUF3t0xCSq9AzU3K60KGncR5cu"
        ACCESS_TOKEN_SECRET = "aUU6d2VI9XqEiuyNuyQUbeC7D4JJjpaglmPlq7EqXTB4X"

    - config/dbconfig.py
        ```
        DATABASE_USERNAME = "admin"
        DATABASE_PASSWORD = "admin"
        DATABASE_URL = "http://172.26.132.138:5984/"
        DATABASE_VERSION = '3.0.0'
        DATABASE_COOKIE = 'gQ7wygusPdkybBsmMr4uwGXq'
        ```

- ip: 12
    - docker logs
        ```
        [nltk_data] Downloading package stopwords to /root/nltk_data...
        [nltk_data]   Unzipping corpora/stopwords.zip.
        [nltk_data] Downloading package punkt to /root/nltk_data...
        [nltk_data]   Unzipping tokenizers/punkt.zip.
        ['_replicator', '_users', 'aurin-bars', 'aurin-cafes', 'aurin-carparks', 'aurin-dwellings', 'aurin-employees', 'aurin_sports', 'city', 'foods', 'sports', 'traffic', 'user', 'weather', 'weather-past-10years']
        Connected to Twitter API!
        Search starts
        (db mode) user: 130349600 completed, collected 45 tweets in total.
        (db mode) user: 1356064579 completed, collected 45 tweets in total.
        (db mode) user: 2472410144 completed, collected 192 tweets in total.
        (db mode) user: 1316130270655913984 completed, collected 195 tweets in total.
        (db mode) user: 58609334 completed, collected 198 tweets in total.
        (db mode) user: 4216905732 completed, collected 384 tweets in total.
        Stream connection closed by Twitter
        14946 tweets checked, refresh harvester.
        Search starts
        (db mode) user: 1042272442603855872 completed, collected 6 tweets in total.
        (db mode) user: 22249836 completed, collected 7 tweets in total.
        (db mode) user: 1447943646 completed, collected 8 tweets in total.
        exception: 401 Client Error: Unauthorized unauthorized You are not authorized to access this db. for url: http://172.26.128.12:5984//user
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/909898458407903232
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1273861889370370048
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/244480670
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1357630122216484870
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/556918789
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/167669397
        exception: 401 Client Error: Unauthorized unauthorized You are not a server admin. for url: http://172.26.128.12:5984//_all_dbs
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/4834751002
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1895756396
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/3589942153
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1036966620
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1739973012
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1100681809929498624
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1036966620
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/96690601
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/3589942153
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/496753742
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/257216057
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1503573933261737988
        exception: 401 Client Error: Unauthorized for url: http://172.26.128.12:5984//user/1047337539135135744
        ```

    - config/credential.py
        ```
        API_KEY = "75pOEC17lvdBWqw6JeOXx3P0e"
        API_KEY_SECRET = "JgKkY4KbmbdTu9vvQFqRkUYjRRkQrEiK6HB82BZ86XoIdFV7yC"
        ACCESS_TOKEN = "1512414749459632128-dAAQgxFCb6odngLLIA3TYZgRLymJeE"
        ACCESS_TOKEN_SECRET = "k07hsH2CTKLvJOyOHW0DSZ6LCJ1TnNnZllZU74txVW1iv"
        ```

    - config/dbconfig.py
        ```
        DATABASE_USERNAME = "admin"
        DATABASE_PASSWORD = "admin"
        DATABASE_URL = "http://172.26.128.12:5984/"
        DATABASE_VERSION = '3.0.0'
        DATABASE_COOKIE = 'gQ7wygusPdkybBsmMr4uwGXq'
        ```

- openrc.sh要用source来激活环境变量