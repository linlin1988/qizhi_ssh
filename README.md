# 系统介绍

适用于使用了 "齐治科技堡垒主机" 的企业</br>
主要功能是利用中转手段,绕过商用1000台服务的限制</br>
使得齐治支持10万台服务登录</br>


# 功能截图

机器列表</br>

<img src='https://raw.githubusercontent.com/linlin1988/qizhi_ssh/master/img/index.png'> </br>

点击"登录" 按钮后, 全自动登录机器. </br>

<img src='https://raw.githubusercontent.com/linlin1988/qizhi_ssh/master/img/loging.png'> </br>


# 系统限制

a) 企业里有使用 齐治科技堡垒主机</br>
b) 客户端仅支持windows主机</br>
c) 客户端主机需安装xshell 4 或者 5 这2个版本</br>

# 免责声明

仅用于开源社区的学习交流</br>
以其他盈利目的使用此软件与此账号无关</br>



# 部署文档


## phpserv

lnmp环境
```
安装手法忽略..

```
nginx配置

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


## windows 客户端

1. 安装xshell 4 或者 5</br>
2. 提前编译一个qizhissh.exe 给用户安装  (需要用到pyinstall)</br>

```
python pyinstaller.py -F qizhissh.py 

```

3. 用户使用管理员账号直接运行 qizhissh.exe 注册 windows 注册表</br>

注册完后会在HKEYS_CLASSES_ROOT下有一个 qizhissh 目录, 效果如下
<img src='https://raw.githubusercontent.com/linlin1988/qizhi_ssh/master/img/regpic.png'> </br>