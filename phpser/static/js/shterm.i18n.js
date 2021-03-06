var shterm = {};
function sprintf(str){
    var str_arr = str.split("{%s}"),res = [];
    for(var i=0,len=str_arr.length;i<len;i++){
        res.push(str_arr[i]);
        if(!!arguments[i+1])res.push(arguments[i+1]);
    }
    return res.join("");
}
shterm.init = {
	zh_CN:{
		title:'关于 Shterm',
		systime:'系统时间',
		help:'帮助'
	},
	en_US:{
               	title:'About Shterm',
		systime:'System Time',
		help:'Help'
	}
},
shterm.validate = {
	zh_CN:{
		waiting:'正在查询，请稍候...',
		ok:     '可以使用该名称',
		exists: '已存在相同名称',
		error:  '验证时发生错误',
		none:   '不得为空',
		invalid:'无效',
		len:    '{%s}在{%s}-{%s}个字符内',
		scope:  '{%s}在{%s}～{%s}范围内',
		passwd: '两次输入密码不一致',
		setpass:'请设置密码',
		pass2:  '请确认密码',
		ip:     'ip地址格式错误',
		ipscope:'{%s}错误,ip地址范围必须从小到大',
		ipok:   '此ip地址未被使用',
		ipexist:'此ip地址已被使用',
		alpha:  '只能使用英文数字及下列半角符号`~!@#$%^&*()-=_+[]|{}:;\'",.?<>',
		alpha_specialchars:  '只能使用英文数字及下列半角符号`~!@#$%^&*()-=_+[]|{}:;\'",.?<>\\\/<space>',
		specialchars:  '密码中包含\\,/,<space>等特殊字符，可能会影响到目标设备登录'
	},
        en_US:{
                waiting:'Processing, please wait...',
                ok:     'You can use the name',
                exists: 'The name already exists',
                error:  'Validation error',
                none:   ' can not be empty',
                invalid:' is invalid',
                len:    '{%s} within {%s}-{%s} characters',
                scope:  '{%s} in range {%s}～{%s}',
                passwd: 'Password inconsisent',
                setpass:'Please enter a password',
                pass2:  'Please confirm password',
                ip:     'Invalid IP address',
                ipscope:'Invalid {%s}, range must be small to large',
		ipok:   'You can use the IP',
		ipexist:'The IP already exists',
		alpha:  'Must contain alphabetical,number and following symbol `~!@#$%^&*()-=_+[]|{}:;\'",.?<>',
		alpha_specialchars: 'Must contain alphabetical,number and following symbol `~!@#$%^&*()-=_+[]|{}:;\'",.?<>\\\/<space>',
		specialchars:  'Password includes \\,/,<space>, log in to some system may be disturbed by these characters'
        }
},
shterm.doauto = {
	zh_CN:{
		select:'请选择设备',
		clear: '确定清空内容吗？',
		none:  '没有匹配的设备'
	},
	en_US:{
                select:'Select a server',
                clear: 'Are you sure to empty the contents?',
                none:  'None match'
	}
},
shterm.timepicker = {
	zh_CN:{
		hour:  '时',
		minute:'分'
	},
	en_US:{
		hour:  'Hour',
		minute:'Minute'
	}
},
shterm.pager = {
	zh_CN:{
		integer:'必须填写整数',
		range:  '超出范围'
	},
	en_US:{
		integer:'Please enter a integer',
		range:  'Index out of range'
	}	
},
shterm.player = {
	zh_CN:{
		title: 'tn5250回放',
		second:'每{%s}秒',
		speed: '速度'
	},
	en_US:{
		title: 'Tn5250 Player',
		second:'{%s}Sec',
		speed: 'Speed'
	}
},
shterm.batch = {
	zh_CN:{
		move:'移动',
		del: '移除',
		up:  '上移',
		add: '添加',
		down:'下移',
		least:'最少保留一行',
		del_confirm:'确认删除该行？',
		first:'已经移至第一行',
		last:'已经移至最后一行',
		row:'行',
		batch_delete:'移除已存在的记录'
	},
	en_US:{
		move:'Move',
		del: 'Remove',
		up:  'Up',
		add: 'Add',
		down:'Down',
		least:'At least one row',
		del_confirm:'Are you sure to delete the row?',
		first:'Have been moved to the first line',
		last:'Have been moved to the last line',
		row:'Row',
		batch_delete:'Remove the exists records'
	}
},
shterm.flexigrid = {
	zh_CN:{
		errormsg: '查询失败',
		pagestat: '显示第 {from} 至 {to} ， 共 {total} 项',
		pagetext: '分页',
		rptext:   '每页{%s}条',
		findtext: '查找',
		procmsg:  '正在查询，请稍候...',
		nomsg:    '没有记录'
	},
	en_US:{
                errormsg: 'Connection Error',
                pagestat: 'Displaying {from} to {to} of {total} items',
                pagetext: 'Page',
		rptext:   '{%s} items/page',
                findtext: 'Find',
                procmsg:  'Processing, please wait ...',
                nomsg:    'No items'
	}
},
shterm.assoc = {
	zh_CN:{
		btn_add_text:'添加',
		btn_del_text:'移除',
		btn_close_text:'关闭',
		btn_assoc:'建立关联',
		btn_unassoc:'取消关联',
		status_assoc:'已关联',
		status_added:'已添加',
		status_unassoc:'未关联',
		status_unadd:'未添加',
		nomsg:'没有符合条件的记录',
		errormsg:'连接服务器失败',
		selectmsg:'请选择操作对象',
		servermsg:'服务器端错误，操作失败!',     
		del_ident_msg:'移除该帐号会使部分命令权限适用到全部帐号，请先移除帐号关联或调整命令权限配置',
		del_srv_msg:'移除该设备会使部分命令权限适用到全部设备，请先移除帐号关联或调整命令权限配置',
		refreshmsg:'操作已成功！页面刷新,请稍后...',
		page_total:"共{%s}页",//"共&nbsp;<span id='page_total'></span>&nbsp;页",
		page_one:'每页{%s}条',//'每页10条',
		page_all:'全部',
		status:' 状态 ',
		status_both:'全部',
		procmsg:'正在处理您的请求，请稍等....',
		successmsg:'操作已成功。',
		th_login:'登录名',
		th_name:'姓名',
		th_depart:'部门',
		th_all:'全选',                          
		th_server:'设备名',
		th_ipaddr:'IP地址',
		th_systype:'设备类型',
		th_izone:'用户组名称',
		th_szone:'设备组名',
		th_account:'帐号名称',
		th_service:'服务名称',
		th_service_servers:'设备',
		th_filter:'&nbsp;&nbsp;过滤',
		th_accurate:'精确过滤',
		btn_filter:'过滤',
		sel_server_disabled:'不显示禁用设备'
	},
	en_US:{
		btn_add_text:'Add',
		btn_del_text:'Remove',
		btn_close_text:'Close',
		btn_assoc:'Associate',
		btn_unassoc:'Cancel',
		status_assoc:'Associated',
		status_added:'Added',
		status_unassoc:'Not Associated',
		status_unadd:'Not Added',
		nomsg:'No items',
		errormsg:'Connect Error',
		selectmsg:'Please select items',
		servermsg:'Server error',     
		refreshmsg:'Processing, please wait...',
		page_total:"{%s} Pages",//"共&nbsp;<span id='page_total'></span>&nbsp;页",
		page_one:'{%s} items/page',//'每页10条',
		page_all:'Show All',
		status:' Status ',
		status_both:'All',
		procmsg:'Processing, please wait...',
		successmsg:'Done',
		th_login:'Login',
		th_name:'Real Name',
		th_depart:'Department',
		th_all:'All',                          
		th_server:'Server Name',
		th_ipaddr:'Ip address',
		th_systype:'Server Type',
		th_izone:'User Group Name',
		th_szone:'Server Group Name',
		th_account:'Account',
		th_service:'Service',
		th_service_servers:'Servers',
		th_filter:' Filter',
		th_accurate:'Exact Match',
		btn_filter:'Filter',
		sel_server_disabled:'Hide disabled server'
	}
},
shterm.server_grid = {
	zh_CN:{
		remark_title:'填写备注',
		th_remark:'备注',	
		submit:' 确 定 ',
		timeout:'查询超时',
		error_404:'页面不存在或者其他网络错误',
		remark_force:'必须填写备注，长度大于4个英文字符或2个中文字符',
		min:'备注内容长度必须大于4个英文字符或2个中文字符',
		remark_len:'备注内容长度不得大于200个英文字符或100个中文字符',
		error_query:'查询错误',
		passwd:'密码不能为空',
		service:'非法的服务',
		account:'没有可登录的帐号',
		procmsg:'请稍候...',	
		account_error:'查询系统帐号失败。',
		account_none:'没有可用的系统帐号。',
		th_none:'无',
		no_service:'你选择的设备没有相同的服务(不支持vnc的批量启动)',//'你选择的设备没有相同的服务'，
		batch_title:'批量访问 (请设置浏览器允许本站所有弹出窗口)',
		batch_auth:"下列设备上的{%s}服务需要双人授权，无法批量启动",
		fail_title:'启动失败信息',
		fullscreen:'全屏',	
		maximize:'最大化',
		seamless:'无缝',
		vnc_secret:'必须填写vnc密码',
		batch_not_support:'不支持vnc的批量启动',
		batch_no_account:'不支持左键批量启动没有默认帐号的服务',
		http_not_support:'不支持的协议(如果您做了版本升级，请把http协议改为rdpapp协议，并做好相应配置)',
		batch_not_jterm: '批量启动不支持jterm方式，请在个人设置中设置其他客户端'
	},
	en_US:{
		remark_title:'Fill in Remark',
		th_remark:'Remark',	
		submit:'Submit',
		timeout:'Connection time out.',
		error_404:'Page not found or other error occured.',
		remark_force:'Must fill in remark，within 5-200 english characters or 3-100 chinese characters',
		min:'The length of remark must be bigger than 4 english characters or 2 chinese characters',
		remark_len:'Remark within 5-200 english characters or 3-100 chinese characters',
		error_query:'Error',
		passwd:'Password required',
		service:'Invalid service',
		account:'No accessible account',
		procmsg:'Processing, please wait...',	
		account_error:'Search account failed',
		account_none:'No available account',
		th_none:'None',
		no_service:'Selected servers do not have same services(No support for vnc to batch start)',
		batch_title:'Batch Server Access (Please allow all popup windows of the site)',
		batch_auth:"Batch server access failed:{%s} on these servers need double authorization",//"下列设备上的{%s}服务需要双人授权，无法批量启动",
		fail_title:'Fail Info',
		fullscreen:'Full screen',	
		maximize:'maximize',
		seamless:'Seamless',
		vnc_secret:'Need vnc password',
		batch_not_support:'No support for vnc to batch start',
		batch_no_account:'No support for services which have no account to batch start by left click',
		http_not_support:'Unsupport proto',
		batch_not_jterm: 'Batch Service not support jterm, please set other tui client in your Profile settings'
	}
},
shterm.dashboard = {
	zh_CN:{
		server:'设备',
		user:'用户',
		service:'服务',
		title:'活跃会话',
		time:'时间',
		count:'会话数量',
		other:'其他',
		other_user:'其他用户',
		other_server:'其他设备',
		other_service:'其他服务',
		about:'相关',
		show_time:"查看{%s}时的活跃会话列表",
		show_server:"查看设备{%s}在{%s}时的活跃会话列表",
		show_user:"查看用户{%s}在{%s}时的活跃会话列表",
		show_service:"查看{%s}的{%s}服务的活跃会话列表",
		show_server_other:"不支持其他设备的活跃会话列表查看",
		show_user_other:"不支持其他用户的活跃会话列表查看",
		show_service_other:"不支持其他服务的活跃会话列表查看"
	},
	en_US:{
		server:'Server',
		user:'User',
		service:'Service',
		title:'Active Sessions',
		time:'Time',
		count:'Sessions',
		other:'Other ',
		other_user:'Other User',
		other_server:'Other Server',
		other_service:'Other Service',
		about:' related',
		show_time:"View active session list at {%s}",
		show_server:"View active session list of server:{%s} at {%s}",
		show_user:"View active session list of user:{%s} at {%s}",
		show_service:"View active session list of service:{%s} at {%s}",
		show_server_other:"Can not view the active session list of ohter server",
		show_user_other:"Can not view the active session list of ohter user",
		show_service_other:"Can not view the active session list of ohter service"
	}
},
shterm.worksheet = {
	zh_CN:{
		add_name: ' 添 加 ',
		add_alert: '有未确定的Permission，请先确定或删除。',
		edit_name: '编 辑',
		edit_alert: '有未确定的Permission，请先确定或删除。',
		confirm_name: '确 定',
		cancel_name: '取 消',
		del_name: '删 除',
		del_alert: '您确定删除',
		view_name: '查 看',
		year: '年 ',	
		month:'月 ',
		day:'日 ',
		hour:'时 ',
		minute:'分',
		one_alert:'不能删除，至少填写一个Permission',
		service_alert:'至少在服务类型，服务协议和服务名称三项中选填一项',
		identity_alert:'至少选择一个用户',
		server_alert:'至少选择一个设备',
		account_alert:'至少选择一个系统帐号',	
		command_alert:'命令中含有非法字符，只允许输入字母数字及分号',
		assoc_selected:'您已选择了 ',
		assoc_server:'设备',
		assoc_server_select:'选 择 设 备',
		assoc_servers:' 个设备 ',
		assoc_servers_title: '已选择的设备',
		assoc_account:'系统帐号',
		assoc_account_select:'选择系统帐号',
		assoc_accounts:' 个系统帐号',
		assoc_accounts_title:'已选择的系统帐号',
		assoc_service:'服务名称',
		assoc_service_select:'选择服务名称',
		assoc_services:' 个服务',
		assoc_services_title:'已选择的服务',
		service_type:'服务类型',
		proto_tui:'字符终端',
		proto_gui:'图形终端',
		proto_file:'文件传输',
		protos:'服务协议',
		cmd:'命令',
		action:'操作',
		assoc_alert_server:'请先选择设备!',
		remark_alert:'注释不得超过200字',	
		close:'关闭',
		service_except:'由于某种原因，未能根据您的设备选择同步更新已选的帐号和服务。'
	},
	en_US:{
		add_name: ' Add ',
		add_alert: 'Please confirm/delete the editing Permission.',
		edit_name: 'Edit',
		edit_alert: 'Please confirm/delete the editing Permission.',
		confirm_name: 'Confirm',
		cancel_name: 'Cancel',
		del_name: 'Delete',
		del_alert: 'Are you sure to delete ',
		view_name: 'View',
		year: 'Year ',	
		month:'Month ',
		day:'Day ',
		hour:'Hour ',
		minute:'Minute',
		one_alert:'Can not delete，need one Permission at least',
		service_alert:'Select one from service type, service proto or service name',
		identity_alert:'Select one identity at least',
		server_alert:'Select one server at least',
		account_alert:'Select one account at least',	
		command_alert:'Invalid character in cmd, use alphabet,number and ; only',
		assoc_selected:'You selected ',
		assoc_server:'Server',
		assoc_server_select:'Select servers',
		assoc_servers:' Servers ',
		assoc_servers_title: 'Selected servers',
		assoc_account:'Account',
		assoc_account_select:'Select accounts',
		assoc_accounts:' Accounts',
		assoc_accounts_title:'Selected accounts',
		assoc_service:'Service Name',
		assoc_service_select:'Select service name',
		assoc_services:' Service Names',
		assoc_services_title:'Selected service names',
		service_type:'Service Type',
		proto_tui:'Terminal',
		proto_gui:'Graphic',
		proto_file:'File',
		protos:'Service Proto',
		cmd:'Command',
		action:'Action',
		assoc_alert_server:'Select a server first',
		remark_alert:'Remark should be in 200 characters',	
		close:'Close',
		service_except:'Except: can not sync accounts and services by the servers you selected.'
	}
};
