<?php
/**
 * 在线订单操作类，负责核心的wsdl操作请求
 * @package
 * @license
 * @author seaqi
 * @contact 980522557@qq.com / xiayouqiao2008@163.com
 * @version $Id: class.orderonline.php 2011-07-20 15:56:00
 */
class Model_orderonline {
	private static $soapClient;
	private static $token;

	public function __construct($token) {
		self::$token = $token;
		if(is_null(self::$soapClient) || !is_object(self::$soapClient)) {//多次操作有明显效果
			try {
				self::$soapClient = new SoapClient(Model_configuration::ORDERS_OPERATION_URLS,array(true));//这里的联网时间长达99.99%【应按需请求】
			} catch (Exception $e) {
				if(Model_Configuration::DEBUG) {
                                        echo "<html><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><span style='font-weight:bold;'>服务器泡妞去啦,网络错误,请重新尝试:)</span></html>";
					//printf("Message = %s",$e->__toString());
				}
				exit();
			}
		}
	}
	
	private static function common($inputStructMethodName,$customerParameter) {
		try {
			$params = call_user_func_array(array('Model_struct',$inputStructMethodName),$customerParameter);
			
			$result = self::$soapClient->__soapCall($inputStructMethodName,array($params));
			
			$arr = Model_struct::outputStruct($result);
			
			if(is_array($arr) && !empty($arr)) {
				return $arr;
			} else {
				return false;
			}
			
		} catch (Exception $e) {
			if(Model_configuration::DEBUG) {
				printf("方法执行错误<br />Message = %s",$e->__toString());
			}
			exit();
		}
	}
	
	public function __call($inputStructMethodName,$customerParameter) {//依赖接口开发的原则【有没有？接口说得算】
		try {
			$tmp = self::$soapClient->__getFunctions();
			if(is_array($tmp)) {
				foreach($tmp as $theValue) {
					$pos = strpos(strtolower($theValue), strtolower($inputStructMethodName));
					if($pos === false) {
						continue;
					} else {
						return self::common($inputStructMethodName, $customerParameter);
					}
				}
				
				//以上没有正常return说明没有找到指定方法
				throw new Exception('当前没有此服务方法，请检查方法名是否有误');
			} else {
				$pos = strpos($tmp, (string)$inputStructMethodName);
				if($pos === false)
					throw new Exception('当前没有此服务方法，请检查方法名是否有误');
				else
					return self::common($inputStructMethodName,$customerParameter);
			}
		} catch (Exception $e) {
			if(Configuration::DEBUG) {
				printf("检查方法时出错：<br />Message = %s",$e->__toString());
			}
			exit();
		}
	}
}








