# -*- coding:utf-8 -*- 


import sys
import os
import shutil
import base64
import _winreg
import re
import shutil
import time




def tolog(path,content):

	try:
		trykey = _winreg.OpenKey(_winreg.HKEY_CLASSES_ROOT,"qizhissh\\shell\\open\\command")
		value, typex = _winreg.QueryValueEx(trykey, "logdir")
		logdir = value.encode('utf-8')
		logdir = logdir.replace('\\',"/")
	except WindowsError:
		print "find logdir regedit error"
	try:
		myfile = open("%s/qizhissh.log"%(logdir),'a')
		content = content.encode("utf8")
		myfile.write(content+"\n")
		myfile.close()
	except WindowsError:
		print "write log windows error"
	


def reg_url_protocal(protoName,command,logdir):

	try:

		keyval=r"%s\shell\open\command" % (protoName)
		keyval2=r"%s\shell" % (protoName)
		if not os.path.exists("keyval"):
			key = _winreg.CreateKey(_winreg.HKEY_CLASSES_ROOT,keyval)
		Registrykey= _winreg.OpenKey(_winreg.HKEY_CLASSES_ROOT, keyval, 0,_winreg.KEY_WRITE)
		Registrykey2= _winreg.OpenKey(_winreg.HKEY_CLASSES_ROOT, keyval2, 0,_winreg.KEY_WRITE)
		Regqizhissh= _winreg.OpenKey(_winreg.HKEY_CLASSES_ROOT, r"%s" % (protoName), 0,_winreg.KEY_WRITE)
		_winreg.SetValueEx(Registrykey,"",0,_winreg.REG_SZ,command)
		_winreg.SetValueEx(Registrykey,"logdir",0,_winreg.REG_SZ,logdir)
		_winreg.SetValueEx(Registrykey2,"",0,_winreg.REG_SZ,"open")
		_winreg.SetValueEx(Regqizhissh,"URL Protocol",0,_winreg.REG_SZ,"")
		_winreg.CloseKey(Registrykey)
		_winreg.CloseKey(Registrykey2)
		_winreg.CloseKey(Regqizhissh)
		print "regist ok"
		os.system('pause')
	except WindowsError:
		print "regist error"
		sys.exit(0)


selfpath = os.path.split(os.path.realpath(__file__))[0]

def finddefault(findPath):

	if findPath in (u"D:\\",u"C:\\",u"E:\\",u"F:\\"):
		return False

	try:
		tryFile = u"%s%s%s" % (findPath,os.path.sep,"default")
		tolog(selfpath,"find default file in :%s" % tryFile)
		if os.path.exists(tryFile):
			return findPath
		else:
			findPath = os.path.dirname(findPath)
			finddefault(findPath)
	except Exception,e:
		tolog(selfpath,"findDeault function error: %s" % e)



if len(sys.argv) == 1:

	#如果没有参数,则创建注册列表
	
	reg_url_protocal("qizhissh",'"%s\%s" "%s"' % (selfpath,"qizhissh.exe","%1"),selfpath)
	sys.exit(0)



data=sys.argv[1]
tolog(selfpath,"paramas 1 %s" % data)
data=data.replace("qizhissh://","")





data=data.split(";")


