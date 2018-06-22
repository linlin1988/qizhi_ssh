<?php
/************************************************************************/
/* AppServ Open Project                                          */
/* Copyright (c) 2001 by Phanupong Panyadee (http://www.appservnetwork.com)         */
/* This program is free software. You can redistribute it and/or modify */
/* it under the terms of the GNU General Public License as published by */
/* the Free Software Foundation; either version 2 of the License.       */
/************************************************************************/

include("main.php");
print "
<pre>
README
-------------------
This is "._APPSERV." "._APPVERSION." "._FOR." "._OS."

"._APPSERV." is an merging open source software installer package for Windows and Linux.
"._APPSERV." features the latest version of all included pacakges, 
user defined configuration during installation, PHP as a module, PEAR, and the Zend Opt

   - "._APACHE." "._VERSION." "._VAPACHE."
   - "._PHP." "._VERSION." "._VPHP."
   - "._MYSQL." "._VERSION." "._VMYSQL."
   - "._PHPMYADMIN." "._VERSION." "._VPHPMYADMIN."
   - "._PERL." "._VERSION." "._VPERL."

More information about AppServ can be found at :
http://www.appservernetwork.com
Author : Phanupong Panyadee
Country : Thailand

HOW TO USE
-------------------
::: Starting Services :::
1. Start Apache Web Server goto Start --> Programs --> AppServ --> Apache Control Server --> Start
2. Start MySQL Database goto  Start --> Programs --> AppServ --> WinMySQLAdmin
3. Go to your http://yourhost.com (http://localhost) 
4. Your web page files store in C:\AppServ\www\
5. PHPNuke Admin go to http://yourhost.com/"._LPHPNUKE."/admin.php Login : God Password: Password
6. phpBB2 Forum Login to Admin go to  http://localhost/"._LPHPBB."/login.php Login : God Password: Password
7. phpMyAdmin Configure go to C:\AppServ\www\\"._LPHPMYADMIN."\config.php
8. Store your webpage file in C:\AppServ\www\
9. Store your Perl CGI file in C:\AppServ\www\

::: Stop Services :::
1. Stop Apache Web Server goto Start --> Programs --> AppServ --> Apache Control Server --> Stop
2. Stop MySQL Database goto  Start --> Programs --> AppServ --> WinMySQLAdmin 
	- Press \"Stop Extended Server Status\" on the bottom left .
	- Right Click --> Stop Service
	- Right Click --> Shut down this tool
	- Wait for 5 Second

::: UNINSTALL :::
1. REMEBER REMBERBER Please Stop Apache and MySQL Services for the first time
2. Remove it !

License
-------------------
AppServ is copyrighted by its authors and licensed under terms of the
GNU Lesser Public License (LGPL) - see file COPYING for details.
";
?>