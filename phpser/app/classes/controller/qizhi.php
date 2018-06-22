<?php defined('SYSPATH') or die('No direct script access.');


class Controller_qizhi extends Controller {


    //齐治科技的js文件会来访问这个url检查用户是否登录
    //这里直接返回1 就可以了
    public function action_server_grid_getaccount(){
        echo "1";
    }

    //这个也是js请求的,直接返回0 表示没问题
    public function action_authorize_identities(){
        echo "0";
    }

    //返回齐治堡垒机的http hostname
    public static function get_qizhi(){
        //就是花钱买的那台堡垒机设备
        return "https://js.oa.com/";
    }

    //返回齐治堡垒机的域名
    public static function getHost(){
        //就是花钱买的那台堡垒机设备
        return "js.oa.com";
    }    	

    //齐治堡垒机的js在用户点击了图标后首先请求这个url
    public function action_tui_client(){


        /*

            最重要的一个异步请求
            通过发送自己的cookies + post data server_id 获取 堡垒机返回的ssh登录信息.
            堡垒机返回的数据格式如下
            其中PWD是没办法伪造的,所以要写这个方法封装一下,异步请求就是为了拿到这个PWD,其他都可以伪造

            {"Host":"xxxx.com","Port":"22","User":"xx","PWD":"OTP1:xx","SessionName":"xxx","SessionHost":"xx","SessionAccount":"any","SessionTitle":"xx","Proto":"ssh","Tab":1}

        */

        $username = self::is_login();		
        $url = self::get_qizhi() . "client/tui_client.php";
        $headers = array(
            'Host' => self::getHost(),
            'Referer' => self::get_qizhi() . "client/index-new.php",
            'Origin' => self::get_qizhi(),
        );
        $user_agent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36";
        $post_data = $_POST;
        $post_data = http_build_query($post_data);        
        $output = self::mycurl($url."?".$post_data,$post_data,$headers,$user_agent);


        //如果sessionid在堡垒机那边失效,就输出error,理论上返回值是json,不是html文本
        if(preg_match("/html/", $output)){
            echo '{"error":"no log in"}';die;
            //输出一个错误信息给前端, js捕获到会要求重新登陆一次堡垒机
        }

        //这个remote_app是html里的ul_service li 里面的app 传过来的,默认启动xshell, 这里自定义篡改成为crt
        if(isset($_POST['remote_app']) && $_POST['remote_app']=='crt'){
            //新增一个参数发给inflate
            $output = json_decode($output,True);
            $output['remote_app'] = "crt";
            $output = json_encode($output);
            echo $output;
        }else{
            $output = json_decode($output,True);
            $target_ip = explode("|", $_POST['target_ip']);
            $output['target_ip'] = $target_ip[1];
            $output['SessionTitle'] = $target_ip[1];
            $output = json_encode($output);
            echo $output;
        }
                
    }

    /*
    *  请求完tui_client后会再请求这个inflat,他是直接启动shterm工具的
    *  返回值也是没办法伪装的,所以也封装了一层,做转发给inflate.这样js才能正确启动shterm
    */
    public function action_inflate(){
   
        $url = self::get_qizhi() . "client/inflate.php";
        if(!isset($_POST['data'])){
            echo "Error";
            return ;
        }

        $user = self::is_login();
        $sess_name = self::fpost($user);
        //请求参数是tui_client丢过来的.
        $data = $_POST['data'];
        $tmp = array();
        $tmp=json_decode($data,true);
        $tmp['url'] = self::getHost();
        $target_ip = $tmp['target_ip'];

        //改写启动app,默认是xsehll
        if(isset($tmp['remote_app']) && $tmp['remote_app']=='crt'){
            $tmp['app'] = 'securecrt';
        }

        
        $tmp=json_encode($tmp);
        $data=$tmp;

        $headers = array(
            'Host' => self::getHost(),
            'Referer' => self::get_qizhi() . 'client/index-new.php',
            'Origin' => self::getHost()
        );


        $post_data = array (
            'data' => $data,
        );
        $post_data = http_build_query($post_data);        
        $output = self::mycurl($url."?".$post_data,$post_data,$headers);
        echo $output.";".$target_ip.";".base64_encode($sess_name).";".base64_encode(Cookie::get('realpassword'));
        
    }
   

