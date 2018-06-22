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
โปรดอ่าน 
-------------------
นี่คือโปรแกรม "._APPVERSION." "._FOR." "._OS."

"._APPSERV." คือโปรแกรมที่รวบรวมโอเพ่นซอร์สซอฟท์แวร์หลายๆ อย่างเข้าด้วยกัน สำหรับ "._OS."
"._APPSERV." ได้รวบรวมโปรแกรมล่าสุดไว้ในในแพ๊คเกจนี้ทั้งหมด

   - "._APACHE." "._VERSION." "._VAPACHE."
   - "._PHP." "._VERSION." "._VPHP."
   - "._MYSQL." "._VERSION." "._VMYSQL."
   - "._PHPMYADMIN." "._VERSION." "._VPHPMYADMIN."
   - "._PERL." "._VERSION." "._VPERL."

รายละเอียดอื่นๆ ที่เกี่ยวกับ "._APPSERV." ติดตามได้ที่ :
http://www.appservernetwork.com
ผู้จัดทำ : ภาณุพงศ์ ปัญญาดี
ประเทศ : ไทย

วิธีการใช้งาน
-------------------
::: Starting Services :::
1. รัน Apache Web Server ไปที่ Start --> Programs --> AppServ --> Apache Control Server --> Start
2. รัน MySQL Database ไปที่  Start --> Programs --> AppServ --> WinMySQLAdmin
3. เข้าไปที่ http://yourhost.com (http://localhost) 
4. เว็บเพจต่างๆ จะเก็บไว้ที่ C:\AppServ\www\
5. สำหรับการเข้าสู่ PHPNuke Admin ให้ไปที่  http://yourhost.com/"._LPHPNUKE."/admin.php ป้อน Login : God Password: Password
6. การเข้าสู่หน้า phpBB2 Admin ให้ไปที่ http://localhost/"._LPHPBB."/login.php Login : God Password: Password
7. แก้ไข config ของ phpMyAdmin แก้ได้ที่ C:\AppServ\www\\"._LPHPMYADMIN."\config.php
8. เมื่อคุณต้องการสร้างเว็บให้เก็บไฟล์ไว้ที่ C:\AppServ\www
9. เมื่อคุณต้องการเก็บ CGI ที่เขียนจาก Perl ให้เก็บไว้ที่ C:\AppServ\www\cgi-bin

::: Stop Services :::
1. ปิดการทำงาน Apache Web Server ไปที่ Start --> Programs --> AppServ --> Apache Control Server --> Stop
2. ปิดการทำงาน MySQL Database ไปที่  Start --> Programs --> AppServ --> WinMySQLAdmin 
	- กด \"Stop Extended Server Status\" ตรงขอบล่างซ้าย
	- คลิกขวา --> Stop Service
	- คลิกขวา --> Shut down this tool
	- โปรดรอ 5 วินาที

::: ลบออก :::
1. โปรดจำ โปรดจำ กรุณาปิด Services ของ Apache และ MySQL ก่อนการ uninstall ทุกครั้ง
2. อย่าลืม Backup www directory ของคุณด้วย
3. ลบได้เลย :-)

License
-------------------
AppServ is copyrighted by its authors and licensed under terms of the
GNU Lesser Public License (LGPL) - see file COPYING for details.
";
?>