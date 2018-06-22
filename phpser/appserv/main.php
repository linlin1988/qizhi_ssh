<?php
/************************************************************************/
/* AppServ Open Project                                          */
/* Copyright (c) 2001 by Phanupong Panyadee (http://www.appservnetwork.com)         */
/* This program is free software. You can redistribute it and/or modify */
/* it under the terms of the GNU General Public License as published by */
/* the Free Software Foundation; either version 2 of the License.       */
/************************************************************************/
if (empty($appservlang)) {
$appservlang = getenv("HTTP_ACCEPT_LANGUAGE");
}
switch ($appservlang)
	{
	case "th" :
	include("lang-thai.php");
	break;
	case "en" :
	include("lang-english.php");
	break;
	default :
	include("lang-english.php");
	break;
}
define("_LPHPMYADMIN","phpMyAdmin");
define("_LPERL","/cgi-bin/");
define("_APPVERSION","2.5.10");
define("_VMYSQL","5.0.51b");
define("_VPHP","5.2.6");
define("_VAPACHE","2.2.8");
define("_VPHPMYADMIN"," 2.10.3");
define("_APPSERV","AppServ");
?>