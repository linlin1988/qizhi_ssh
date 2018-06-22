//underscore.js  过滤数和排序据用
//mustache.js    生成html元素用

var sg = {
	//按字节算长度
	len:function(str){
		var res = 0;
		for (var i=0;i<str.length;i++){
			var intcode = str.charCodeAt(i);
			if(intcode>=0 && intcode<=128){
				res+=1;
			}
			else res+=2;
		}
		return res;
	},
	//配置信息，包括用户配置里设置的默认分辨率等等参数
	config:{
		query_type:'bypage',//过滤方式 ‘’/ajax 默认空
		server_grid_filter: filter_type=='all' ? 'all' : 'recent',//过滤类型 recent，mgroup 其他
		pagesize: 100,//pagesize_config,//每页多少条
		pageindex:1,//当前页码
		total:0,//共有多少条原始记录

		tui_color:tui_color,//jterm默认颜色
		tui_default:tui_default, //tui默认分辨率
		tui_client:tui_client, //tui启动方式
		gui_default:gui_default,//gui默认分辨率
		gui_client:gui_client, //gui启动方式 mstsc/java
		gui_active_rdp:gui_active_rdp,//产看当前rdp服务连接数的情况 total/detail/none 显示总数/显示总数和详细/不显示
		shterm_loader:shterm_loader,//是否开启了shterm_loader
		sess_remark_mode:sess_remark_mode, //会话备注填写方式：必填，可填，右键选填，不填
		sess_remark_min:5,//必填时的备注最少字符长度
		sess_remark_max:200,//备注最长字符长度
		show_sess_remark:false,//是否显示备注框
		force_sess_remark:false,//强制填写备注
		worksheet:worksheet, //工单
		rdp_diskmap:rdp_diskmap,//磁盘映射盘符
		rdp_diskmap_sel:rdp_diskmap_sel,//用户默认勾选的磁盘映射
		diskmap_selector:diskmap_selector, //磁盘映射选择器 java
		left_way:left_way, //左键单击启动还是双击启动
		dual_auth_url:'/qizhi/authorize_identities',//双人授权验证地址
		account_url:'/qizhi/server_grid_getaccount',//可用帐号获取地址
		url:'/qizhi/server_list',//获取server_list数据的url
		gui_url:'/qizhi/gui_client',//gui服务url
		gui_disk_url:'judge_option.php',//gui服务是否显示磁盘映射选项的url
		tui_url:'/qizhi/tui_client',//tui服务url
		file_url:'file_client.php',//file服务url
		active_rdp_url:'../include/get_active_rdp_num.php',//active rdp会话数量
                reg1:new RegExp(/<html/i), //ajax结果验证正则 有html表示页面出错
                reg2:new RegExp(/^req_error:/i), //ajax结果验证正则，有明确的报错说明
		timeout:130000, //ajax超时时间，130秒
		batch_url: 'batch_start.php',
		icon:{
			'telnet':'/icons/default/telnet.gif',
			'ssh':'/icons/default/securecrt.gif',
			'tn5250':'/icons/default/tn5250.gif',
			'rdp':'/icons/default/mstsc.gif',
			'rdpapp':'/icons/default/app.gif',
			'http':'/icons/default/ie.gif',
			'xdmcp':'/icons/default/xmanager.gif',
			'xfwd':'/icons/default/xmanager.gif',
			'vnc':'/icons/default/realvnc.gif',
			'ftp':'/icons/default/filezilla.gif',
			'sftp':'/icons/default/filezilla.gif'
		}
	},
	//国际化信息
	info:shterm.server_grid[locale],
	//数据信息
	models:{
		//ajax取得的数据格式
		/*
		origin_data:[{'server_id':'2','server_name':'win202','ipaddr':'192.168.5.202','account':1,'remote':'xxx','services':[{
			'id':1,
			'name':'ssh202',
			'type':'tui',
			'proto':'ssh',
			'icon':'/icon/tui/tui.gif',
			'options':{
				'rdp_diskmap':0,
				'rdp_console':0,
				'rdp_seamless':0,
				'kvm_options':0,
				'remoteapp':0
			}
		}]},{'server_id':'2',...},....],
		//由客户操作后过滤出的数据
		filtered_data:[{
			//结构同services
		}],
		*/
		//当前过滤选项
		filter:{
			name_ipaddr:'',//设备名和ip
			server_name:'',//设备名
			ipaddr:'',//ip地址
			proto:'',//协议
			systype:'0',//设备类型
			domain:'0'
		},
		//默认按设备名升序
		order_name:1,
		order_ipaddr:0,
		order_remote:0,
		asc:1,
		desc:0,
		//原始数据（即所有该客户可以访问的设备）
		origin_data:[],
		//通过前端过滤得到的数据
		filtered_data:[],
		//在当前页面显示的数据
		display_data:[],
		//访问控制组和对应的设备
		mgroup_servers:{}
	},
	//ajax缓存信息
	caches:{
		//单个服务ajax缓存数据
		single:{
			/**
			_service_id_account:{
				accounts:[1,23],
				authorize:'xxx',
			},
			...
			*/
		},
		//批量服务ajax缓存数据
		batch:{
			/**
			'1#2#5':{
				'telnet':{
					
				},
				'ssh':{
					
				}
			},
			...
			*/
		}
	},
	//视图管理器
	views:{
		//主table视图管理
		table:{
			//生成table
			create:function(){
				global_systype = $("#systype_div select").clone();
				global_systype.change(function(){
					sg.controls.filter();
				});
				sg.mask.hide();
				if(!sg.server_list){
					var tmpl = $("#template_server_list").html();
					$('#content').append(Mustache.to_html(tmpl,sg.models));
					global_systype.attr("id","filter_systype").insertBefore($("#filter_proto"));
					$('#spage').val(sg.config.pageindex);
					sg.server_list = true;
					sg.views.page.init();
					//$(".tr_service").hide();
				}
				else{
					sg.views.table.update();
					//$(".tr_service").hide();
				}
			},
			//更新table
			update:function(){
				sg.mask.hide();
				$("#server_list_filter").remove();
				$("#server_list").remove();
				var tmpl = $("#template_server_list").html();
				$('#content').append(Mustache.to_html(tmpl,sg.models));
				//var systype = $("#systype_div select").clone();
				//systype.attr("id","filter_systype").insertBefore($("#filter_proto"));
				global_systype.insertBefore($("#filter_proto"));
				global_systype.change(function(){
					sg.controls.filter();
				});
				$('#spage').val(sg.config.pageindex);
				sg.views.page.init();
				$('#filter_proto').val(sg.models.filter.proto);
				$('#filter_domain').val(sg.models.filter.domain);
				if(sg.models.filter.systype=="") sg.models.filter.systype=0;
				$('#filter_systype').val(sg.models.filter.systype);
			}
		},
		//分页控件视图
		page:{
			init:function(){
				sg.config.total = sg.models.filtered_data.length;
				if (sg.config.query_type=='bypage'){
					sg.config.total = sg.models.total;
				}
				sg.config.pagemax = Math.ceil(sg.config.total/sg.config.pagesize);
				sg.config.pages = _.range(1,sg.config.pagemax+1);
				if(sg.config.pagemax>0){
					$('#spage').pager({
						pageindex:sg.config.pageindex,
						pagecount:sg.config.pagemax,
						paged:sg.controls.filter
					});
				}
				else{
					$('#spage').pager({
						pageindex:0,
						pagecount:0,
						paged:sg.controls.filter
					});
				}
				$("#spage-span").text("共"+sg.config.pagemax+"页");
			}
		},
		//tui服务视图
		tui:{
			//tui服务基本form视图
			base:{
				create:function(param){
					if(sg.form_base_tui){
						$("#form-base-tui").remove();
					}
					var tmpl = $("#template-form-base-tui").html();
					$("#content").append(Mustache.to_html(tmpl,param));
					sg.form_base_tui = true;
				}
			},
			//单个tui服务高级选项视图
			advance:{
				create:function(server,service){
					if(sg.form_advance_tui){
						$("#form-advance-tui").remove();							
					}
					var tmpl = $("#template-form-advance-tui").html(),
					    opts = {
						submit:sg.info.submit,
						server_id:server.server_id,
						service_id:service.id,
						proto:service.proto,
						show_sess_remark:sg.config.show_sess_remark
					    };
					if(sg.config.tui_client != "jterm") opts.notjterm = 1;
					$("#content").append(Mustache.to_html(tmpl,opts));
					if(sg.config.tui_default){
						$("#form-advance-tui select[name=resolution]").val(sg.config.tui_default);
					}
					if(sg.config.tui_color){
                                                $("#form-advance-tui select[name=bg_color]").val(sg.config.tui_color);
                                        }
					$("#form-advance-tui").dialog({
						autoOpen:true,
						position:'center',
						width:350,
						modal:true,
						resizable:false,
						open:function(){
							$(this).find("table").hide();
							//TODO: ajax to get the useful accounts
							sg.single_service.get_accounts(server,service);
							$(this).find(":button").unbind("click");
							$(this).find(":button").click(function(){
								var sess_remark = $.trim($("#form-advance-tui .the_sess_remark").val());
								if(sg.config.force_sess_remark && sg.len(sess_remark)<5){
									alert(sg.info.remark_force);
									return false;
								}
								else if(sg.len(sess_remark)>200){
									alert(sg.info.remark_len);
									return false;
								}
								sg.single_service.form_start('tui');
							});
						},
						close:function(){
							$(this).dialog("destroy").hide();
						}
					});
					sg.form_advance_tui = true;
				}
			},
			//批量tui服务高级选项视图
			batch_advance:{
				create:function(proto){
					if(sg.form_advance_tui){
						$("#form-advance-tui").remove();	
					}
					var tmpl = $("#template-form-advance-tui").html(),
					    opts = {
						submit:sg.info.submit,
						proto:proto,
						show_sess_remark:sg.config.show_sess_remark
					    };
					if(sg.config.tui_client != "jterm") opts.notjterm = 1;
					$("#content").append(Mustache.to_html(tmpl,opts));
					$("#form-advance-tui").dialog({
						autoOpen:true,
						position:'center',
						width:350,
						modal:true,
						resizable:false,
						open:function(){
							$(this).find("table").hide();
							//TODO: ajax to get the useful accounts
							//sg.single_service.get_accounts(server,service);
							sg.batch_service.get_accounts(sg.models.batch_servers[0].service);
							$(this).find(":button").unbind("click");
							$(this).find(":button").click(function(){
								var sess_remark = $.trim($("#form-advance-tui .the_sess_remark").val());
								if(sg.config.force_sess_remark && sg.len(sess_remark)<5){
									alert(sg.info.remark_force);
									return false;
								}
								else if(sg.len(sess_remark)>200){
									alert(sg.info.remark_len);
									return false;
								}
								sg.batch_service.form_start('tui');
								$("#batch-failed").dialog('close');
							});
						},
						close:function(){
							$(this).dialog("destroy").hide();
						}
					});
					sg.form_advance_tui = true;
				}
			}
		},
		gui:{
			//单个gui服务高级选项视图
			advance:{
				create:function(server,service){
					sg.single_service.check_vnc_secret(service);
					if(sg.form_advance_gui){
						$("#form-advance-gui").remove();
					}
					var tmpl = $("#template-form-advance-gui").html(),
					    opts = {
						submit:sg.info.submit,
						server_id:server.server_id,
						service_id:service.id,
						proto:service.proto,
						show_sess_remark:sg.config.show_sess_remark
					    };
					if(service.proto=="vnc") opts.vnc_secret = service.options.vnc_secret;
					$("#content").append(Mustache.to_html(tmpl,opts));
					//非rdp，rdpapp服务不显示console和mstsc选项
					if(service.proto=="vnc" || (!xdmcp_login_agent && service.proto=="xdmcp")){
						$("#tr_account").hide();
					}
					if(service.proto!='rdp' && service.proto!="rdpapp"){
						$("#console_sel_span").hide();
						$("#mstsc_sel_span").hide();
					}
					else{
						if(rdp_console_default_by_person && service.options.rdp_console){
							$("#console_sel").check();
						}
					}
					//非http服务不显示保存浏览器设置选项
					if(service.proto!='http'){
						$("#http_default_sel_span").hide();
					}
					//服务option的rdp_console值非真的不显示console选项
					if(!service.options.rdp_console){
						$("#console_sel_span").hide();
					}
					//vnc服务显示vnc密码填写,否则隐藏
					if(service.proto=="vnc"){
						$("#form-advance-gui .tr_vnc_secret").show();
						$("#tr_resolution").hide();
					}
					else{
						$("#form-advance-gui .tr_vnc_secret").hide();
					}
					if(sg.config.gui_default){
						$("#gui_resolution").val(sg.config.gui_default);
					}
					if (sg.config.gui_client=='mstsc' || service.options.remoteapp){
				                if (navigator.platform.toLowerCase().indexOf('win32') != -1 || navigator.platform.toLowerCase().indexOf('windows') != -1 || navigator.userAgent.toLowerCase().indexOf('windows') != -1){
							$("#mstsc_sel").attr("checked",true);
							service.options.seamless = false;
						}
        				}
					$("#mstsc_sel").click(function(){
						sg.controls.change_resolution(service.proto, service.options.remoteapp, service.options.seamless);
					});			
					sg.controls.change_resolution(service.proto, service.options.remoteapp, service.options.seamless);
					if(service.proto=='rdpapp' && service.options.remoteapp) {
						//$("#tr_resolution").hide();
						//$("#mstsc_sel_span").hide();
						$("#mstsc_sel").attr("disabled","disabled");
						$("#gui_resolution").attr("disabled","disabled");
					}
					$("#form-advance-gui").dialog({
						autoOpen:true,
						position:'center',
						width:450,
						modal:true,
						resizable:false,
						open:function(){
							if ($.browser.msie && $.browser.version < 7 && sg.config.gui_client=='mstsc'){
								if (navigator.platform.toLowerCase().indexOf('win32') != -1 || navigator.platform.toLowerCase().indexOf('windows') != -1 || navigator.userAgent.toLowerCase().indexOf('windows') != -1){
									$("#mstsc_sel").attr("checked",true);
								}
							}
							$(this).find("table").hide();
							sg.single_service.get_accounts(server,service);
							$(this).find(":button").unbind("click");
							$(this).find(":button").click(function(){
								var sess_remark = $.trim($("#form-advance-gui .the_sess_remark").val());
								if(sg.config.force_sess_remark && sg.len(sess_remark)<5){
									alert(sg.info.remark_force);
									return false;
								}
								else if(sg.len(sess_remark)>200){
									alert(sg.info.remark_len);
									return false;
								}
								if(sg.show_vnc){
									var vnc_secret = $.trim($("#form-advance-gui input[name=vnc_secret]").val());
									if(vnc_secret.length==0){
										alert(sg.info.vnc_secret);
										return false;
									}
								}
								sg.single_service.form_start('gui');
							});
						},
						close:function(){
							$(this).dialog("destroy").hide();
						}
					});
					sg.form_advance_gui = true;
				}
			},
			//批量gui服务高级选项视图
			batch_advance:{
				create:function(proto){
					if(sg.form_advance_gui){
						$("#form-advance-gui").remove();
					}
					var tmpl = $("#template-form-advance-gui").html(),
					    opts = {
						submit:sg.info.submit,
						proto:proto,
						show_sess_remark:sg.config.show_sess_remark
					    };
					$("#content").append(Mustache.to_html(tmpl,opts));
					//非rdp，rdpapp服务不显示console和mstsc选项
					if(proto=="vnc"){
						$("#tr_account").hide();
						$("#tr_resolution").hide();
					}
					if(proto=="xdmcp" && !xdmcp_login_agent){
						$("#tr_account").hide();
					}
					if(proto!='rdp' && proto!="rdpapp"){
						$("#console_sel_span").hide();
						$("#mstsc_sel_span").hide();
					}
					else{
						if(proto!='rdp'){
							$("#console_sel_span").hide();
						}
						if(rdp_console_default_by_person){
							$("#console_sel").check();
						}
					}
					//非http服务不显示保存浏览器设置选项
					if(proto!='http'){
						$("#http_default_sel_span").hide();
					}
					if(proto=="rdpapp"){
						sg.config.batch_remoteapp = true;
						var remote_count = 0;
						_.map(sg.models.batch_servers,function(one){
							if(one.service.options.remoteapp) remote_count++;
						});
						if (remote_count==sg.models.batch_servers.length) sg.config.batch_remoteapp = true;
						else sg.config.batch_remoteapp = false;
					}
					if(sg.config.gui_default){
						$("#gui_resolution").val(sg.config.gui_default);
					}
					sg.controls.change_resolution(proto, sg.config.batch_remoteapp);
					$("#mstsc_sel").click(function(){
						sg.controls.change_resolution(proto, sg.config.batch_remoteapp);
					});
					if (sg.config.gui_client=='mstsc' || sg.config.batch_remoteapp){
				                if (navigator.platform.toLowerCase().indexOf('win32') != -1 || navigator.platform.toLowerCase().indexOf('windows') != -1 || navigator.userAgent.toLowerCase().indexOf('windows') != -1){
							$("#mstsc_sel").attr("checked",true);
							sg.controls.change_resolution(proto, sg.config.batch_remoteapp);
						}
        				}
					if(proto=="rdpapp" && sg.config.batch_remoteapp){
						$("#mstsc_sel").attr("disabled","disabled");
						$("#gui_resolution").attr("disabled","disabled");
						//$("#tr_resolution").hide();
						//$("#mstsc_sel_span").hide();
					}
					$("#form-advance-gui").dialog({
						autoOpen:true,
						position:'center',
						width:450,
						modal:true,
						resizable:false,
						open:function(){
							$(this).find("table").hide();
							//TODO: ajax to get the useful accounts
							//sg.single_service.get_accounts(server,service);
							sg.batch_service.get_accounts(sg.models.batch_servers[0].service);
							$(this).find(":button").unbind("click");
							$(this).find(":button").click(function(){
								var sess_remark = $.trim($("#form-advance-gui .the_sess_remark").val());
								if(sg.config.force_sess_remark && sg.len(sess_remark)<5){
									alert(sg.info.remark_force);
									return false;
								}
								else if(sg.len(sess_remark)>200){
									alert(sg.info.remark_len);
									return false;
								}
								sg.batch_service.form_start('gui');
								$("#batch-failed").dialog('close');
							});
						},
						close:function(){
							$(this).dialog("destroy").hide();
						}
					});
					sg.form_advance_gui = true;
				}
			}
		},
		//文件传输视图
		file:{
			//单个文件传输服务高级选项视图
			advance:{
				create:function(server,service){
					if(sg.form_advance_file){
						$("#form-advance-file").remove();
					}
					var tmpl = $("#template-form-advance-file").html(),
					    opts = {
						submit:sg.info.submit,
						server_id:server.server_id,
						service_id:service.id,
						show_sess_remark:sg.config.show_sess_remark
					    };
					$("#content").append(Mustache.to_html(tmpl,opts));
					$("#form-advance-file").dialog({
						autoOpen:true,
						position:'center',
						width:450,
						modal:true,
						resizable:false,
						open:function(){
							$(this).find("table").hide();
							//TODO: ajax to get the useful accounts
							sg.single_service.get_accounts(server,service);
							$(this).find(":button").unbind("click");
							$(this).find(":button").click(function(){
								var sess_remark = $.trim($("#form-advance-file .the_sess_remark").val());
								if(sg.config.force_sess_remark && sg.len(sess_remark)<5){
									alert(sg.info.remark_force);
									return false;
								}
								else if(sg.len(sess_remark)>200){
									alert(sg.info.remark_len);
									return false;
								}
								sg.single_service.form_start('file');
							});
						},
						close:function(){
							$(this).dialog("destroy").hide();
						}
					});
					sg.form_advance_file = true;
				}
			},
			//批量文件传输服务高级选项视图
			batch_advance:{
				create:function(proto){
					if(sg.form_advance_file){
						$("#form-advance-file").remove();
					}
					var tmpl = $("#template-form-advance-file").html(),
					    opts = {
						submit:sg.info.submit,
						show_sess_remark:sg.config.show_sess_remark
					    };
					$("#content").append(Mustache.to_html(tmpl,opts));
					$("#form-advance-file").dialog({
						autoOpen:true,
						position:'center',
						width:350,
						modal:true,
						resizable:false,
						open:function(){
							$(this).find("table").hide();
							//TODO: ajax to get the useful accounts
							//sg.single_service.get_accounts(server,service);
							sg.batch_service.get_accounts(sg.models.batch_servers[0].service);
							$(this).find(":button").unbind("click");
							$(this).find(":button").click(function(){
								sg.batch_service.form_start('file');
								$("#batch-failed").dialog('close');
							});
						},
						close:function(){
							$(this).dialog("destroy").hide();
						}
					});
					sg.form_advance_file = true;
				}
			}
		},
		//批量启动视图
		batch:{
			//批量启动的基本视图
			base:function(){
				sg.models.batch_data = [];
				var tmpl_arr = [], protos=[], names=[], services=[], tmpl_res=[], res=[], counts={};
				$(".tr_server").each(function(){
					var ck = $(this).find("input[id*=ck_server]:visible");
					if(ck && ck.attr("checked")){
						var server = _.find(sg.models.display_data,function(server){
							console.log(sg.models.display_data);
							return server.server_id == ck.val();
						});
						if(server) tmpl_arr.push(server);
					}
				});	
				//取出服务的交集，需要相同的name和proto
				services = _.flatten(_.pluck(tmpl_arr,'services'));
				protos = _.pluck(services,'proto');
				names = _.pluck(services,'name');
				tmpl_res = _.zip(protos, names);
				//res's format ['proto#name'] like ['ftp#ftp',...]
				_.map(tmpl_res,function(arr){
					if(arr[0]!="vnc") {
						arr = arr[0]+'#'+arr[1];
						res.push(arr); 
					}
				});
				//算出res中每种 服务协议#服务名称 的重复数量
				counts = _.reduce(res,function(counts,word){counts[word]=(counts[word] || 0)+1;return counts},{});
				services = [];
				//将重复数量等于所选设备数量的服务放到service中(说明每个设备都有该服务，可以批量启动)
				_.map(res,function(service){
					if(counts[service] && counts[service]==tmpl_arr.length){
						services.push(service);
					}
					
				});
				services = _.uniq(services);				
				if(services.length==0){
					alert(sg.info.no_service);
					return false;
				}
				else{
					var servers = _.pluck(tmpl_arr,'server_id')
					var services = _.map(services,function(service){
						var proto,name;
						proto = service.substr(0,service.indexOf('#'));
						name = service.substr(service.indexOf('#')+1);
						icon = sg.config.icon[proto];
						return {
							'proto':proto,
							'name':name,
							'icon':icon
						};
					});
					sg.models.batch_data = {
						'batch_title':sg.info.batch_title,
						'servers':servers,
						'services':services
					};
					var tmpl = $("#template-form-batch-base").html();
					$("#content").append(Mustache.to_html(tmpl,sg.models.batch_data));
					$("#form-batch-base").dialog({
						autoOpen:true,
						width:600,
						close:function(){
							$(this).dialog("destroy").remove();
						}
					});
				}
			},
			//右件点击选择高级选项
			advance:function(services){

			}
		}
	},
	active_rdp:{
		get:function(server,event){
			$.ajax({
				url:sg.config.active_rdp_url,
				type:'POST',
				cache:false,
				timeout:sg.config.timeout,
				data:{server:server},
				success:function(html){
					var p = (new Function("return "+ html))();
					sg.active_rdp.display(event,p);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
					alert(textStatus);
					return false;
				}
			});
		},
		display:function(event,p){
			sg.active_rdp.hide();
			var outX = event.left, outY = event.top, insideX = outX + 5, insideY = outY + 5,div_h = 60, div_inside_h = 50, img_h = outY -18,
			    div = $("<div>").attr("id","active_rdp_out").addClass("tips").css({"left":outX,"top":outY,"width":"280px","height":"60px"}),
			    div_inside = $("<div>").attr("id","active_rdp_inside").addClass("tips_inside").css({"width":"270px","height":"50px","left":insideX,"top":insideY}),
			    img = $("<img>").attr("id","active_rdp_close").attr("src",_baseurl+"/resources/themes/images/btn_close_x.png").addClass("tips_close").css({"left":outX+256,"top":outY-18}).click(function(){sg.active_rdp.hide();}),
			    rdp_num = '<p class="mt5 ml5">设备'+p.server+'上的活跃rdp连接数:'+p.total+'</p>';
			    add_height = -20;
			if(sg.config.gui_active_rdp=="detail"){
			    for(var k in p.identity){
				add_height+=20;
				rdp_num += '<p class="mt5 ml5">'+p.identity[k]+'</p>';
			    }
			}
			if(add_height>0) {
				div_h = 60+add_height,
				div_inside_h = 50+add_height;
				div.css("height",div_h);
				div_inside.css("height",div_inside_h);
			}
			outY -= div_h;
			insideY -= div_h;
			img_h -=div_h;
			div.css("top",outY);
			div_inside.css("top",insideY);
			img.css("top",img_h);
			div_inside.append(rdp_num);
			$("body").append(div).append(div_inside).append(img);
			div.fadeIn();div_inside.fadeIn();img.show();
		},
		hide:function(){
			$("#active_rdp_out").remove();$("#active_rdp_inside").remove();$("#active_rdp_close").remove();
		}
	},
	//逻辑控制
	controls:{
		//过滤数据
		filter:function(page){
			if(sg.config.query_type=='bypage'){
				sg.mask.show();
				var data = sg.controls.getfilter(),
				    order = sg.controls.getorder();
				if (page){
					sg.config.pageindex = page;
				}
				data.worksheet = sg.config.worksheet;
				data.pageindex = sg.config.pageindex;
				data.pagesize = sg.config.pagesize;
				data.order = order.name;
				data.sort = order.sort;
				$.ajax({
					type:'POST',
					url:sg.config.url,
					cache:false,
					timeout:sg.config.timeout,
					data:data,
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
						alert(textStatus);
						sg.mask.hide();
						return false;
					},
					success:function(html){
						sg.controls.load_data(html);
						sg.views.table.update();
					}
				});
			}
			else{
				if (page){
					var min = (page - 1)*sg.config.pagesize + 1,
					    max = (page - 1)*sg.config.pagesize + sg.config.pagesize;
					    sg.models.display_data = _.filter(sg.models.filtered_data,function(server){
						return (server.no >= min && server.no <=max);
					    });
					sg.config.pageindex = page;
					sg.views.table.update();
				}
				else{
					var no=0, cls=0, order = sg.controls.getorder(),filters = sg.controls.getfilter();
					if(filters.name_ipaddr.length>0 || filters.proto.length>0 || filters.systype>0 || filters.domain>0){
						if(filters.proto.length>0){
							var protos;
							if (filters.proto == 'tui')
								protos = ['telnet','ssh','tn5250'];
							else if (filters.proto == 'gui')
								protos = ['rdp','rdpapp','vnc','xdmcp','xfwd'];
							else if (filters.proto == 'file')
								protos = ['ftp','sftp'];
							else protos = [filters.proto];
						}
						sg.models.filtered_data = _.filter(sg.models.origin_data,function(server){
							var r = true;
							if(filters.name_ipaddr.length>0 && server.server_name.indexOf(filters.server_name)==-1 && server.ipaddr.indexOf(filters.name_ipaddr)==-1){
								r = false;
							}
							if(filters.proto.length>0){
								theservice = _.find(server.services,function(service){
									return (_.include(protos,service.proto) ? true : false );
								});
								if(!theservice) r = false;
							}
							if(filters.systype>0 && server.systype_id!=filters.systype){
								r = false;
							}
							if(filters.domain>0 && server.domain!=filters.domain){
								r = false;
							}
							return r;
						});
						//有排序在此做orderby
						sg.models.filtered_data = sg.models.filtered_data.sort(function(a,b){
							if(order.name=="ipaddr"){
								return sg.controls.compareIP(a[order.name],b[order.name]);
							}
							else{
								return a[order.name].localeCompare(b[order.name]);
							}
						});	
						if(order.sort=="desc"){
							sg.models.filtered_data = sg.models.filtered_data.reverse();
						}
						//重新设定no
						_.map(sg.models.filtered_data, function(server){
							no += 1;
							cls = no % 2 + 1;
							server.no = no;
							server.cls = cls;
							return server;
						});
						sg.models.display_data = _.filter(sg.models.filtered_data,function(server){
							return (server.no >= 1 && server.no <=sg.config.pagesize);
						});
					}
					else{
						if(sg.config.server_grid_filter=='recent'){
							sg.models.filtered_data = _.filter(sg.models.origin_data,function(server){
								return server.recent ? true : false;
							});
						}
						else if(sg.config.server_grid_filter.indexOf('mgroup')!=-1){
							var mgroup = sg.config.server_grid_filter.substr(6);
							sg.models.filtered_data = _.filter(sg.models.origin_data,function(server){
								return (_.include(sg.models.mgroup_servers[mgroup],server.server_id) ? true : false);
							});
						}	
						else sg.models.filtered_data = _.clone(sg.models.origin_data);
						//有排序在此做orderby
						sg.models.filtered_data = sg.models.filtered_data.sort(function(a,b){
							if(order.name=="ipaddr"){
								return sg.controls.compareIP(a[order.name],b[order.name]);
							}
							else{
								return a[order.name].localeCompare(b[order.name]);
							}
						});	
						if(order.sort=="desc"){
							sg.models.filtered_data = sg.models.filtered_data.reverse();
						}
						//重新分配no和服务显示与否
						_.map(sg.models.filtered_data, function(server){
							no += 1;
							cls = no % 2 + 1;
							server.no = no;
							server.cls = cls;
							return server;
						});
						sg.models.display_data = _.filter(sg.models.filtered_data,function(server){
							return (server.no >= 1 && server.no <=sg.config.pagesize);
						});
					}
					sg.views.table.update();
				}
			}
		},
		//加载数据
		load_data:function(html){
			//返回未知错误
			if(html.search(sg.config.reg1)!=-1){
				alert(sg.info.error_query);
				return false;
			}
			//返回已知错误
			else if(html.search(sg.config.reg2)!=-1){
				var error = html.split(':')[1];
				alert(error);
				return false;
			}
			if(sg.config.query_type=='bypage'){
				var tmp_data = $.parseJSON(html);
				sg.models.display_data = tmp_data.server_list;
				_.map(sg.models.display_data,function(server){
					_.map(server.services,function(service){
						service.show = 1;
					});
				});
				sg.models.total = tmp_data.total;
			}
			else{
				var tmp_data = $.parseJSON(html);
				sg.models.mgroup_servers = tmp_data.mgroup_servers;
				sg.models.filtered_data = sg.models.origin_data = tmp_data.server_list;
				_.map(sg.models.origin_data,function(server){
					_.map(server.services,function(service){
						service.show = 1;
					});
				});
			}
		},
		//给三个搜索框绑定过滤事件
		filter_on:function(){
			$('#content').delegate(':text[id*=filter_]','keypress',function(e){
				if(e.keyCode==13){
					sg.controls.filter();
				}
			});
			$(document).delegate('#filter_proto','change',function(){
				sg.controls.filter();
			});
			/*
			$(document).delegate('#filter_systype','change',function(){
				sg.controls.filter();
			});
			*/
			$(document).delegate('#filter_domain','change',function(){
				sg.controls.filter();
			});
		},
		//服务行显示/隐藏服务列表行的委托
		tr_on:function(){
			$('#content').delegate('.tr_server','click',function(event){
				if(!$(event.target).is("input")){
					var visible = $(this).attr('is_show');
					if(visible=="true") $(this).attr("is_show","false").next().hide();
					else $(this).attr("is_show","true").next().show();
				}
			});
		},
		//左侧li事件绑定
		li_on:function(){
			$("#center").delegate('#mgroup_clear','click',function(){
				$('#mgroup_filter').val('');
				$.lifilter('.mgroup_list','#mgroup_filter','mg');
			});
			$("#center").delegate('#mgroup_filter','keyup',function(){
				$.lifilter('.mgroup_list','#mgroup_filter','mg');
			});
			$(".mgroup_list").delegate("li","click",function(){
				var filter = $(this).find("a").attr("filter").substr(1);
				$(this).addClass('selected');
				$(this).siblings().removeClass('selected');
				sg.controls.select_server(filter);
			});
		},
		th_on:function(){
			$("body").on("click",".tr_head th",function(){
				var cname = $(this).attr("cname");
				if(cname=="name" || cname=="ipaddr" || cname=="systype"){
					sg.controls.setorder(this);
					sg.controls.filter();
				}
			});
		},
		check_all:function(){
			$("body").on("click","#sel_all_check",function(){
				var ck = $("#sel_all_check").attr("checked");
				if(ck){
					$("input[id*=ck_server]").attr("checked", true);
				}
				else{
					$("input[id*=ck_server]").removeAttr("checked");
				}
			}).on("click",":checkbox[id*=ck_server]",function(){
				var len = $(":checkbox[id*=ck_server]:checked").size();
				if (len!=sg.models.display_data.length){
					$("#sel_all_check").removeAttr("checked");
				}
				else{
					$("#sel_all_check").attr("checked",true);
				}
			});
			$("body").on("click","input[name=vnc_changed]",function(){
				if(this.checked){
					$(this).parent().next().show();
				}else{
					$(this).parent().next().hide();
				}
			}).on("click","#active_rdp_close",function(){
				sg.active_rdp.hide();
			});
		},
		//服务的左键单/双击事件委托
		left_on:function(){
			$('.bs-example4').delegate('.fuckclick',sg.config.left_way,function(){
				sg.action="left";
				var server_id = $(this).attr("server"),
				    service_id = $(this).attr("service"),
				    //added by linlin 2016-08-24
				    clip_app = $(this).attr("app"),
				    target_ip = $(this).attr("targetip"),
				    is_need_token = $(this).attr("is_need_token"),
				    _this = $(this),
				    server = _.find(sg.models.display_data,function(data){
				   	console.log(data); 
					return data.server_id == server_id;
				    }),
				    service = _.find(server.services,function(data){
				    console.log(server);
					return data.id == service_id;
				    });
				    if(service.type=='unknown'){
					alert(sg.info.http_not_support);
					return false;
				    }
				    // 选xfwd的any帐号要支持页面填写用户名密码然后代填
				    if(!!server.account && !((service.proto=="xfwd" || service.proto=="ftp" || service.proto=="sftp" || service.proto == 'xdmcp') && server.account=="6")){
					if(service.proto!="vnc" && (service.proto!= "xdmcp" || (xdmcp_login_agent && service.proto=="xdmcp"))){
						//检查默认帐号可访问性
						//加入token验证,addedby LinLin 2018-03-05

						if(is_need_token==1) {
							
                        	var token = prompt('请输入token');
                        	if(token){

                        		$.ajax({
             					type: 'POST',
             					url: '/qizhi/addtokentocookie',
             					data: {token:token},
             					success:function(data) {    
                 					sg.single_service.init(server,service,clip_app,target_ip);
             					},

             					error : function() {   
                 					alert("未知错误"); 
                 					return false;   
             					}    
         						});
                        		return false;
                        	}else{
                        		return false;
                        	}
                        }
                        	
                        	sg.single_service.init(server,service,clip_app,target_ip);
					}
				    	//有可帐号就直接启动访问
					else sg.single_service.init(server,service);
				    }
				    else{
				    	//没有帐号就用右键方式启动
					_this.trigger('contextmenu',[server,service]);
                                        console.log(server);
				    }
			}).delegate('.fuckclick','mouseover',function(){
				var server_id = $(this).attr("server"),
                                    service_id = $(this).attr("service"),
                                    //added by linlin 2016-08-24
                                    clip_app = $(this).attr("app"),
				    target_ip = $(this).attr("targetip"),
                                server = _.find(sg.models.display_data,function(data){
					//console.log(data.server_id);
					//console.log(server_id);
                                	return data.server_id == server_id;
                                }),
                                service = _.find(server.services,function(data){

                                	return data.id == service_id;
                                });
				if(service.proto=='rdp' && sg.config.gui_active_rdp!="none"){
                                        if(!sg.timeset){
                                                offset = $(this).offset();
                                                sg.timeset = setTimeout(function(){sg.active_rdp.get(server_id,offset);},1000);
                                        }
                                }
			}).delegate('.fuckclick','mouseout',function(){
				sg.active_rdp.hide();
                                clearTimeout(sg.timeset);
                                sg.timeset = undefined;
			});
		},
		//服务的右键事件委托
		right_on:function(){
			$('.bs-example4').delegate('.fuckclick','contextmenu',function(event,server,service){
				sg.action="right";
				console.log(service);
				if (!!server && !!service){
					//左键启动发现没有帐号后传入参数的情况
				        if(service.type=='unknown'){
					    alert(sg.info.http_not_support);
					    return false;
				        }
					if(service.proto=="vnc" || (!xdmcp_login_agent && service.proto=="xdmcp")){
						sg.action = "left";
						sg.single_service.init(server,service);
					}else{
						sg.single_service.check_sess_remark(service);
						sg.single_service.display_form(server,service);
					}
				}
				else{
					//直接点击右键的情况
					var server_id = $(this).attr("server"),
					    service_id = $(this).attr("service"),
                                            //added by linlin 2016-08-24
                                            clip_app = $(this).attr("app"),
                                            target_ip = $(this).attr("targetip"),
					    server = _.find(sg.models.display_data,function(data){
						return data.server_id == server_id;
					    }),
					    service = _.find(server.services,function(data){
						return data.id == service_id;
					    });
  				        if(service.type=='unknown'){
					    alert(sg.info.http_not_support);
					    return false;
				        }
					sg.single_service.check_sess_remark(service);
					sg.single_service.display_form(server,service);
				}
				return false;
			});
		},
		//批量启动选择好的设备
		batch_on:function(){
			$("body").delegate("#batch_show_btn","click",function(){
				sg.views.batch.base();
			});
			$('body').delegate('.ul_batch_service li',sg.config.left_way,function(){
				sg.action="left";
				var servers = $(this).parent().attr("servers"),
				    proto = $(this).attr("proto"),
				    name = $(this).find("img").attr("alt");
				servers = servers.split(",");
				if(proto=='http'){
					alert(sg.info.http_not_support);
					return false;
				}
				sg.batch_service.init(servers,proto,name);
				if(!sg.config.batch_no_account)
				$("#form-batch-base").dialog("close");
			});
			$('body').delegate('.ul_batch_service li','contextmenu',function(){
				sg.action="right";
				var servers = $(this).parent().attr("servers"),
				    proto = $(this).attr("proto"),
				    name = $(this).find("img").attr("alt");
				servers = servers.split(",");
				if(proto=='http'){
					alert(sg.info.http_not_support);
					return false;
				}
				sg.batch_service.init(servers,proto,name);
				$("#form-batch-base").dialog("close");
				return false;
			});

		},
		//ip地址比大小，用户前端ip地址排序
		compareIP:function(ipBegin, ipEnd){
			if(ipBegin != "" && ipEnd == "") return 1;
			if(ipBegin == "" && ipEnd == "") return -1;
			if(ipBegin == ipEnd) return 0;
			var temp1 = ipBegin.split("."),
			    temp2 = ipEnd.split("."); 
			for (var i = 0; i < 4; i++)  
			{  
				if (Number(temp1[i])>Number(temp2[i]))  
				{  
				    return 1;  
				}  
				else if (Number(temp1[i])<Number(temp2[i]))
				{  
				    return -1;  
				}  
			}  
			return 0;
		},
		//得到排序信息
		getorder:function(){
			var name;
			if(sg.models.order_name) name="server_name";
			if(sg.models.order_ipaddr) name="ipaddr";
			if(sg.models.order_remote) name="remote";
			if(sg.models.order_systype) name="systype";
			return {
				name:name,
				sort:(sg.models.desc ? "desc" : "asc")
			}	
		},
		//设定排序信息
		setorder:function(obj){
			var order = $(obj).attr("cname"),
			    old_name = sg.models.order_name,
			    old_ipaddr = sg.models.order_ipaddr,
			    old_remote = sg.models.order_remote,
			    old_systype = sg.models.order_systype,
			    reverse = true,
			    sort = $(obj).parent().attr("ad");
			switch(order){
			case "ipaddr":
				sg.models.order_name = 0;
				sg.models.order_ipaddr = 1;
				sg.models.order_remote = 0;
				sg.models.order_systype = 0;
				if (!old_ipaddr) reverse = false;
				break;
			case "remote":
				sg.models.order_name = 0;
				sg.models.order_ipaddr = 0;
				sg.models.order_remote = 1;
				sg.models.order_systype = 0;
				if (!old_remote) reverse = false;
				break;
			case "systype":
				sg.models.order_name = 0;
				sg.models.order_ipaddr = 0;
				sg.models.order_remote = 0;
				sg.models.order_systype = 1;
				if (!old_systype) reverse = false;			
				break;
			case "name":
			default:
				sg.models.order_name = 1;
				sg.models.order_ipaddr = 0;
				sg.models.order_remote = 0;
				sg.models.order_systype = 0;
				if (!old_name) reverse = false;
				break;
			}
			//颠倒排序的情况：1.相同的列的第二次点击
			if(reverse){	
				sg.models.asc = sg.models.asc ? 0 : 1;
				sg.models.desc = sg.models.desc ? 0 : 1;
			}
			else{
				sg.models.asc = 1;
				sg.models.desc = 0;
			}
		},
		//获得过滤参数
		getfilter:function(page){
			var data = {};
			data.name_ipaddr = $.trim($('#filter_name_ipaddr').val());
			data.proto = $.trim($('#filter_proto').val());
			data.systype = $.trim($('#filter_systype').val());
			data.domain = $.trim($('#filter_domain').val());
			data.server_grid_filter = sg.config.server_grid_filter;
			sg.models.filter.name_ipaddr = data.name_ipaddr;
			sg.models.filter.proto = data.proto;
			sg.models.filter.systype = data.systype;
			sg.models.filter.domain = data.domain;
			if (page){
				sg.config.pageindex = page;
			}
			else{
				sg.config.pageindex = 1;
			}
			return data;
		},
		//清楚过滤条件
		clearfilter:function(){
			$(':text[id*=filter_]').val('');	
			$('#filter_proto').val('');
			$('#filter_systype').val(0);
			$('#filter_domain').val('');
		},
		//右侧的规则和部门过滤方法
		select_server:function(type){
			sg.controls.clearfilter();
			sg.config.server_grid_filter = type;
			sg.controls.filter();
		},
		//form-advance-gui 是否支持remoteapp
		remoteapp_check:function(remoteapp){
		        return remoteapp>0;
		},
		//form-advance-gui 点击mstsc时的事件
		change_resolution:function(proto,remoteapp,seamless){
			var target = $("#mstsc_sel"),
			    resolution = $("#gui_resolution");
			if(proto!='xfwd' && proto!='vnc' && proto!='xdmcp'){
				if(!target.attr('checked')){
					resolution.find("option[value=fullscreen]").remove();
					resolution.find("option[value=maximize]").remove();
					if(proto=="rdpapp"){
						resolution.find("option[value=seamless]").remove();
						resolution.append("<option value='seamless'>"+sg.info.seamless+"</option>");
					}
				}
				else{
					resolution.find("option[value=fullscreen]").remove();
					resolution.find("option[value=maximize]").remove();
					resolution.find("option[value=seamless]").remove();
					resolution.append("<option value='fullscreen'>"+sg.info.fullscreen+"</option>");
					resolution.append("<option value='maximize'>"+sg.info.maximize+"</option>");
					//resolution.find("option[value=seamless]").remove();
					if(proto=="rdpapp" && sg.controls.remoteapp_check(remoteapp)){
						resolution.append("<option value='seamless'>"+sg.info.seamless+"</option>");
                                                if(!seamless) resolution.val("seamless");
                                                else resolution.val(sg.config.gui_default);
					}
					else{	
						resolution.val(sg.config.gui_default);
					}
				}
			}
			else{
				resolution.find("option[value=fullscreen]").remove();
				resolution.find("option[value=maximize]").remove();
			}
		},
		//读取磁盘映射
		get_disks:function(){
			if (sg.config.diskmap_selector!='config'){
				sg.config.disks = ["c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
			}else{
				sg.config.disks = sg.config.rdp_diskmap.toLowerCase().split(" ").sort(); 
			}
		}
	},
	single_service:{
		//初始化，弹出请稍候的等待界面
		// linlin 修改增加了一个默认参数app
		init:function(server,service,app,target_ip){//single
                        console.log('fuck damm')
			$("#service_start").dialog({
				autoOpen:true,
				position:'center',
				width:350,
				modal:true,
				resizable:false,
				open:function(){
					$("#waiting_span").show();
					sg.single_service.check_vnc_secret(service);
					sg.single_service.validate_dual_auth(server,service,false,app,target_ip);
				},
				close:function(){
					$(this).dialog("destroy").hide();
					$("#waiting_span").hide();
					$("#system_error").hide();
				}
			});
		},
		//ajax确认是否需要双人授权
		validate_dual_auth:function(server,service,advance,app,target_ip){//single
			var the_account = server.account,
			    the_server = server.server_id,
			    the_service = service.id;
			console.log('oop');
			//表单启动方式填入表单参数
			if(!!advance){
				the_account = advance.account;
				the_server = advance.server;
				the_service = advance.service;
			}	
			/*	
			if(sg.caches.single['_'+the_service+'_'+the_server+'_'+the_account]){
				//读cache
				if(!!advance){
					sg.single_service.display_dual_auth_advance(advance,sg.caches.single['_'+the_service+'_'+the_server+'_'+the_account].dual_auth);
				}
				else sg.single_service.validate_sess_remark(server,service,sg.caches.single['_'+service.id+'_'+server.server_id+'_'+server.account].dual_auth);
			}
			else{
			*/
				var data = {'server':the_server,'account':the_account,'service':the_service};
				$.ajax({
					type:'POST',
					url:sg.config.dual_auth_url,
					data:data,
					cache:true,
					timeout:sg.config.timeout,
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
						$("#system_error").text(textStatus).show();
						$("#waiting_span").hide();
						return false;
					},
					success:function(html){
						//右键表单启动方式

						// 仅对tui和gui进行双人授权处理
						if(!!advance){
							sg.single_service.display_dual_auth_advance(advance,html);
						}
						//左键点击
						//正常流程,走这里 added by linlin
						else{
							//console.log(app);
							sg.single_service.validate_sess_remark(server,service,html,app,target_ip);
						}
					}
				});
			//}
		},
		check_sess_remark:function(service){//single
			if(service.type!='file'){
				switch(sg.config.sess_remark_mode){
				//必填
				case "force":
					sg.config.show_sess_remark = true;
					sg.config.force_sess_remark = true;
					break;
				//可填
				case "need":
					sg.config.show_sess_remark = true;
					sg.config.force_sess_remark = false;
					break;
				//左键不填，右键可填
				case "may":
					if(sg.action=='right'){
						sg.config.show_sess_remark = true;
						sg.config.force_sess_remark = false;
					}
					else{
						sg.config.show_sess_remark = false;
						sg.config.force_sess_remark = false;
					}
					break;
				//不填
				default:
					sg.config.show_sess_remark = false;
					sg.config.force_sess_remark = false;
					break;
				}
			}
			else{
				sg.config.show_sess_remark = false;
				sg.config.force_sess_remark = false;
			}	
		},
		check_vnc_secret:function(service){//single
			if(service.proto=="vnc" && service.options.vnc_secret.length==0){
				sg.show_vnc = true;
			}
			else sg.show_vnc = false;	
		},
		//判断是否要填写备注
		validate_sess_remark:function(server,service,html,app,target_ip){//single
			sg.single_service.check_sess_remark(service);
			if(html=="0"){
				//无需双人授权
				sg.caches.single['_'+service.id+'_'+server.server_id+'_'+server.account] = {
					dual_auth:0
				};
				if(sg.config.show_sess_remark){
					//需要备注
					sg.single_service.display_sess_remark(server,service);		
				}
				else{
					//不需要备注
					if(sg.show_vnc){
						//需要vnc密码
						sg.single_service.display_vnc_secret(server,service);
					}
					//不需要vnc密码
					// comment by linlin just start here from my web
					else {  sg.single_service.start(server,service,'',0,'','','','',app,target_ip); }
				}
			}
			else{
				//返回未知错误
				if(html.search(sg.config.reg1)!=-1){
					$("#system_error").text(sg.info.error_query).show();
					$("#waiting_span").hide();
					return false;
				}
				//返回已知错误
				else if(html.search(sg.config.reg2)!=-1){
					$("#system_error").text(html.split(':')[1]).show();
					$("#waiting_span").hide();
					return false;
				}
				//返回双人授权帐号
				else{
					sg.caches.single['_'+service.id+'_'+server.server_id+'_'+server.account] = {
						dual_auth:html
					};
					sg.dual_auth_identities = html.split(",");
					sg.single_service.display_dual_auth(server,service);
				}
			}
		},
		display_vnc_secret:function(server, service){
			$("#vnc_secret_div").dialog({
				autoOpen:true,
				modal:true,
				width:400,
				resizable:false,
				open:function(){
					$(this).find(":password").val("");
					$('#vnc_secret_btn').unbind("click");
					$('#vnc_secret_btn').click(function(){
						var vnc_secret = $.trim($("#vnc_secret_div :password").val());
						if(vnc_secret.length==0){
							alert(sg.info.vnc_secret);
							return false;
						}
						sg.single_service.start(server,service,'',0,'','',vnc_secret,true);
                                                console.log(clip_app);
						$("#vnc_secret_div").dialog('destroy').hide();				
					});
				},
				close:function(){
					$(this).dialog('destroy').hide();
					$("#service_start").dialog('close');	
				}
			});
		},
		//显示备注界面
		display_sess_remark:function(server, service){
			$("#sess_remark").val('');
			if(sg.config.show_sess_remark){
				$("#sess_remark_div").dialog({
					autoOpen:true,
					modal:true,
					width:400,
					resizable:false,
					open:function(){	
						$(this).find("input[name=vnc_secret]").val("");
						if(sg.show_vnc){
							$(this).find(".tr_vnc_secret").show();
						}
						else{
							$(this).find(".tr_vnc_secret").hide();
						}
						$('#sess_remark_btn').unbind("click");
						$('#sess_remark_btn').click(function(){
							var sess_remark = $.trim($("#sess_remark").val());
							if(sg.config.force_sess_remark && sg.len(sess_remark)<5){
								alert(sg.info.remark_force);
								return false;
							}
							else if(sg.len(sess_remark)>200){
								alert(sg.info.remark_len);
								return false;
							}
							if(sg.show_vnc){
								var vnc_secret = $.trim($("#sess_remark_div input[name=vnc_secret]").val());
								if(vnc_secret.length==0){
									alert(sg.info.vnc_secret);
									return false;
								}
								else{
									sg.single_service.start(server,service,sess_remark,0,'','',vnc_secret,true);
									console.log(clip_app);
								}
							}
							else{
								sg.single_service.start(server,service,sess_remark,0,'','','','');
								console.log(clip_app);
							}
							$("#sess_remark_div").dialog('close');
						});	
						$('#sess_remark').unbind("keypress");
						$('#sess_remark').keypress(function(e){
							if(e.keyCode==13){
								$('#sess_remark_btn').trigger('click');
							}
						});
					},
					close:function(){
						$(this).dialog('destroy').hide();
						$("#service_start").dialog('close');	
					}
				});
			}
		},
		//渲染双人授权界面
		display_dual_auth:function(server,service){

			// 依据此次要求，file上传不需要双人授权
			//if(service.type === 'file'){
			//	var sess_remark = '',
			//		login = '',
			//		password = '';
			//	sg.single_service.start(server,service,sess_remark,1,login,password,'','');
			//	return ;
			//}

			var tmpl = "{{#dual_auth_identities}}<option value='{{.}}'>{{.}}</option>{{/dual_auth_identities}}";
			$("#identity_dual_auth").empty().append(Mustache.to_html(tmpl,sg));
			$("#sess_remark_dual_auth").val("");
			$("#password_dual_auth").val("");
			$("#password_warning").empty();
			$("#service_start").dialog('close');	
			$("#dual_auth_div").dialog({
				autoOpen:true,
				position:'center',
				width:400,
				modal:true,
				resizable:false,
				open:function(){
					$(this).find("input[name=vnc_secret]").val("");
					if(sg.show_vnc){
						$(this).find(".tr_vnc_secret").show();
					}
					else{
						$(this).find(".tr_vnc_secret").hide();
					}
					if(sg.config.show_sess_remark){
						$("#tr_sess_remark_dual_auth").show();
						$('#dual_auth_div').dialog("option",{height:258});
						$('#dual_auth_btn').unbind("click");
						$('#dual_auth_btn').click(function(){
							var sess_remark = $.trim($("#sess_remark_dual_auth").val()),
							    login = $("#identity_dual_auth").val(),
							    password = '';
							if(dual_oper !== '1'){
								password = $("#password_dual_auth").val();
								if(password.length==0){
									$("#password_warning").text(sg.info.passwd);
									return false;
								}
							}
							if(sg.config.force_sess_remark && sg.len(sess_remark)<5){
								$("#password_warning").text(sg.info.remark_force);
								//$("#sess_remark_dual_auth").focus();
								return false;
							}
							else if(sg.len(sess_remark)>200){
								$("#password_warning").text(sg.info.remark_len);
								//$("#sess_remark_dual_auth").focus();
								return false;
							}
							if(sg.show_vnc){
								var vnc_secret = $.trim($("#dual_auth_div input[name=vnc_secret]").val());
								if(vnc_secret.length==0){
									$("#password_warning").text(sg.info.vnc_secret);
									return false;
								}
								else{
									sg.single_service.start(server,service,sess_remark,1,login,password,vnc_secret,true);
									console.log(clip_app);
								}
							}
							else{
								sg.single_service.start(server,service,sess_remark,1,login,password,'','');
								console.log(clip_app);
							}
							$("#dual_auth_div").dialog('close');
						});
					}
					else{
						$("#tr_sess_remark_dual_auth").hide();
						$('#dual_auth_btn').unbind("click");
						$('#dual_auth_btn').click(function(){
							var login = $("#identity_dual_auth").val();
							var password = '';
							if(dual_oper !== '1'){
								password = $("#password_dual_auth").val();
								if(password.length==0){
									$("#password_warning").text(sg.info.passwd);
									return false;
								}
							}
							if(sg.show_vnc){
								var vnc_secret = $.trim($("#dual_auth_div input[name=vnc_secret]").val());
								if(vnc_secret.length==0){
									$("#password_warning").text(sg.info.vnc_secret);
									return false;
								}
								else{
									sg.single_service.start(server,service,'',1,login,password,vnc_secret,true);
									console.log(clip_app);
								}
							}
							else{
								sg.single_service.start(server,service,'',1,login,password,'','');
								console.log(clip_app);
							}
							$("#dual_auth_div").dialog('close');
						});		
					}
					$('#password_dual_auth').unbind("keypress");
					$('#password_dual_auth').keypress(function(e){
						if(e.keyCode==13){
							$('#dual_auth_btn').trigger('click');
						}
					});
				},
				close:function(){
					$("#tr_sess_remark_dual_auth").hide();
					$(this).dialog("destroy").hide();
				}
			});
		},
		display_dual_auth_advance:function(params,html){
			if(html=="0"){
				switch(params.type){
				case "tui":
					sg.single_service.tui_start(params);
                                        console.log('fuck');
					break;
				case "gui":
					sg.single_service.gui_start(params);
					break;
				case "file":
					sg.single_service.file_start(params);
					break;
				default:
					break;
				}	
			}
			else{
				if(html.search(sg.config.reg1)!=-1){
					alert(sg.info.error_query);
					return false;
				}
				//返回已知错误
				else if(html.search(sg.config.reg2)!=-1){
					var error = html.split(':')[1];
					alert(error);
					return false;
				}

				//if(params.type == 'file'){
				//	params.dual_auth = 	0;
				//	params.dual_auth_login = '';
				//	params.dual_auth_password = '';
				//	sg.single_service.file_start(params);
				//	return;
				//}

				var tmpl = "{{#dual_auth_identities}}<option value='{{.}}'>{{.}}</option>{{/dual_auth_identities}}";
				sg.dual_auth_identities = html.split(",");
				$("#identity_dual_auth").empty().append(Mustache.to_html(tmpl,sg));
				$("#password_dual_auth").val("");
				$("#password_warning").empty();
				if(sg.action=="right") $("#dual_auth_div").find(".tr_vnc_secret").hide();
				$("#dual_auth_div").dialog({
					autoOpen:true,
					position:'center',
					width:450,
					modal:true,
					resizable:false,
					open:function(){
						$('#dual_auth_btn').unbind("click");
						$('#dual_auth_btn').click(function(){
							var login = $("#identity_dual_auth").val();
							var password = '';
							if(dual_oper !== '1'){
								password = $("#password_dual_auth").val();
								if(password.length==0){
									$("#password_warning").text(sg.info.passwd);
									return false;
								}
							}

							params.dual_auth=1;
							params.dual_auth_login = login;
							params.dual_auth_password = password;
							switch(params.type){
							case "tui":
								sg.single_service.tui_start(params);
                                                                console.log('fuck');
								break;
							case "gui":
								sg.single_service.gui_start(params);
								break;
							case "file":
								sg.single_service.file_start(params);
								break;
							default:
								break;
							}
							$("#dual_auth_div").dialog('close');
						});		
						$('#password_dual_auth').unbind("keypress");
						$('#password_dual_auth').keypress(function(e){
							if(e.keyCode==13){
								$('#dual_auth_btn').trigger('click');
							}
						});
					},
					close:function(){
						$("#tr_sess_remark_dual_auth").hide();
						$(this).dialog("destroy").hide();
					}
				});
			}
		},
		display_form:function(server,service){
			switch(service.type){
			case "tui":
				sg.views.tui.advance.create(server, service);
				break;
			case "gui":
				sg.views.gui.advance.create(server, service);
				break;	
			case "file":
				sg.views.file.advance.create(server, service);
				break;
			default:
				break;
			}
		},
		render_disks:function(server,service,account_id){
			//ajax查询显示/隐藏磁盘映射
			if(service.options.rdp_diskmap){
				$.ajax({
					url:sg.config.gui_disk_url,
					type:"POST",
					data:{'service':service.id, 'option':'diskmap', 'account': account_id},
					timeout:sg.config.timeout,
					cache:true,
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
						alert(textStatus);
						return false;
					},
					success:function(html){
						$("#form-advance-"+service.type).find("table").fadeIn(100);
						if ($.trim(html) == '1'){
							$("#tr_rdp_disk td").empty();
							for(var i=0,len=sg.config.disks.length;i<len;i++){
								var check_diskmap = '';
								if(sg.config.disks[i]){
									if(sg.config.rdp_diskmap_sel[sg.config.disks[i].toLowerCase()]){
										check_diskmap = "checked='checked'";
									}
                                    var diskmap_style = "";
                                    if(i>7){
                                        diskmap_style ="display:none;";
                                    }
									$("#tr_rdp_disk td").append("<span class='rdp-dmap' style='"+diskmap_style+"'><input type='checkbox' "+check_diskmap+" style='border-style: none' name='disk_sel[]' value='" + sg.config.disks[i].toLowerCase() + "' /><span style='margin-left:2px;cursor:default' onClick='previousSibling.click();'>" + sg.config.disks[i] + ": </span></span>");
                                    if(i==7){
                                        $("#tr_rdp_disk td").append("<a href='#' id='_more'>"+more_text+"</a>");
                                    }
                                    
                                    if((i + 1) %8 == 0){
                                        $('#tr_rdp_disk td').append('<span class="br-style" style="display:none;"><br/></span>');
                                    }
								}
							}
							$("#tr_rdp_disk").show();
                            $('#_more').click(function(){
                                $(this).hide();
                                $('.rdp-dmap').show();
                                $('.br-style').show();
                            });
						}
						else{
							$("#tr_rdp_disk").hide();
						}
					}
				});
			}
			else{
				$("#form-advance-"+service.type).find("table").fadeIn(100);
				$("#tr_rdp_disk").hide();
			}
		},
		get_accounts:function(server,service){
			var res = {};
			$.ajax({ 
				url:'/qizhi/server_grid_getaccount',
				type:'POST',
				data:{server:server.server_id, proto:service.proto, service_id:service.id},
				cache:true,
				timeout:sg.config.timeout,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
					alert(textStatus);
					return false;
				},
				success:function(html){
					//console.log((new Date()).toTimeString());
					if(html!="0"){
						if(service.type!='gui')
						$("#form-advance-"+service.type).find("table").fadeIn(100);
						//$("#form-advance-"+service.type).find("table").show();
						try{
							res = $.parseJSON(html);
						//	res = (new Function('return '+html))();
						}
						catch(e){
							res = 1;
							switch(service.type){
							case "tui":
								$('<span id="account_error">'+sg.info.account_error+'</span>').insertAfter($('#form-advance-tui'));
								break;
							case "gui":
								$('<span id="account_error">'+sg.info.account_error+'</span>').insertAfter($('#form-advance-gui'));
								break;
							case "file":
								$('<span id="account_error">'+sg.info.account_error+'</span>').insertAfter($('#form-advance-file'));
								break;
							default:
								break;
							}
						}	
					}
					else{
                        res=0;
						if(service.proto!='vnc' && (service.proto!="xdmcp" || (xdmcp_login_agent && service.proto=="xdmcp"))){
                            $('<span id="account_error">'+sg.info.account_none+'</span>').insertAfter($('#form-advance-'+service.type+' table'));
                            $("#form-advance-"+service.type).find("table").hide();
						}
						if(service.proto=='vnc' || service.proto=='xdmcp'){
							sg.single_service.render_disks(server,service,0);
						}
					}
					if(res!=0 && res != 1){
						var tmpl = "{{#accounts}}<option value='{{id}}'>{{#mark}}*{{name}}{{/mark}}{{^mark}}&nbsp;{{name}}{{/mark}}</option>{{/accounts}}";

						switch(service.type){
						case "tui":
							$("#form-advance-tui select[name=account]").append(Mustache.to_html(tmpl,res));	
							break;
						case "gui":
							$("#form-advance-gui select[name=account]").append(Mustache.to_html(tmpl,res));
							$("#form-advance-gui select[name=account]").unbind("change");
							$("#form-advance-gui select[name=account]").change(function(){
								$("#form-advance-"+service.type).find("table").hide();
								var account_id = $(this).val();
								sg.single_service.render_disks(server,service,account_id);
								// any需要从页面输入用户名和密码
								//alert(account_id);
								if (account_id == 6 && (service.proto == 'xfwd' || service.proto == 'xdmcp')) {
									//alert("gui show");
									$("#account_manual_input_gui").show();
								} else {
									$("#account_manual_input_gui").hide();
								}
							});
                            sg.single_service.render_disks(server,service,res.accounts[0].id);
							// any需要从页面输入用户名和密码
							if ($("#form-advance-gui select[name=account]").val() == 6 && (service.proto == 'xfwd' || service.proto == 'xdmcp')) {
								$("#account_manual_input_gui").show();
							} else {
								$("#account_manual_input_gui").hide();
							}
							break;
						case "file":
							$("#form-advance-file select[name=account]").append(Mustache.to_html(tmpl,res));
							$("#form-advance-file select[name=account]").unbind("change");
							$("#form-advance-file select[name=account]").change(function(){
								var account_id = $(this).val();
								sg.single_service.render_disks(server,service,account_id);
								// any需要从页面输入用户名和密码
								//alert(account_id);
								if (account_id == 6) {
									//alert("file show");
									$("#account_manual_input_file").show();
								} else {
									$("#account_manual_input_file").hide();
								}
							});
							// any需要从页面输入用户名和密码
							if ($("#form-advance-file select[name=account]").val() == 6) {
								$("#account_manual_input_file").show();
							} else {
								$("#account_manual_input_file").hide();
							}
							break;
						default:
							break;
						}
					}
				}
			});
		},
		//启动服务
		// comment by linlin  加了个自定义参数app进来
		start:function(server,service,sess_remark,dual_auth,dual_auth_login,dual_auth_password,vnc_secret,vnc_changed,app,target_ip){
			switch(service.type){
			case "tui":
				resolution = "80x24";
				if(sg.config.tui_default) resolution = sg.config.tui_default;
				params = {
					server:server.server_id,
					account:server.account,
					service:service.id,
					//下面这个remote_app是自定义的,从html里ul_service li 下的 app 传进来的
                                        remote_app: app,
                                        target_ip: target_ip,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					dual_auth:dual_auth,
					dual_auth_login:dual_auth_login,
					dual_auth_password:dual_auth_password,
					resolution:resolution,
					bg_color:sg.config.tui_color,
					proto:service.proto
				};
				sg.single_service.tui_start(params);
                                console.log('fuck');
				break;
			case "gui":
				var resolution,mstsc,params,full_resolution;
				mstsc = (sg.config.gui_client == "mstsc" && (service.proto=="rdpapp" || service.proto=="rdp")) ? 1 : 0;
				resolution = "1024x768";
				if(sg.config.gui_default) resolution = sg.config.gui_default;
				if (service.proto == "rdpapp") {
					if (service.options.remoteapp) {
						//rdpapp开启remoteapp模式的，强制使用无缝+mstsc方式启动
						resolution = "seamless" + screen.width + "x" + screen.height;
						mstsc = 1;
					}
 					else if (service.options.seamless=='0' && resolution!="fullscreen") resolution = "direct" + resolution;
					else if(service.options.seamless=='1' && !mstsc) resolution = "seamless"+screen.width+'x'+screen.height;
					else if(resolution!="fullscreen" && resolution!="maximize") resolution  = "direct" + resolution;
					else if(resolution=="fullscreen") full_resolution = screen.width + "x" + screen.height;
				}
				else{
					if(resolution=="fullscreen"){
						full_resolution = screen.width + "x" + screen.height;
					}
				}
				if(!mstsc && (resolution == "fullscreen" || resolution == "maximize")) {
					resolution = "800x600";
				}
				params = {
					server:server.server_id,
					account:server.account,
					service:service.id,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					dual_auth:dual_auth,
					dual_auth_login:dual_auth_login,
					dual_auth_password:dual_auth_password,
					resolution:resolution,
					rdp_console:(rdp_console_default_by_person && service.options.rdp_console),
					mstsc:mstsc
				};
				if(full_resolution){
					params.full_resolution = full_resolution;
				}
				if(resolution == "maximize") {
					params.resolution = screen.availWidth + "x" + screen.availHeight;
					params.maximize = 1;
				}

				if(rdp_diskmap_left) {
					rdp_diskmap_left = _.intersection(rdp_diskmap_left,sg.config.disks);
					if(rdp_diskmap_left.length)params.disk = rdp_diskmap_left.join(',');
				}
				if(service.proto == "vnc"){
					params.vnc_secret = vnc_secret
					params.vnc_changed = vnc_changed;
				}
				sg.single_service.gui_start(params);
				break;
			case "file":
				var params = {
					server:server.server_id,
					account:server.account,
					service:service.id,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					dual_auth:dual_auth,
					dual_auth_login:dual_auth_login,
					dual_auth_password:dual_auth_password
				};
				sg.single_service.file_start(params);
				break;
			default:
				break;
			}
		},
		form_start:function(type){
			switch(type){
			case "tui":
				var sess_remark = '',
				    server_id = $("#form-advance-tui input[name=server]").val(),
				    service_id = $("#form-advance-tui input[name=service]").val(),
				    account = $("#form-advance-tui select[name=account]").val(),
				    proto = $("#form-advance-tui input[name=proto]").val(),
                                    resolution = $("#form-advance-tui select[name=resolution]").val(),
                                    bg_color = $("#form-advance-tui select[name=bg_color]").val();

				if(!account){
					alert(sg.info.account);
					return false;
				}
				if(sg.config.show_sess_remark){
					sess_remark = $.trim($("#form-advance-tui textarea[name=sess_remark]").val());
				}
				var params = {
					type:type,
					proto:proto,
					server:server_id,
					account:account,
					service:service_id,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					resolution:resolution,
					bg_color: bg_color
				};
				break;
			case "gui":
				var sess_remark = '',
				    server_id = $("#form-advance-gui input[name=server]").val(),
				    service_id = $("#form-advance-gui input[name=service]").val(),
				    account = $("#form-advance-gui select[name=account]").val() || 0,
				    proto = $("#form-advance-gui input[name=proto]").val(),
				    rdp_console = $("#console_sel").attr("checked") ? 1 : 0,
				    rdp_mstsc = ($("#mstsc_sel").attr("checked") && (proto=="rdp" || proto=="rdpapp")) ? 1 : 0,
				    http_default = $("#http_default_sel").attr("checked") ? 1 : 0,
				    disk_list = [],
				    resolution = $("#form-advance-gui select[name=resolution]").val(),
				    full_resolution = false,
				    account_manual_input_remote = $("#form-advance-gui input[name=account_manual_input_remote]").val(),
				    account_manual_input_passwd = $("#form-advance-gui input[name=account_manual_input_passwd]").val();
				if(!account && proto!="vnc" && (service.proto!="xdmcp" || (xdmcp_login_agent && service.proto=="xdmcp"))){
					alert(sg.info.account);
					return false;
				}
				if(sg.config.show_sess_remark){
					sess_remark = $.trim($("#form-advance-gui textarea[name=sess_remark]").val());
				}
				var ckbarr=document.getElementById('tr_rdp_disk').getElementsByTagName('input');
				for(i=0;i<ckbarr.length;i++){
					if(ckbarr[i].name='disk_sel[]' && ckbarr[i].checked){
						disk_list.push(ckbarr[i].value);
					}
				}
				disk = disk_list.join(",");
				if (proto == "rdpapp" && resolution == "seamless") resolution = "seamless" + screen.width + "x" + screen.height;
				if(resolution=="fullscreen"){
					full_resolution = screen.width + "x" + screen.height;
				}
				var params = {
					type:type,
					proto:proto,
					server:server_id,
					account:account,
					service:service_id,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					resolution:resolution,
					mstsc:rdp_mstsc,
					rdp_console:rdp_console,
					http_default:http_default,
					disk:disk,
					account_manual_input_remote:account_manual_input_remote,
					account_manual_input_passwd:account_manual_input_passwd
				};
				if(full_resolution){
					params.full_resolution = full_resolution;
				}
				if(resolution == "maximize") {
					params.resolution = screen.availWidth + "x" + screen.availHeight;
					params.maximize = 1;
				}

				if(proto=="vnc"){
					params.vnc_secret = $("#form-advance-gui input[name=vnc_secret]").val();
					params.vnc_changed = ($("#form-advance-gui input[name=vnc_changed]").attr("checked")) ? 1 : 0;
				}
				break;
			case "file":
				var sess_remark = '',
				    server_id = $("#form-advance-file input[name=server]").val(),
				    service_id = $("#form-advance-file input[name=service]").val(),
				    account = $("#form-advance-file select[name=account]").val(),
				    account_manual_input_remote = $("#form-advance-file input[name=account_manual_input_remote]").val(),
				    account_manual_input_passwd = $("#form-advance-file input[name=account_manual_input_passwd]").val();
				if(!account){
					alert(sg.info.account);
					return false;
				}
				if(sg.config.show_sess_remark){
					sess_remark = $.trim($("#form-advance-file textarea[name=sess_remark]").val());
				}
				var params = {
					type:type,
					server:server_id,
					account:account,
					service:service_id,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					account_manual_input_remote:account_manual_input_remote,
					account_manual_input_passwd:account_manual_input_passwd
				};	
				break;
			}
			sg.single_service.validate_dual_auth(false,false,params);
		},
		//启动tui服务
	        tui_start:function(params, batch){
			params.authorize = params.dual_auth;
			params.authorize_login = params.dual_auth_login;
			params.authorize_password = params.dual_auth_password;
			$("#service_start").dialog("close");
			$("#form-advance-tui").dialog("close");
			if(batch){
				return;
			}
			if(sg.config.tui_client=="jterm" && params.proto!="tn5250"){
				sg.views.tui.base.create(params);
				$("#form-base-tui").submit();
			}
			else{
				$.ajax({
					url:sg.config.tui_url,
					type:"POST",
					data:params,
					timeout:sg.config.timeout,
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
						alert(textStatus);
						return false;
					},
					success:function(html){
						if(html.match("no log")){
							window.location.href='/qizhi/logout';
                                                }
						else{

							if(html.search(sg.config.reg1)!=-1){
								w = window.open("about:blank","_blank","width=800,height=480,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=no");
								w.document.write(html);
							}
							else{
								var load_params = {type:tui_client,options:html};
								if(params.proto == "tn5250") load_params.type='pcomm';
								sg.shterm_loader.run(load_params);
							}
						}
					}
				});
				return false;
				
			}
		},
		//启动gui服务
		gui_start:function(params, batch){
			params.authorize = params.dual_auth;
			params.authorize_login = params.dual_auth_login;
			params.authorize_password = params.dual_auth_password;
			$("#service_start").dialog("close");
			$("#form-advance-gui").dialog("close");
            params.mode = $.os.name;
            if(batch){
            	return;
            }
			$.ajax({
				url:sg.config.gui_url,
				type:"POST",
				data:params,
				timeout:sg.config.timeout,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					textStatus = textStatus == "timeout" ? sg.info.timeout: sg.info.error_404;
					alert(textStatus);
					return false;
				},
				success:function(html){
					if(html.search(sg.config.reg1)!=-1){
						w = window.open("about:blank","_blank","width=800,height=480,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=no");
						w.document.write(html);
					}
					else{
						var load_params={type:'GuiViewer',options:html};
						if (params.mstsc) load_params.type = 'mstsc';
						sg.shterm_loader.run(load_params);
					}
				}
			});
		},	
		//启动文件传输服务
		file_start:function(params, batch){
			$("#service_start").dialog("close");
			$("#form-advance-file").dialog("close");
			params.authorize = params.dual_auth;
			params.authorize_login = params.dual_auth_login;
			params.authorize_password = params.dual_auth_password;
			if(batch){
				return;
			}
			$.ajax({
				url:sg.config.file_url,
				type:"POST",
				data:params,
				timeout:sg.config.timeout,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					textStatus = textStatus == "timeout" ? sg.info.timeout: sg.info.error_404;
					alert(textStatus);
					return false;
				},
				success:function(html){
					if(html.search(sg.config.reg1)!=-1){
						w = window.open("about:blank","_blank","width=800,height=480,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=no");
						w.document.write(html);
					}
					else{
						var load_params={type:'filezilla',options:html};
						sg.shterm_loader.run(load_params);
					}
				}
			});
		}

	},
	batch_service:{
		//批量设备访问备注检查
		check_sess_remark:function(proto){//batch
			if(proto!='ftp' && proto!='sftp'){
				switch(sg.config.sess_remark_mode){
				//必填
				case "force":
					sg.config.show_sess_remark = true;
					sg.config.force_sess_remark = true;
					break;
				//可填
				case "need":
					sg.config.show_sess_remark = true;
					sg.config.force_sess_remark = false;
					break;
				//左键不填，右键可填
				case "may":
					if(sg.action=='right'){
						sg.config.show_sess_remark = true;
						sg.config.force_sess_remark = false;
					}
					else{
						sg.config.show_sess_remark = false;
						sg.config.force_sess_remark = false;
					}
					break;
				//不填
				default:
					sg.config.show_sess_remark = false;
					sg.config.force_sess_remark = false;
					break;
				}
			}
			else{
				sg.config.show_sess_remark = false;
				sg.config.force_sess_remark = false;
			}
		},
		validate_sess_remark:function(proto){//batch
			sg.batch_service.check_sess_remark(proto);
			if(sg.config.show_sess_remark){
				//需要备注
				sg.batch_service.display_sess_remark(proto);
			}
			else{
				//不需要备注
				sg.batch_service.start(proto,'');
				if(sg.models.batch_need_dual_auth.length>0){
					var tmpl = $("#template-batch-failed").html();
					$("#content").append(Mustache.to_html(tmpl,sg.models));
					$("#batch-failed").dialog({
						autoOpen:true,
						position:'center',
						width:500,
						modal:true,
						resizable:false,
						close:function(){
							$(this).dialog("destroy").remove();
						}
					});
				}
			}
		},
		//显示备注
		display_sess_remark:function(proto){//batch
			$("#sess_remark").val('');
			if(sg.config.show_sess_remark){
				$("#sess_remark_div").dialog({
					autoOpen:true,
					modal:true,
					width:450,
					resizable:false,
					open:function(){	
						$('#sess_remark_btn').unbind("click");
						$('#sess_remark_btn').click(function(){
							var sess_remark = $.trim($("#sess_remark").val());
							if(sg.config.force_sess_remark && sg.len(sess_remark)<5){
								alert(sg.info.remark_force);
								return false;
							}
							else if(sg.len(sess_remark)>200){
								alert(sg.info.remark_len);
								return false;
							}
							sg.batch_service.start(proto, sess_remark);
							$("#sess_remark_div").dialog('close');
							//显示需要双人授权的服务
							if(sg.models.batch_need_dual_auth.length>0){
								var tmpl = $("#template-batch-failed").html();
								$("#content").append(Mustache.to_html(tmpl,sg.models));
								$("#batch-failed").dialog({
									autoOpen:true,
									position:'center',
									width:500,
									modal:true,
									resizable:false,
									close:function(){
										$(this).dialog("destroy").remove();
									}
								});
							}

						});	
						$('#sess_remark').unbind("keypress");
						$('#sess_remark').keypress(function(e){
							if(e.keyCode==13){
								$('#sess_remark_btn').trigger('click');
							}
						});
					},
					close:function(){
						$(this).dialog('destroy').hide();
						$("#service_start").dialog('close');	
					}
				});
			}
		},
		//批量设备访问双人授权
		validate_dual_auth:function(proto){
			sg.models.batch_need_dual_auth = [];
			$.ajax({
				url:sg.config.dual_auth_url,
				type:'POST',
				data:sg.models.batch_dual_auth,
				cache:true,
				success:function(html){
					if(html==0){
						//不需要双人授权
						sg.batch_service.validate_sess_remark(proto);
					}
					else{
						//需要双人授权,另外判断备注
						if(html.search(sg.config.reg1)!=-1){
							alert(sg.info.error_query);
							return false;
						}
						if(html.search(sg.config.reg2)!=-1){
							alert(html.split(":")[1]);
							return false;
						}
						else{
							//得到按顺序排列的0，1值的list，把需要双人授权的验证的数组取出来
							var dual_auth_accounts = html.split(',');
							for(var i = 0,len = dual_auth_accounts.length;i<len;i++){
								if(dual_auth_accounts[i]==1){
									sg.models.batch_servers[i].dual_auth = true;
									sg.models.batch_need_dual_auth.push(sg.models.batch_servers[i]);
								}
							}
							sg.batch_service.validate_sess_remark(proto);
						}
					}
				}
			});
		},
		//批量设备右键访问双人授权
		validate_dual_auth_advance:function(params){
			sg.models.batch_need_dual_auth = [];
			_.each(sg.models.batch_dual_auth.accounts,function(one){
				one = params.account;
			});
			params.advance = true;
			$.ajax({
				url:sg.config.dual_auth_url,
				type:'POST',
				data:sg.models.batch_dual_auth,
				cache:true,
				success:function(html){
					if(html==0){
						//不需要双人授权,直接启动
						switch(params.type){
						case "tui":
							sg.batch_service.tui_start(params);
                                                        console.log('fuck');
							break;
						case "gui":
							sg.batch_service.gui_start(params);
							break;
						case "file":
							sg.batch_service.file_start(params);
							break;
						default:
							break;
						}
					}
					else{
						//需要双人授权
						if(html.search(sg.config.reg1)!=-1){
							alert(sg.info.error_query);
							return false;
						}
						if(html.search(sg.config.reg2)!=-1){
							alert(html.split(":")[1]);
							return false;
						}
						else{
							//得到按顺序排列的0，1值的list，把需要双人授权的验证的数组取出来
							var dual_auth_accounts = html.split(',');
							for(var i = 0,len = dual_auth_accounts.length;i<len;i++){
								if(dual_auth_accounts[i]==1){
									sg.models.batch_servers[i].dual_auth = true;
									sg.models.batch_need_dual_auth.push(sg.models.batch_servers[i]);
								}
							}	
						}
						switch(params.type){
						case "tui":
							sg.batch_service.tui_start(params);
                                                        console.log('fuck');
							break;
						case "gui":
							sg.batch_service.gui_start(params);
							break;
						case "file":
							sg.batch_service.file_start(params);
							break;
						default:
							break;
						}
						//显示需要双人授权的服务
						if(sg.models.batch_need_dual_auth.length>0){
							var tmpl = $("#template-batch-failed").html();
							$("#content").append(Mustache.to_html(tmpl,sg.models));
							$("#batch-failed").dialog({
								autoOpen:true,
								position:'center',
								width:500,
								modal:true,
								resizable:false,
								close:function(){
									$(this).dialog("destroy").remove();
								}
							});
						}
					}
				}
			});
		},
		get_accounts:function(service){
			var res = {};
			$.ajax({ 
				url:'/qizhi/server_grid_getaccount/?batch='+sg.models.batch_dual_auth.servers.join(",") + "&proto=" + sg.models.batch_proto,
				type:'POST',
				cache:true,
				timeout:sg.config.timeout,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
					alert(textStatus);
					return false;
				},
				success:function(html){
					$("#form-advance-"+service.type).find("table").fadeIn(100);
					//$("#form-advance-"+service.type).find("table").show();
					if(html!="0"){
						try{
							res = $.parseJSON(html);
							// res = (new Function('return '+html))();
						}
						catch(e){
							res = 0;
							switch(service.type){
							case "tui":
								$('<span id="account_error">'+sg.info.account_error+'</span>').insertAfter($('#form-advance-tui'));
								break;
							case "gui":
								$('<span id="account_error">'+sg.info.account_error+'</span>').insertAfter($('#form-advance-gui'));
								break;
							case "file":
								$('<span id="account_error">'+sg.info.account_error+'</span>').insertAfter($('#form-advance-file'));
								break;
							default:
								break;
							}
						}	
					}
					else{
		                                res=0;
        		                        $('<span id="account_error">'+sg.info.account_none+'</span>').insertAfter($('#form-advance-'+service.type+' table'));
        		                        $("#form-advance-"+service.type).find("table").hide();
					}
					if(res!=0){
						var tmpl = "{{#accounts}}<option value='{{id}}'>{{#mark}}*{{name}}{{/mark}}{{^mark}}&nbsp;{{name}}{{/mark}}</option>{{/accounts}}";
						switch(service.type){
						case "tui":
							$("#form-advance-tui select[name=account]").append(Mustache.to_html(tmpl,res));	
							break;
						case "gui":
							$("#form-advance-gui select[name=account]").append(Mustache.to_html(tmpl,res));	
							break;
						case "file":
							$("#form-advance-file select[name=account]").append(Mustache.to_html(tmpl,res));		
							break;
						default:
							break;
						}
					}
				}
			});
		},
		display_form:function(proto){
			sg.batch_service.check_sess_remark(proto);
			if(proto=="telnet" || proto=="ssh" || proto=="tn5250"){
				sg.views.tui.batch_advance.create(proto);
			}
			else if(proto=="ftp" || proto=="sftp"){
				sg.views.file.batch_advance.create(proto);
			}
			else if(proto!="vnc"){
				sg.views.gui.batch_advance.create(proto);
			}
			else{
				alert(sg.info.batch_not_support);	
				return false;
			}
		},
		init:function(servers,proto,name){
			sg.models.batch_dual_auth = {servers:[],accounts:[],services:[]};
			sg.models.batch_servers = [];
			sg.config.batch_no_account = 0;
			_.map(sg.models.display_data,function(server){
				if(_.include(servers,server.server_id)){
					_.map(server.services,function(service){
						if(service.proto==proto && service.name==name){
							if (!server.account) sg.config.batch_no_account = 1;
							sg.models.batch_dual_auth.servers.push(server.server_id);
							sg.models.batch_dual_auth.accounts.push(server.account);
							sg.models.batch_dual_auth.services.push(service.id);
							sg.models.batch_servers.push({'server':server,'service':service,'dual_auth':false});
						}
					});
				}
			});
			sg.models.batch_proto = proto;
			//validate_sess_remark 双人授权的设备不能批量访问，所以先验证是否要备注，直接显示。
			if(sg.action=="left"){
				if(sg.config.batch_no_account){
					alert(sg.info.batch_no_account);
				}
				else{
					sg.batch_service.validate_dual_auth(proto);
				}
			}
			else{
				sg.batch_service.check_sess_remark(proto);
				sg.batch_service.display_form(proto);
			}
		},
		form_start:function(type){
			switch(type){
			case "tui":
				var sess_remark = '',
				    proto = $("#form-advance-tui input[name=proto]").val(),
				    account = $("#form-advance-tui select[name=account]").val(),
				    resolution = $("#form-advance-tui select[name=resolution]").val(),
                                    bg_color = $("#form-advance-tui select[name=bg_color]").val();

				if(!account){
					alert(sg.info.account);
					return false;
				}
				if(sg.config.show_sess_remark){
					sess_remark = $.trim($("#form-advance-tui textarea[name=sess_remark]").val());
				}
				var params = {
					type:type,
					account:account,
					proto:proto,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					resolution:resolution,
					bg_color: bg_color,
					dual_auth:0,
					dual_auth_login:false,
					dual_auth_password:false
				};
				//console.log(account);console.log(params.account);
				break;
			case "gui":
				var sess_remark = '',
				    account = $("#form-advance-gui select[name=account]").val(),
				    proto = $("#form-advance-gui input[name=proto]").val(),
				    rdp_console = $("#console_sel").attr("checked") ? 1 : 0,
				    rdp_mstsc = ($("#mstsc_sel").attr("checked") && (proto=="rdp" || proto=="rdpapp")) ? 1 : 0,
				    http_default = $("#http_default_sel").attr("checked") ? 1 : 0,
				    disk_list = [],
				    resolution = $("#form-advance-gui select[name=resolution]").val();
				if(!account){
					alert(sg.info.account);
					return false;
				}
				if(sg.config.show_sess_remark){
					sess_remark = $.trim($("#form-advance-gui textarea[name=sess_remark]").val());
				}
				var ckbarr=document.getElementById('tr_rdp_disk').getElementsByTagName('input');
				for(i=0;i<ckbarr.length;i++){
					if(ckbarr[i].name='disk_sel[]' && ckbarr[i].checked){
						disk_list.push(ckbarr[i].value);
					}
				}
				disk = disk_list.join(",");
				if (proto == "rdpapp" && resolution == "seamless") resolution = "seamless" + screen.width + "x" + screen.height;
				var params = {
					form_start:true,
					type:type,
					proto:proto,
					account:account,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					resolution:resolution,
					mstsc:rdp_mstsc,
					rdp_console:rdp_console,
					http_default:http_default,
					disk:disk
				};
				break;
			case "file":
				var sess_remark = '',
				    account = $("#form-advance-file select[name=account]").val();
				if(!account){
					alert(sg.info.account);
					return false;
				}
				if(sg.config.show_sess_remark){
					sess_remark = $.trim($("#form-advance-file textarea[name=sess_remark]").val());
				}
				var params = {
					type:type,
					account:account,
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark
				};	
				break;
			default:
				break;
			}
			sg.batch_service.validate_dual_auth_advance(params);
		},
		start:function(proto,sess_remark){
			if(proto=="telnet" || proto=="ssh" || proto=="tn5250"){
				resolution = "80x24";
				if(sg.config.tui_default) resolution = sg.config.tui_default;
				var params = {
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					dual_auth:0,
					dual_auth_login:false,
					dual_auth_password:false,
					resolution:resolution,
					proto:proto
				};
				sg.batch_service.tui_start(params);
                                console.log('fuck');
			}
			else if(proto=="ftp" || proto=="sftp"){
				var params = {
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					dual_auth:0,
					dual_auth_login:false,
					dual_auth_password:false
				};
				sg.batch_service.file_start(params);
			}
			else{
				var resolution,mstsc,params;
				mstsc = (sg.config.gui_client == "mstsc" && (proto=="rdpapp" || proto=="rdp")) ? 1 : 0;
				resolution = "1024x768";
				if(sg.config.gui_default) resolution = sg.config.gui_default;
				params = {
					worksheet:sg.config.worksheet,
					sess_remark:sess_remark,
					dual_auth:0,
					dual_auth_login:false,
					dual_auth_password:false,
					resolution:resolution,
					mstsc:mstsc
				};
				sg.batch_service.gui_start(params);
			}
		},
		tui_start:function(params){
			var param = params;
			var i = 0;
			var arr = [];
			if (sg.config.tui_client == 'jterm'){
				alert(sg.info.batch_not_jterm);
				return;
			}

			_.each(sg.models.batch_servers,function(batch_server){
				if(!batch_server.dual_auth){
					param.server = batch_server.server.server_id;
					if(!params.advance) param.account = batch_server.server.account;
					param.service = batch_server.service.id;

					if($.os.name === 'win'/* && sg.config.tui_client != 'jterm'*/){
						sg.single_service.tui_start(param, true);
                                                console.log('fuck');
						p = $.extend(true, {}, param);
						p['app'] = sg.config.tui_client;
						if(param.proto == "tn5250"){
							p['app'] = 'pcomm';
						}
						arr.push(p);
					}
					else{
						sg.single_service.tui_start(param);
                                                console.log('fuck');
					}
				}
			});
			if($.os.name === 'win' && sg.config.tui_client != 'jterm'){
				sg.mask.show();
				$.ajax({
					url:sg.config.batch_url + '?type=tui',
					type:'POST',
					cache:false,
					timeout:sg.config.timeout,
					data:{data: arr},
					success:function(html){
						sg.mask.hide();
						window.location.href = "shterm://" + html + '#' + document.location.hostname;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						sg.mask.hide();
						textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
						alert(textStatus);
						return false;
					}
				});
			}

			/*var interval = setInterval(function(){
				if(i >= sg.models.batch_servers.length){
					clearInterval(interval);	
				}
				else{
					var batch_server = sg.models.batch_servers[i];
					if(!batch_server.dual_auth){
						param.server = batch_server.server.server_id;
						if(!params.advance) param.account = batch_server.server.account;
						param.service = batch_server.service.id;
						sg.single_service.tui_start(param);
                                                console.log('fuck');
					}
					i++;
				}
			},50);*/
		},
		gui_start:function(params){
			var param = params, full_resolution = false;
			var arr = [];
			_.each(sg.models.batch_servers,function(batches){
				if(!batches.dual_auth){
					full_resolution = false;
					param.server = batches.server.server_id;
					if(!params.advance) param.account = batches.server.account;
					param.service = batches.service.id;
					if (batches.service.proto == "rdpapp" && !param.form_start) {
						if (batches.service.options.remoteapp){
							resolution = "seamless" + screen.width + "x" + screen.height;
							param.mstsc = 1;
						}
						else if (batches.service.options.seamless=='defseam') {
							if(param.resolution.indexOf('direct')<0){
								resolution = "direct" + param.resolution;
							}
						}
						else if(batches.service.options.seamless!='defseam' && !param.mstsc) resolution = "seamless"+screen.width+'x'+screen.height;
						else if(param.resolution=="fullscreen") resolution = "direct" + screen.width + "x" + screen.height;
						else resolution = "direct" + param.resolution;

						if(resolution)param.resolution = resolution;
					}	
					else{
						if(param.resolution=="fullscreen"){
							full_resolution = screen.width + "x" + screen.height;
						}
					}
					if(full_resolution){
						param.full_resolution = full_resolution;
					}
					if(batches.service.proto=="rdp" && !param.form_start) param.rdp_console = batches.service.options.rdp_console && rdp_console_default_by_person;
					if($.os.name === 'win'){
						sg.single_service.gui_start(param, true);
						p = $.extend(true, {}, param);
						p['app'] = 'GuiViewer';
						if(p.mstsc) p['app'] = 'mstsc';
						arr.push(p);
					}
					else{
						sg.single_service.gui_start(param);
					}
				}
			});
			if($.os.name === 'win'){
				sg.mask.show();
				$.ajax({
					url:sg.config.batch_url + '?type=gui',
					type:'POST',
					cache:false,
					timeout:sg.config.timeout,
					data:{data: arr},
					success:function(html){
						sg.mask.hide();
						window.location.href = "shterm://" + html + '#' + document.location.hostname;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						sg.mask.hide();
						textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
						alert(textStatus);
						return false;
					}
				});
			}
		},
		file_start:function(params){
			var param = params;
			var arr = [];
			_.each(sg.models.batch_servers,function(batches){
				if(!batches.dual_auth){
					param.server = batches.server.server_id;
					if(!params.advance) param.account = batches.server.account;
					param.service = batches.service.id;
					if($.os.name === 'win'){
						sg.single_service.file_start(param, true);
						p = $.extend(true, {}, param);
						p['app'] = 'filezilla';
						arr.push(p);
					}
					else{
						sg.single_service.file_start(param);
					}
				}
			});	
			if($.os.name === 'win'){
				sg.mask.show();
				$.ajax({
					url:sg.config.batch_url + '?type=file',
					type:'POST',
					cache:false,
					timeout:sg.config.timeout,
					data:{data: arr},
					success:function(html){
						sg.mask.hide();
						window.location.href = "shterm://" + html + '#' + document.location.hostname;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						sg.mask.hide();
						textStatus = textStatus == "timeout" ? sg.info.timeout : sg.info.error_404;
						alert(textStatus);
						return false;
					}
				});
			}

		}
	},
	//服务启动器
	shterm_loader:{

        RunClient : function(app, p){
            if(p.type.toLowerCase() != app) return false;
            console.log('starting ');
            if($.os.name === 'win'){
                var params = $.parseJSON(p.options);
                params['app'] = app;
                params['ver'] = client_version;
                params['url'] = window.location.host;
                ShtermClient.runShtermApp(JSON.stringify(params));
            }else{
                if(app === "guiviewer"){
                    ShtermClient.applet.loadJavaArchive("GuiViewer.jar", "GuiViewer", p.options);
                }else{
                    if(app === 'pcomm') app = 'pcsws';
                    ShtermClient.applet.execApplication(app, p.options);
                }
            }
        },
		run:function(p){
		    var app = p.type.toLowerCase();
            sg.shterm_loader.RunClient(app, p);    
		}
	},
	mask:{
		show:function(){
			if($.browser.msie && $.browser.version<8){
				var bsw,bsh,bool = $('html').attr("xmlns");
				if(bool){
				     bsw = document.documentElement.clientWidth;
				     bsh = document.documentElement.clientHeight-6;
				     if($.browser.msie) bsh -=2;
				}
				else{
				     bsw = document.body.clientWidth;
				     bsh = document.body.clientHeight;
				}
				$("#mask").css({"position":"absolute","width":bsw,"height":bsh}).bgiframe().show().find("div").css("position","absolute").find("img").hide();
			}
			else{
				$("#mask").show();
			}
		},
		hide:function(){
			$("#mask").hide();
		}
	},
	bind_event:function(){
		sg.controls.tr_on();
		sg.controls.li_on();
		sg.controls.th_on();
		sg.controls.check_all();
		sg.controls.left_on();
		sg.controls.right_on();
		sg.controls.filter_on();
		sg.controls.batch_on();
		sg.controls.get_disks();
	},
	//初始化
	init:function(){
		var p = {
			server_grid_filter: (sg.config.worksheet>0 ? 'other' : sg.config.server_grid_filter),
			worksheet:sg.config.worksheet,
			pagesize: sg.config.pagesize,
			pageindex: sg.config.pageindex,
			linlin_ip_list: $("#hid_ip_list").val()
		};
		sg.mask.show();	
		$.ajax({
			url:sg.config.url,
			type:'POST',
			data:p,
			success:function(html){
				sg.controls.load_data(html);
				if(sg.config.query_type=='bypage'){
					sg.views.table.create();
				}
				else{
					sg.controls.filter();
				}
			}
		});
	},
    createPluginDom : function(){
        if($.os.name === 'win'){
            sg.bind_event();
        }else{    
            ShtermClient.createJavaApplet();
        }    
    }   
}