xshellTemp = '\
[CONNECTION:SERIAL]\n\
Parity=0\n\
StopBits=0\n\
ComPort=0\n\
BaudRate=6\n\
FlowCtrl=0\n\
DataBits=3\n\
[CONNECTION]\n\
Name=qizhissh\n\
Port=22\n\
Protocol=SSH\n\
SendKeepAliveInterval=60\n\
AutoReconnect=0\n\
TCPKeepAlive=0\n\
KeepAliveInterval=60\n\
KeepAliveString=\n\
AutoReconnectInterval=30\n\
Host=qizhissh\n\
Title=deniss\n\
Display=ddd\n\
KeepAlive=1\n\
SendKeepAlive=0\n\
AutoReconnectLimit=0\n\
[Information]\n\
Description=Xshell Session Profile\n\
Title=denis\n\
TerminalTitle=denis\n\
Display=ddd\n\
MinorVersion=0\n\
MajorVersion=3\n\
[CONNECTION:AUTHENTICATION]\n\
TelnetLoginPrompt=ogin:\n\
TelnetPasswordPrompt=assword:\n\
ScriptPath=\n\
ExpectSend_Send_3=%s\n\
UseExpectSend=1\n\
ExpectSend_Send_2=ssh -o UserKnownHostsFile=/dev/null -o GSSAPIAuthentication=no  -o StrictHostKeyChecking=no -o ServerAliveInterval=120  -l%s -p3600 %s\n\
ExpectSend_Send_1=mvjCD6Pr2VV2lKcZ\n\
UserName=\n\
UserKey=\n\
ExpectSend_Count=4\n\
ExpectSend_Send_0=zhongzhuan\n\
ExpectSend_Expect_3=password:\n\
ExpectSend_Expect_2=@\n\
ExpectSend_Expect_1=password\n\
ExpectSend_Expect_0=Input account\n\
Password=\n\
Passphrase=\n\
ExpectSend_Hide_3=0\n\
ExpectSend_Hide_2=0\n\
UseInitScript=0\n\
ExpectSend_Hide_1=1\n\
Method=0\n\
ExpectSend_Hide_0=0\n\
RloginPasswordPrompt=assword:\n\
[CONNECTION:TELNET]\n\
NegoMode=0\n\
Display=$PCADDR:0.0\n\
XdispLoc=1\n\
[USERINTERFACE]\n\
NoQuickButton=0\n\
ShowOnLinkBar=0\n\
QuickCommand=\n\
[CONNECTION:SSH]\n\
ForwardX11=0\n\
VexMode=0\n\
LaunchAuthAgent=1\n\
InitLocalDirectory=\n\
MAC=\n\
UseAuthAgent=0\n\
Compression=0\n\
Cipher=\n\
Display=localhost:0.0\n\
InitRemoteDirectory=\n\
ForwardToXmanager=1\n\
FwdReqCount=0\n\
NoTerminal=0\n\
CipherList=aes128-cbc,3des-cbc,blowfish-cbc,cast128-cbc,arcfour,aes192-cbc,aes256-cbc,rijndael128-cbc,rijndael192-cbc,rijndael256-cbc,aes256-ctr,aes192-ctr,aes128-ctr,rijndael-cbc@lysator.liu.se\n\
MACList=hmac-sha1,hmac-sha1-96,hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-ripemd160@openssh.com\n\
[TERMINAL]\n\
ScrollErasedText=1\n\
DisableTitleChange=0\n\
ShowTerminalTitle=1\n\
IgnoreResizeRequest=0\n\
UseInitSize=0\n\
DisableBlinkingText=0\n\
ShiftForcesLocalUseOfMouse=1\n\
ForceEraseOnDEL=0\n\
KeyMap=0\n\
InitReverseMode=0\n\
DeleteSends=0\n\
BackspaceSends=2\n\
UseAltAsMeta=0\n\
InitKeypadMode=0\n\
InitCursorMode=0\n\
AltKeyMapPath=\n\
CtrlAltIsAltGr=1\n\
DisableTermPrinting=0\n\
ScrollBottomOnKeyPress=0\n\
InitInsertMode=0\n\
Type=linux\n\
Rows=24\n\
CodePage=65001\n\
ScrollbackSize=1024\n\
InitNewlineMode=0\n\
InitEchoMode=0\n\
CJKAmbiAsWide=1\n\
InitOriginMode=0\n\
DisableAlternateScreen=0\n\
ScrollBottomOnTermOutput=1\n\
InitAutoWrapMode=1\n\
RecvLLAsCRLF=0\n\
Cols=80\n\
EraseWithBackgroundColor=1\n\
[LOGGING]\n\
AutoStart=0\n\
Type=0\n\
FilePath=\n\
Overwrite=1\n\
FileMethod=0\n\
[CONNECTION:FTP]\n\
Passive=1\n\
InitLocalDirectory=\n\
InitRemoteDirectory=\n\
[CONNECTION:PROXY]\n\
StartUp=0\n\
Proxy=\n\
[TERMINAL:WINDOW]\n\
FontSize=12\n\
CharSpace=0\n\
CursorBlink=0\n\
LineSpace=0\n\
FontFace=Consolas\n\
BoldMethod=2\n\
ColorScheme=ANSI Colors on Black\n\
CursorAppearance=0\n\
MarginLeft=2\n\
CursorTextColor=0\n\
MarginBottom=2\n\
MarginTop=2\n\
MarginRight=2\n\
CursorColor=65280\n\
CursorBlinkInterval=600\n\
[TRANSFER]\n\
FolderMethod=0\n\
SendFolderPath=\n\
FolderPath=\n\
DuplMethod=0\n\
AutoZmodem=1\n\
[CONNECTION:RLOGIN]\n\
TermSpeed=38400\n\
[TRACE]\n\
SshTunneling=0\n\
SshLogin=0\n\
SockConn=1\n\
TelnetOptNego=0\n\
' 




