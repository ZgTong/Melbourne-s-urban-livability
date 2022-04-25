
## 记录部署问题

1. 同样的脚本在本机wsl下出现ansible syntax error "-name ^ here"
    - 解决：win和linux编码问题，重新复制或者重制wsl即可

2. 使用forticlent vpn无法进入instance，使用网络uom-internla可以进入。cisco提示中国区无法使用
    - 解决：直接使用cisco，学校web页面提示属于骗人

3. 使用cisco vpn，wsl出现dns域名解析问题，无法连接mrc instance
    - 无法解决，无法使用wsl进行部署，更换macos
    - 或使用远程linux服务器（未尝试）

4. macos brew无法现在
    - 解决，brew core损坏，找到uninstall指令即可

5. macos出现no found maintest，m1芯片导致的无法拉取镜像问题
    - 尝试 --platform=linux_x86，后续脚本会出现系统版本和镜像版本不一致的问题
    - 尝试拉取couchdb:lastest

6. mrc拉取镜像需要用docker proxy代理吗?
   1. 墨大的代理服务器是啥？
   2. 暂时不用

7. cookie?

9. 使用compose构建

