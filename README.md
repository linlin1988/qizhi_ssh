# 系统介绍

适用于使用了 "齐治科技堡垒主机" 的企业</br>
主要功能是利用中转手段,绕过商用1000台服务的限制</br>
使得齐治支持10万台服务器登录</br>


# 为啥做这个系统

公司里一开始引进了齐治堡垒机, 但是原生的系统有几个问题</br>
</br>
a) 界面难看死了</br>
b) 没办法关联项目</br>
c) 最重要的是它只支持1000台记录的录入, 多了就无法通过堡垒机登录审计了</br>
d) 录入机器贼麻烦</br>

于是我就有了一个想法</br>
可否封装一个web页面, 利用cookie模拟登陆的手法, 去调用齐治的接口, 获得它的session_id;</br>
再利用session_id 去请求它的服务接口, 获得加密串 最后再拦截登录过程</br>
在调用齐治前, 注入用户的账号密码到xshell软件的配置</br>
然后再利用加密串调用齐治本身</br>

最重要的是要绕过他1000台服务器的限制 !! 为公司节约成本

# 功能截图

开源版本功能阉割了,只有ip列表+登录按钮
机器列表</br>

<img src='https://raw.githubusercontent.com/linlin1988/qizhi_ssh/master/img/index.png'> </br>

点击"登录" 按钮后</br>
系统会全自动登录机器. ip,账号,密码 均不用输入</br>


<img src='https://raw.githubusercontent.com/linlin1988/qizhi_ssh/master/img/loging.png'> </br>


# 系统限制

a) 企业里有使用 齐治科技堡垒主机</br>
b) 客户端仅支持windows主机</br>
c) 客户端主机需安装xshell 4 或者 5 这2个版本</br>
d) 服务器是使用个人ldap账号登录</br>



# 部署文档

## phpserv

lnmp环境</br>

```
安装手法忽略..

```
nginx配置</br>

```

server
{
       listen       80;
       server_name  xxx.oa.com;


       location / {
                root   /data/wwwroot/phpser/;
                index  index.php index.html index.htm ;

                if (!-e $request_filename) {
                        rewrite ^/(.*)$ /index.php/$1 last;
                }
       }


       location ~ /(.*)\.php(.*)$ {
          root /data/wwwroot/phpser/;
          fastcgi_pass  unix:/dev/shm/php-cgi.sock;
          fastcgi_index  index.php;
          fastcgi_param  SCRIPT_FILENAME  /$document_root$fastcgi_script_name;
          include        fastcgi_params;
        }

}

```


## windows 客户端 部署

1. 安装xshell 4 或者 5</br>
2. (一次性工作) 提前编译一个qizhissh.exe 给用户安装</br>

```
#需要用到pyinstaller把python文件变成exe文件

python pyinstaller.py -F qizhissh.py 

```

3. 用户使用管理员账号直接运行 qizhissh.exe 注册 windows 注册表</br>

运行后会在HKEYS_CLASSES_ROOT下有一个 qizhissh 目录, 效果如下</br>
<img src='https://raw.githubusercontent.com/linlin1988/qizhi_ssh/master/img/regpic.png'> </br>




## 部署好后如何使用

用户只要轻松的打开这套系统的网站, 如 http://ssh.oa.com/ </br>
然后点击 "登录" 按钮,即可全自动登录服务器 </br>