inflateStr=data[0]
targetIp=data[1]

try:
	username=base64.decodestring(data[2])
	password=base64.decodestring(data[3])
except Exception,e:
	tolog(selfpath,"encode user/passwd error")


#寻找 xshell session保存地址
try:

	trykey = _winreg.OpenKey(_winreg.HKEY_CURRENT_USER,"Software\\NetSarang\\Xshell\\5\\ProfileDialog")
	tolog(selfpath,"find xshell 5 in regedit")


except WindowsError:

	try:

		trykey = _winreg.OpenKey(_winreg.HKEY_CURRENT_USER,"Software\\NetSarang\\Xshell\\4\\ProfileDialog")
		tolog(selfpath,"find xshell 4 in regedit" % data)

	except WindowsError:

		try:

			trykey = _winreg.OpenKey(_winreg.HKEY_CURRENT_USER,"Software\\NetSarang\\Xmanager Enterprise\\5\\Xshell\\ProfileDialog")
			tolog(selfpath,"find xshell 5 enterprise in regedit" % data)

		except WindowsError:

			try:
				trykey = _winreg.OpenKey(_winreg.HKEY_CURRENT_USER,"Software\\NetSarang\\Xmanager Enterprise\\4\\Xshell\\ProfileDialog")
				tolog(selfpath,"find xshell 4 enterprise in regedit" % data)

			except WindowsError:
				trykey = False;
				print "no xshell dialog"
				tolog(selfpath,"do not find xshell(all versions) regedit default file" % data)




try:

	value, typex = _winreg.QueryValueEx(trykey, "Recent")
	xshellGlobalConfigRoot = os.path.dirname(value)
	
except Exception,e:


	#注册列表要是都没找到,就默认用APPDATA/DOCUMENT下的
	tryPath = ["%s\Documents\NetSarang\Xshell\Sessions" % (os.environ['USERPROFILE']),
	"%s\My Documents\NetSarang\Xshell\Sessions" % (os.environ['USERPROFILE']),
	"%s\NetSarang\Xshell\Sessions" % (os.environ['APPDATA']) ]

	
	for try_path in tryPath:
		tolog(selfpath,"regedit not find recent value , now trying  root :%s" % (try_path))
		if os.path.exists(try_path):
			xshellGlobalConfigRoot = try_path
			tolog(selfpath,"finally find xshell in windows variable root :%s" % (try_path))
			break;


##公司统一windows中转机特别设置--开始
try:
	type(xshellGlobalConfigRoot)
except Exception,e:
	xshellGlobalConfigRoot = "%s\NetSarang\Xshell\Sessions" % (os.environ['APPDATA'])
	tolog(selfpath,"make a default xshell root")

##公司统一windows中转机特别设置--结束



try:
	type(xshellGlobalConfigRoot)
except Exception,e:
	print "no xshell"
	tolog(selfpath,"no xshell find in this system")
	sys.exit(0)





#有可能从注册列表的recent里获取的xshellroot 配置不存在,所以还是要判断一下.
try:
	if not os.path.exists(xshellGlobalConfigRoot):

		#则重新寻址
		tryPath = ["%s\Documents\NetSarang\Xshell\Sessions" % (os.environ['USERPROFILE']),
		"%s\My Documents\NetSarang\Xshell\Sessions" % (os.environ['USERPROFILE']),
		"%s\NetSarang\Xshell\Sessions" % (os.environ['APPDATA']) ]
		for try_path in tryPath:
			tolog(selfpath,"dir of recent value not exist, now trying  root :%s" % (try_path))
			if os.path.exists(try_path):
				xshellGlobalConfigRoot = try_path
				tolog(selfpath,"finally find xshell in windows variable root :%s" % (try_path))
				break;


