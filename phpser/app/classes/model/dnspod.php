<?php
class Model_dnspod {


   
	protected  $config ;	
	protected $appKey = "d0aed048ef3548548471723d136e41f6";
    
	public function __construct($config){

        $this->config = $config;    
    	$this->timestamp = $this->setTimestamp();
    	$this->nonce = $this->setNonce();
    	return $this;
	}

   
   

    


}
