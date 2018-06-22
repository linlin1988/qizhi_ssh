<?php
/**
 * 对传入之前的数据进行处理及对返回之后的数据进行处理
* @package
* @license
* @author seaqi
* @contact 980522557@qq.com / xiayouqiao2008@163.com
* @version $Id: class.struct.php 2011-07-20 15:56:00
*/

class Model_struct extends  Model_configuration {
	//公共静态属性，资源最小
	private static $returnArr = array();
	private static $isMulArray = false;//输出结果以xml对象表示，使用倒更方便

	private function __construct() { }//此类将不能被实例化

	public static function outputStruct($objectArr) {//处理输出数据
		
		
		if(self::$isMulArray) {
			$lastData = json_encode($objectArr);	
			$lastData = json_decode($lastData, true);//强制数组化【json与乱码】
			return $lastData['out'];
		}
		
		if(gettype($objectArr) == 'object') 
			$objectArr = get_object_vars($objectArr);
	
		foreach($objectArr as $key =>$value) {
			if(gettype($value) == 'object') {
				self::outputStruct($value);
			}
			elseif(gettype($value) == 'array') {
				self::outputStruct($value);
			}
			else {
				self::$returnArr[$key] = $value;
			}
		}
		return self::$returnArr;
	}
	
	
	protected static function returnStructArr($structArray) {//由数组返回对应的结构体数组
		$reObjArr = array();
		$reObjArr[] = self::returnStruct($structArray);
		return $reObjArr;
	}
	
	protected static function returnStruct($structArray) {//返回结构体
		$structName = new stdClass();
		foreach($structArray as $key => $value) {
			$structName->$key = $value;
		}
		return $structName;
	}
	
	protected static function mergeArray($arrs0, $arrs1) {//将外部数据传入到参数模中【完全覆盖】
		foreach($arrs0 as $key0 => $value0) {
			if(isset($arrs1[$key0]) && !empty($arrs1[$key0])) {
				$arrs0[$key0] = $arrs1[$key0];
			} else {
				unset($arrs0[$key0]);
			}
		}
		return $arrs0;
	}


	
	
	/*******在线订单操作********/
	//创建订单
	public static function createOrderService($customerParameter) {//用php基类生成一个结构体【定义参数规则】
		//参数模
		$declareInvoice = array(
				"declareNote" => '',
				"declarePieces" => '',
				"declareUnitCode" => '',
				"eName" => '',
				"name" => '',
				"unitPrice" => ''
		);
		
		$declareInvoiceArray = array();
		foreach ($customerParameter['declareInvoice'] as $value) {
			$tem_declareInvoice = self::mergeArray($declareInvoice, $value);//接受外部参数处理
			$declareInvoiceArray[] = $tem_declareInvoice;//子数组
		}
		
		
		//参数模
		$createOrder = array(
				"buyerId" => '',
				"cargoCode" => '',
				"city" => '',
				"consigneeCompanyName" => '',
				"consigneeEmail" => '',
				"consigneeFax" => '',
				"consigneeName" => '',
				"consigneePostCode" => '',
				"consigneeTelephone" => '',
				"customerWeight" => '',
				"destinationCountryCode" => '',
				"initialCountryCode" => '',
				"insurType" => '',
				"insurValue" => '',
				"orderNo" => '',
				"orderNote" => '',
				"paymentCode" => '',
				"pieces" => '',
				"productCode" => '',
				"returnSign" => '',
				"shipperAddress" => '',
				"shipperCompanyName" => '',
				"shipperFax" => '',
				"shipperName" => '',
				"shipperPostCode" => '',
				"shipperTelephone" => '',
				"stateOrProvince" => '',
				"street" => '',
				"trackingNumber" => '',
				"transactionId" => ''
		);
		
		$createOrder = self::mergeArray($createOrder, $customerParameter);//接受外部参数处理
		
		$createOrderArray = self::returnStructArr($createOrder);//主数组
		
		$createOrderArray[0]->declareInvoice = $declareInvoiceArray;
		
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $createOrderArray
		);
		
//		echo '<pre>';
//		var_dump($temp);
//		echo '</pre>';
		