    public function action_gui_client(){


        /*

            转发gui_client请求给齐治堡垒机

        */


        $url = self::get_qizhi() . "client/gui_client.php";
        $headers = array(
            'Host' => self::getHost(),
            'Referer' => self::get_qizhi() . 'client/index-new.php',
            'Origin' => self::get_qizhi(),
        );
        $user_agent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36";
        $post_data = $_POST;
        $post_data = http_build_query($post_data);      
        $output = self::mycurl($url."?".$post_data,$post_data,$headers,$user_agent);

        //这个remote_app是html里的ul_service li 里面的app 传过来的,默认启动xshell, 这里自定义篡改成为crt
        if(isset($_POST['remote_app']) && $_POST['remote_app']=='crt'){
            //新增一个参数发给inflate            
            $output = json_decode($output,ture);
            $output['remote_app'] = "crt";
            $output = json_encode($output);
            echo $output;
        }else{
            $output = json_decode($output,ture);
            $target_ip = explode("|", $_POST['target_ip']);
            $output['target_ip'] = $target_ip[1];
            $output['SessionTitle'] = $target_ip[1];
            $output = json_encode($output);
            echo $output;
        }
        
    }
    
    public function action_logout(){

        Session::instance()->delete('username');
        echo "<script>location.href='/qizhi/login';</script>";

    }    

    //首页
    public function action_index(){

        $user = self::is_login();
        $user = self::fpost($user);     
		$ipStr = "";
        $is_mohu = Session::instance()->get('mohu');   

        //ip查询条件
        if(isset($_POST['ip'])){
            $ip = self::fpost($_POST['ip']);
            //是否模糊查询
            if($is_mohu=='fuckyes'){
                $ipStr = " and ( ip like '%{$ip}%' or private_ip like '%{$ip}%' ) ";
            }else{
                $ipStr = " and ( ip like '{$ip}' or private_ip like '{$ip}' ) ";
            }
        }
        
        //获取一台代理机
        $rand_zhongzhuan = $this->rand_zhongzhuan();
        //查询机器列表
        $db = Database::instance('qizhi');      
        $sql = "select ip,private_ip from server_list where 1=1 ".$ipStr." order by ip desc";    
        $rs = $db->query(DATABASE::SELECT,$sql)->as_array();
        //视图层
        $page_view = View::factory('bootstrap');
        $page_view->rs = $rs;
        $page_view->username = $user;
		$page_view->server_id = $rand_zhongzhuan['server_id'];
        $page_view->service_id = $rand_zhongzhuan['service_id'];
        $page_view->master_ip = $rand_zhongzhuan['master_ip'];
        $this->response->body($page_view);

    }

      
    //判断是否登录
    public static function is_login(){
		
        if( ! Cookie::get('realpassword') || ! Session::instance()->get('username') ){
            echo "<script>location.href='/qizhi/login';</script>";
            die;
        }
        return self::fpost(Session::instance()->get('username'));
    }
    
    //登录页面
    public function action_login(){

        if(isset($_SERVER['HTTP_REFERER'])){
            Session::instance()->set('referer',$_SERVER['HTTP_REFERER']);
        }
        $page_view = View::factory('login');        
        $this->response->body($page_view);

    }	
	

