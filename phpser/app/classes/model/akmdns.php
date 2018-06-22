<?php
class Model_akmdns {


    /*
    *  Expect 100-continue header is not supported [417] ,添加header 'Expect:',  
    *  Token does not match current token for this zone[409]
    *
    */
	public  $config ;	
	public $timestamp;
	public $nonce;	
	protected $auth = array();
    protected $max_body_size = 131072;
    protected $headers_to_sign = array();   
    public $httpMethod ;
    public $host ;
    public $path ;


	public function __construct($config){

        $this->config = $config;    
    	$this->timestamp = $this->setTimestamp();
    	$this->nonce = $this->setNonce();
    	return $this;
	}

   
   

    public  function  setPath($path){
        $this->path = $path;
    }
      
    public  function denis($url,$headers=false,$post_data=false){

                     
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, FALSE);

            if($post_data){
                curl_setopt($ch, CURLOPT_POST, true);
            }else{
                curl_setopt($ch, CURLOPT_POST, false);
            }
            
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            if($post_data){
                curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data); 
            }
            $output = curl_exec($ch);

            $xxx = json_encode($headers);
            //test
            file_put_contents("/tmp/.dnsapi.log", "[url]:{$url} :\n",FILE_APPEND);
            file_put_contents("/tmp/.dnsapi.log", "[header]\n",FILE_APPEND);
            file_put_contents("/tmp/.dnsapi.log", "{$xxx}\n",FILE_APPEND);
            file_put_contents("/tmp/.dnsapi.log", "[result]\n",FILE_APPEND);
            file_put_contents("/tmp/.dnsapi.log", "{$output}\n",FILE_APPEND);
            //test  
            return $output;
            

    }

    public function returnAuth(){

    	$tmp = array();
    	$tmp['client_token'] = $this->cfg['client_token'];
    	$tmp['access_token'] = $this->cfg['access_token'];
    	$tmp['client_secret'] = $this->cfg['client_secret'];
    	return $tmp;
    }

    //获取zone下dns解析列表
    public function getResult($path){


        
        $this->httpMethod = "GET";
        $this->setPath($path);
        $url = "https://".$this->config['host'].$path;
        $auth_headers =  $this->createAuthHeader();

        $headers = array(
            'Authorization:'.$auth_headers,                       
        );

        $rs = $this->denis($url,$headers);
        return $rs;


   }

    //post数据到zone
    //data 要求 json格式
    public function postResult($path,$data){

        $this->httpMethod = "POST";
        $this->setPath($path);
        $url = "https://".$this->config['host'].$path;
        $this->config['body'] = $data;
        $auth_headers =  $this->createAuthHeader();
        $request_headers = array(
            'Authorization:'.$auth_headers,            
            'Content-Type:application/json;',   
            //'Accept:text/html,application/xhtml+xml',   
            'user-agent:'.$this->config['user-agent'],   
            'Referer:https://control.akamai.com/apiprov/?tab=CONFIGURE&type=context&gid=67952',
            'Expect:',     
        );

        
        $rs = $this->denis($url,$request_headers,$data);
        return $rs;

    }


	


	public function createAuthHeader()
    {
       
        $auth_header =
            'EG1-HMAC-SHA256 ' .
            'client_token=' . $this->config['client_token'] . ';' .
            'access_token=' . $this->config['access_token'] . ';' .
            'timestamp=' . $this->timestamp . ';' .
            'nonce=' . $this->nonce . ';';



        file_put_contents("/tmp/.xxxx", "pp:".$auth_header . 'signature=' . $this->signRequest($auth_header)."\n",FILE_APPEND);
        return $auth_header . 'signature=' . $this->signRequest($auth_header);
    }

    public  function setTimestamp(){
        $xx = new DateTime("now", new DateTimeZone('UTC'));
        return $xx->format('Ymd\TH:i:sO');		
    }

    public function setNonce(){
    	return $this->getGUID();
    }


    public function getGUID(){
    	if (function_exists('com_create_guid')){
        	return com_create_guid();
    	}else{

        	mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        	$charid = strtoupper(md5(uniqid(rand(), true)));
        	$hyphen = chr(45);// "-"
        	$uuid = chr(123)// "{"
            .substr($charid, 0, 8).$hyphen
            .substr($charid, 8, 4).$hyphen
            .substr($charid,12, 4).$hyphen
            .substr($charid,16, 4).$hyphen
            .substr($charid,20,12)
            .chr(125);// "}"

            $uuid = str_replace("{", "", $uuid);
            $uuid = str_replace("}", "", $uuid);
        	return strtolower($uuid);
    	}
	}

    protected   function signRequest($auth_header)
    {

        file_put_contents("/tmp/.xxxx", $this->makeDataToSign($auth_header)."\n",FILE_APPEND);
        return $this->makeBase64HmacSha256(
            $this->makeDataToSign($auth_header),
            $this->makeSigningKey()
        );
    }


    protected  function makeBase64HmacSha256($data, $key)
    {
    	
    	
        $hash = base64_encode(hash_hmac('sha256', (string) $data, $key, true));
        return $hash;
    }

    /**
     * Returns Base64 encoded SHA256 Hash
     *
     * @param string $data
     * @return string
     */
    protected function makeBase64Sha256($data)
    {
        $hash = base64_encode(hash('sha256', (string) $data, true));
        return $hash;
    }



    protected function makeContentHash()
    {


        if (empty($this->config['body'])) {
            return '';
        } else {
            // Just substr, it'll return as much as it can
            return $this->makeBase64Sha256(substr($this->config['body'], 0, $this->max_body_size));
        }
    }

    protected function makeDataToSign($auth_header)
    {
        $query = '';
        if (isset($this->config['query']) && $this->config['query']) {
            $query .= '?';
            if (is_string($this->config['query'])) {
                $query .= $this->config['query'];
            } else {
                $query .= http_build_query($this->config['query'], null, '&', PHP_QUERY_RFC3986);
            }
        }

        

        $data = array(
            strtoupper($this->httpMethod),
            'https',
            $this->config['host'],
            $this->path . $query,
            $this->canonicalizeHeaders(),
            (strtoupper($this->httpMethod) == 'POST') ? $this->makeContentHash() : '',
            $auth_header
        );

        //var_dump($data);die;
        return implode("\t", $data);
    }

    protected  function  makeSigningKey()
    {
        $key = self::makeBase64HmacSha256((string) ($this->timestamp), $this->config['client_secret']);
        return $key;
    }

    public function setHeadersToSign(array $headers)
    {
        $this->authentication->setHeadersToSign($headers);

        return $this;
    }

    protected function canonicalizeHeaders()
    {
        $canonical = array();
        $headers = array();
        if (isset($this->config['headers'])) {
            $headers = array_combine(
                array_map('strtolower', array_keys($this->config['headers'])),
                array_values($this->config['headers'])
            );
        }

        foreach ($this->headers_to_sign as $key) {
            $key = strtolower($key);
            if (isset($headers[$key])) {
                if (is_array($headers[$key]) && sizeof($headers[$key]) >= 1) {
                    $value = trim($headers[$key][0]);
                } elseif (is_array($headers[$key]) && sizeof($headers[$key]) == 0) {
                    continue;
                } else {
                    $value = trim($headers[$key]);
                }

                if (!empty($value)) {
                    $canonical[$key] = preg_replace('/\s+/', ' ', $value);
                }
            }
        }

        ksort($canonical);
        $serialized_header = '';
        foreach ($canonical as $key => $value) {
            $serialized_header .= $key . ':' . $value . "\t";
        }

        file_put_contents("/tmp/.xxxx", "serialized_header:".$serialized_header."\n",FILE_APPEND);
        return rtrim($serialized_header);
    }


}