		return $temp;
	}
	
	
	//预报订单
	public static function preAlertOrderService($customerParameter) {//用php基类生成一个结构体【定义参数规则】
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $customerParameter//self::returnStructArr($customerParameter)
		);
		self::$isMulArray = false;
		return $temp;
	}
	
	
	//创建并预报订单
	public static function createAndPreAlertOrderService($customerParameter) {//用php基类生成一个结构体【定义参数规则】
		//参数模
		$declareInvoice = array(
				"declareNote" => '',
				"declarePieces" => '',
				"declareUnitCode" => '',
				"eName" => '',
				"name" => '',
				"unitPrice" => ''
		);
	
		$declareInvoiceArray = array();
		foreach ($customerParameter['declareInvoice'] as $value) {
			$tem_declareInvoice = self::mergeArray($declareInvoice, $value);//接受外部参数处理
			$declareInvoiceArray[] = $tem_declareInvoice;//子数组
		}

		//参数模
		$createAndPreAlertOrder = array(
				"buyerId" => '',
				"cargoCode" => '',
				"city" => '',
				"consigneeCompanyName" => '',
				"consigneeEmail" => '',
				"consigneeFax" => '',
				"consigneeName" => '',
				"consigneePostCode" => '',
				"consigneeTelephone" => '',
				"customerWeight" => '',
				"destinationCountryCode" => '',
				"initialCountryCode" => '',
				"insurType" => '',
				"insurValue" => '',
				"mctCode" => '',
				"orderNo" => '',
				"orderNote" => '',
				"paymentCode" => '',
				"pieces" => '',
				"productCode" => '',
				"returnSign" => '',
				"shipperAddress" => '',
				"shipperCompanyName" => '',
				"shipperFax" => '',
				"shipperName" => '',
				"shipperPostCode" => '',
				"shipperTelephone" => '',
				"stateOrProvince" => '',
				"street" => '',
				"trackingNumber" => '',
				"transactionId" => ''
		);
	
		$createAndPreAlertOrder = self::mergeArray($createAndPreAlertOrder, $customerParameter);//接受外部参数处理
	
		$createAndPreAlertOrderArray = self::returnStructArr($createAndPreAlertOrder);//主数组
	
		$createAndPreAlertOrderArray[0]->declareInvoice = $declareInvoiceArray;
	
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $createAndPreAlertOrderArray
		);
	
		return $temp;
	}
	
	
	//修改订单
	public static function modifyOrderService($customerParameter) {
		//参数模
		$declareInvoice = array(
				"declareNote" => '',
				"declarePieces" => '',
				"declareUnitCode" => '',
				"eName" => '',
				"name" => '',
				"unitPrice" => ''
		);
		
		$declareInvoiceArray = array();
		foreach ($customerParameter['declareInvoice'] as $value) {
			$tem_declareInvoice = self::mergeArray($declareInvoice, $value);//接受外部参数处理
			$declareInvoiceArray[] = $tem_declareInvoice;//子数组
		}

		
		//参数模
		$modifyOrder = array(
				"buyerId" => '',
				"cargoCode" => '',
				"city" => '',
				"consigneeCompanyName" => '',
				"consigneeEmail" => '',
				"consigneeFax" => '',
				"consigneeName" => '',
				"consigneePostCode" => '',
				"consigneeTelephone" => '',
				"customerWeight" => '',
				"destinationCountryCode" => '',
				"initialCountryCode" => '',
				"insurType" => '',
				"insurValue" => '',
				"orderNo" => '',
				"orderNote" => '',
				"paymentCode" => '',
				"pieces" => '',
				"productCode" => '',
				"returnSign" => '',
				"shipperAddress" => '',
				"shipperCompanyName" => '',
				"shipperFax" => '',
				"shipperName" => '',
				"shipperPostCode" => '',
				"shipperTelephone" => '',
				"stateOrProvince" => '',
				"street" => '',
				"trackingNumber" => '',
				"transactionId" => ''
		);
		
		$modifyOrder = self::mergeArray($modifyOrder, $customerParameter);//接受外部参数处理
		
		$modifyOrderArray = self::returnStructArr($modifyOrder);//主数组
		
		$modifyOrderArray[0]->declareInvoice = $declareInvoiceArray;
		
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $modifyOrderArray
		);
		
		return $temp;	
	}
	
	
	//删除订单
	public static function removeOrderService($customerParameter) {//用php基类生成一个结构体【定义参数规则】
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $customerParameter//self::returnStructArr($customerParameter)
		);
		self::$isMulArray = false;
		return $temp;
	}
	
	
	//查询订单
	public static function findOrderService($customerParameter) {//这个方法没有结构体
		$findOrder = array(
				'orderNo' => '',
				'startTime' => '',//开始时间,默认为创建订单时间结合订单状态(Status)查询
				'endTime' => '',//结束时间,默认为创建订单时间，结合订单状态(Status)查询
				'status' => ''//订单状态，参照订单状态表
		);
		
		$findOrder = self::mergeArray($findOrder, $customerParameter);//接受外部参数处理
		//$findOrder['orderNo'] = array('T20120705009', 'T20120705003', 'T20120705004', 'T20120705005');
		
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $findOrder//这里只接受数组
		);
		self::$isMulArray = false;
		return $temp;
	}
	
	
	
	/*******在线订单操作工具********/
	//运费试算
	public static function chargeCalculateService($customerParameter) {//此方法没有结构体
		$chargeCalculate = array(
			"cargoCode" => '',
			"countryCode" => '',
			"productCode" => array(),
			"displayOrder" => '',
			"postCode" => '',
			"startShipmentId" => '',
			"weight" => '',
			"height" => '',
			"length" => '',
			"width" => ''
		);

		$chargeCalculate = self::mergeArray($chargeCalculate, $customerParameter);//接受外部参数处理

		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $chargeCalculate//这里直接用数组
		);
		
		self::$isMulArray = false;
		
		return $temp;
	}
	

	//查询轨迹
	public static function cargoTrackingService($customerParameter) {//数组
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $customerParameter//这里直接用数组
		);
		self::$isMulArray = false;
		return $temp;
	}

	
	//申请拦截
	public static function cargoHoldService($customerParameter) {//数组
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $customerParameter//这里直接用数组
		);
		self::$isMulArray = false;
		return $temp;
	}
	
	
	//查询跟踪号referenceNumber
	public static function findTrackingNumberService($customerParameter) {//数组
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $customerParameter//这里直接用数组
		);
		self::$isMulArray = false;//采用多维数组输出
		return $temp;
	}
	
	//打印标签 
	public static function printLableService($customerParameter) {//此接口学未实现
		$temp = array(
				'arg0' => AUTHTOKEN,
				'arg1' => $customerParameter//这里直接用数组
		);
		self::$isMulArray = false;
		return $temp;
	}
}