    //是否模糊查询, 存session
    public function action_setmohu(){

		$username = self::is_login();
        $username = self::fpost($username);
        if(Session::instance()->get('mohu')){

            if(Session::instance()->get('mohu')=='fuckyes'){
                Session::instance()->set('mohu','fuckno');
            }else{
                Session::instance()->set('mohu','fuckyes');
            }

        }else{

            Session::instance()->set('mohu','fuckyes');

        }

    }


    
    public function action_logincheck(){

        //封装一层登录请求到堡垒机的web服务器,其实是在堡垒机登录
        $enc_key = $_POST['enc_key'];
        $rsfc_token = $_POST['rsfc_token'];
        $login = $_POST['login'];
        $password = $_POST['password'];
        $locale = $_POST['locale'];       
        $byToken = $_POST['token'];
        //没加密之前的密码

        $realpassword = $_POST['originalpassword'];
        $jarRoot = dirname(__FILE__) . "/jar/";
        $url = self::get_qizhi() . "login.php";
        $post_data = array(

            'login_type' => '',
            'enc_key' => $enc_key,
            'login' => $login,
            'password' => $password,
            'locale' => 'default',
        );

        $qizhiHost = self::getHost();
         $headers = array(
            'Accept: Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Cache-Control:no-cache',
            'Accept-Encoding:gzip, deflate, br',
            'Accept-Language:zh-CN,zh;q=0.8',
            'Connection:keep-alive',
            'Content-Type:application/x-www-form-urlencoded',
            'Host: '.$qizhiHost,
            'Referer: https://'.$qizhiHost.'/index.php',
            'Origin: https://'.$qizhiHost,
            'Upgrade-Insecure-Requests:0',
            'Pragma:no-cache',
        );


        $user_agent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36";
        $output = self::curl_login($url,$post_data,$headers,$user_agent,$login);

        //登录成功
        if($output=="logOK"){

            if(file_exists($jarRoot.$login.".tmp")){
                $cnt = file_get_contents($jarRoot.$login.".tmp");
                preg_match_all("/PHPSESSID(.*)/", $cnt,$tmp);
                $storeId = trim($tmp[1][0]);
                //存入一个session文件
                file_put_contents($jarRoot.$login.".sessionid", $storeId);
                //删除临时文件
                unlink($jarRoot.$login.".tmp");
                Session::instance()->set('username',$login);
                Cookie::set('realpassword',$realpassword);

                if($rw = Session::instance()->get('referer') ){

                    if(preg_match("/logout/",$rw) || preg_match("/login/", $rw)){
                        //为了防止logout过来的跳转,登录后再去logout
                        echo "<script>location.href='/';</script>";
                    }else{
                        echo "<script>location.href='{$rw}';</script>";
                    }
                    
                }else{
                    echo "<script>location.href='/';</script>";
                }

            }else{

                return "error";

            }


        //登录失败
        }else{

            echo "<script>alert('username or password error');location.href='/qizhi/login';</script>";

        }


    }
    

    //转发登录请求到奇治堡垒机, 需要特殊处理一下
    public static function curl_login($url,$post_data,$headers=false,$user_agent=false,$username){

            $jarRoot = dirname(__FILE__) . "/jar/";
            //保存一个齐治那边给过来的cookie
            $cookie_file = $jarRoot . $username.".tmp";
            $post_data = http_build_query($post_data);
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); 
            if($headers){
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            }            
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);    
            curl_setopt($ch, CURLOPT_COOKIEJAR,  $cookie_file); 
            $output = curl_exec($ch);
            $info = curl_getinfo($ch); 
            $logdata = json_encode($info);

            //如果没有跳转到首页, 证明在齐治那边验证通过了
            if( ! preg_match("/index\.php/", $info['redirect_url']) && $info['redirect_url'] != ""){
                $return = "logOK";
            }else{
                $return = $output;
            }			
            return $return;           

    }

    
    public static function mycurl($url,$post_data,$headers=false,$user_agent=false){
           
            $jarRoot = dirname(__FILE__) . "/jar/";
            $username = Session::instance()->get('username');
            $session_id = file_get_contents($jarRoot.$username.".sessionid");
            //用齐治堡垒机的session id 去请求 齐治堡垒机
            $ck_content = "PHPSESSID=".$session_id;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); 
            if($headers){
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            }
            if($user_agent){
                curl_setopt($ch, CURLOPT_USERAGENT,$user_agent); 
            }
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
            curl_setopt($ch, CURLOPT_COOKIE, $ck_content);
            $output = curl_exec($ch);            
            return $output;
    }

	
	//随机返回一个中转机
	public function rand_zhongzhuan(){
	
		$sql = "select server_id,service_id,private_ip as master_ip from proxy_server";
		$db = Database::instance('qizhi');
		$rs = $db->query(DATABASE::SELECT,$sql)->as_array();		
		$rand = array_rand($rs,1);
		return $rs[$rand];
	
	}
	
	//从数据库里查询代理机信息,返回json格式给前端
	public function action_server_list(){
		
		$sql = "select baolei_info from proxy_server";
		$list_tpl = '{"total":"3","server_list":[';
		$db = Database::instance('qizhi');  
		$rs = $db->query(DATABASE::SELECT,$sql)->as_array();
		
		if($rs){

			$i=1;
			foreach($rs as $key => $value){
				
				if($i==1){         
				
                    $list_tpl .= $value['baolei_info'];                       
                      
                }else{          
				
                    $list_tpl .= "," . $value['baolei_info'];                                              
                                                
                }
				
				$i++;
				
			}
			
			$list_tpl .= "]}";            
            echo $list_tpl;		
		
		}
		
	}
		  
	//过滤用户参数
    public static function fpost($value){         
        return $value;	
    }    	
    	
}
