
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

10. 拉取镜时 Error pulling ibmcom/couchdb3 - code: None message: open /var/lib/docker/tmp/GetImageBlob517118589: no such file or directory
    1. 挂载数据卷覆盖了docker源文件
       1. 重新启动docker守护进程
       2. systemctl restart docker
        
11. 注意docker容器命名规则