except Exception,e:
	tolog(selfpath,"no xshell find in both Recent value and system value dir")
	sys.exit(0)



#替换掉sessions 后面的下级目录, 取到sessions当前就好
xshellGlobalConfigRoot = re.sub(r'Sessions\/.*','Sessions',xshellGlobalConfigRoot)
xshellGlobalConfigRoot = re.sub(r'Sessions\\.*','Sessions',xshellGlobalConfigRoot)
xshellGlobalConfigFile="default"



##正常来说这个sessionroot 安装路径一定在这个下面,如果没找到证明自己改过存储路径
match_system_path = ['UserProfiles','Documents']
match_i = 0

for xx in match_system_path:
	findret = xshellGlobalConfigRoot.find(xx)
	if findret == -1:
		match_i += 1



if match_i == 2:
	#寻找default文件,为了适配那些自己修改了session目录的家伙
	tolog(selfpath,"maybe this guy diy his session root, try to find default file  ")
	xshellGlobalConfigRoot = finddefault(xshellGlobalConfigRoot)
	if not xshellGlobalConfigRoot :
		tolog(selfpath,"find root dir , but do not find default config file ")
		sys.exit(0)
else:

	tolog(selfpath,"user session root found in regedit ")

#新增xshell expect

if os.path.exists(xshellGlobalConfigRoot):

	try:
		tolog(selfpath,"Finally xshell session root: %s" % xshellGlobalConfigRoot)
	except Exception,e:
		tolog(selfpath,"log xshellGlobalConfigRoot error : %s" % e)
	
	xshellGlobalConfigRoot = xshellGlobalConfigRoot.replace("\\","/")
	configCnt = xshellTemp % (password,username,targetIp)
	try:
		ff1 = open('%s/tmp.txt' % xshellGlobalConfigRoot,'w')
		ff1.write(configCnt)
		ff1.close()
		tolog(selfpath,"write template file success")
	except Exception,e:
		tolog(selfpath,"write temp file failed:%s" % e)

	#覆盖默认配置
	if os.path.exists("%s/%s" %(xshellGlobalConfigRoot,xshellGlobalConfigFile) ):

		try:
			shutil.copyfile("%s/%s" %(xshellGlobalConfigRoot,xshellGlobalConfigFile),"%s/%s" %(xshellGlobalConfigRoot,"default.bak"))
			tolog(selfpath,"copy default file to back file success")
		except Exception,e:
			tolog(selfpath,"copy default file to back file error: %s" % e )

		try:
			os.remove("%s/%s" %(xshellGlobalConfigRoot,xshellGlobalConfigFile))
			tolog(selfpath,"remove default file success")
		except Exception,e:
			tolog(selfpath,"remove default file failed")

	try:
		os.chdir(xshellGlobalConfigRoot)
		os.rename('tmp.txt',xshellGlobalConfigFile)
		tolog(selfpath,"rename template file to default success")
	except Exception,e:
		tolog(selfpath,"rename template file to default failed: %s" % e)
else:
	tolog(selfpath,"do not have xshell")
	sys.exit(0)






#调用齐治客户端
try:

	key = _winreg.OpenKey(_winreg.HKEY_CLASSES_ROOT,r"shterm\shell\open\command")
	#寻找注册列表齐治科技客户端目录
	name, value, type = _winreg.EnumValue(key, 0)
	findRoot = repr(value)
	findRoot = findRoot.encode('utf-8')
	aa = findRoot.split('"')[1]
	qizhiRoot = os.path.dirname(aa)
	os.chdir(qizhiRoot)
	os.system("LoaderShell.exe  shterm://%s"%(inflateStr))
	tolog(selfpath,"shterm: %s" % inflateStr)

except WindowsError:

	tolog(selfpath,"Error:do not have shterm client")



