<?php
/**
 * 对整个SDK进行配置的基类
 * @package 
 * @license 
 * @author seaqi
 * @contact 980522557@qq.com / xiayouqiao2008@163.com
 * @version $Id: class.config.php 2011-07-20 15:56:00
 */

class Model_configuration {
	//在线订单操作
	const ORDERS_OPERATION_URLS = 'http://api.4px.com/OrderOnlineService.dll?wsdl';
	//const ORDERS_OPERATION_URLS = 'http://api.4px.com:8058/OrderOnline/ws/OrderOnlineService.dll?wsdl';
	const ORDERS_TOOLS_URLS = 'http://api.4px.com/OrderOnlineToolService.dll?wsdl';
	const DEBUG = true;
}
