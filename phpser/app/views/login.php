<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>堡垒机</title>

    <!-- Bootstrap Core CSS -->
    <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- MetisMenu CSS -->
    <link href="/static/sbadmin/vendor/metisMenu/metisMenu.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="/static/sbadmin/dist/css/sb-admin-2.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="/static/sbadmin/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

    <div class="container">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="login-panel panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title" style='font-family:微软雅黑;'>堡垒机</h3>
                    </div>
                    <div class="panel-body">
                        <form action='/qizhi/logincheck' method='post' onsubmit="encrypt_passwd();" >
						
							<input type="hidden" id="login_type" name="login_type">
							<input type="hidden" id="enc_key" name="enc_key">
							<input type="hidden" id="originalpassword" name="originalpassword">
							<input type="hidden" name="rsfc_token" value="xx">
							
                            <fieldset>
                                
                                <div class="form-group">
                                    <input id="userName" class="form-control" placeholder="用户名(大小写区分)" name="login"  autofocus>
                                </div>
                                <div class="form-group">
                                    <input id="password" class="form-control" placeholder="密码" name="password" type="password" value="">
                                </div>
								<div class="form-group">
                                    <input id="bytoken" class="form-control" placeholder="token" name="token" type="text" value="">
                                </div>
                                
                                <!-- Change this to a button or input when using this as a form -->
                                <button type="submit" class="btn btn-info">登录</button>&nbsp;&nbsp;&nbsp;
								<a target='_blank' style='font-family:微软雅黑;' href='/qizhi/help'>帮助文档</a>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery -->
    <script src="/static/bootstrap/js/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="/static/bootstrap/js/bootstrap.min.js"></script>

    <!-- Metis Menu Plugin JavaScript -->
    <script src="/static/sbadmin/vendor/metisMenu/metisMenu.min.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="/static/sbadmin/dist/js/sb-admin-2.js"></script>
	<script type="text/javascript" src="/static/js/rc4.js"></script>
	<script type="text/javascript" src="/static/js/base64.js"></script>
	<script type="text/javascript">
	
		function encrypt_passwd(){
			var passwd = $("#password").val()+$("#bytoken").val(),key=''+Math.round(Math.random()*10000);
			if(passwd.length){
				var mi = toHex(rc4(key,passwd));
				$("#originalpassword").val($("#password").val());
				$("#password").val(mi);
				$("#enc_key").val(Base64.encode(key));
			}
		}
	</script>

</body>

</html>
