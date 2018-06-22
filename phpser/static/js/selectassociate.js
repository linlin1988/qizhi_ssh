var locale_assoc = shterm.assoc[locale];
(function($) {
	$.initDialog = function(p){		
		// apply default properties
		p = $.extend({
				tabFlag:false,
				outFlag:false,
				outShow:'none',
				outEntityValue:'none',
				outValue:'none',
				outCount:'none',
				domain:'none',
				loadpath:'../resources/jquery/plugin-selectassociate/loadinfo.48.gif',
				pagesize:pagesize_config/2,
				data:'../include/get_members.php',
				target:'../include/set_members.php',
				hoverclass:'selectassociatehover',
				linkimage:'../resources/jquery/plugin-selectassociate/linked.png',
				identity_status:'true',
				//文字说明定义部分
				btn_add_text:locale_assoc.btn_add_text,
				btn_del_text:locale_assoc.btn_del_text,
				btn_close_text:locale_assoc.btn_close_text,
				btn_assoc:locale_assoc.btn_assoc,
				btn_unassoc:locale_assoc.btn_unassoc,
				status_assoc:locale_assoc.status_assoc,
				status_added:locale_assoc.status_added,
				status_unassoc:locale_assoc.status_unassoc,
				status_unadd:locale_assoc.status_unadd,
				nomsg:locale_assoc.nomsg,
				errormsg:locale_assoc.errormsg,
				selectmsg:locale_assoc.selectmsg,	
				servermsg:locale_assoc.servermsg,
				del_ident_msg:locale_assoc.del_ident_msg,
				del_srv_msg:locale_assoc.del_srv_msg,
				refreshmsg:locale_assoc.refreshmsg,
				page_total:sprintf(locale_assoc.page_total,"&nbsp;<span id='page_total'></span>&nbsp;"),
				page_one:locale_assoc.page_one,
				page_all:locale_assoc.page_all,
				status:locale_assoc.status,
				status_both:locale_assoc.status_both,
				procmsg:locale_assoc.procmsg,
				successmsg:locale_assoc.successmsg,
				th_login:locale_assoc.th_login,
				th_name:locale_assoc.th_name,
				th_depart:locale_assoc.th_depart,
				th_all:locale_assoc.th_all,
				th_server:locale_assoc.th_server,
				th_ipaddr:locale_assoc.th_ipaddr,
				th_systype:locale_assoc.th_systype,
				th_izone:locale_assoc.th_izone,
				th_szone:locale_assoc.th_szone,
				th_account:locale_assoc.th_account,
				th_service:locale_assoc.th_service,
				th_service_servers:locale_assoc.th_service_servers,
				th_filter:locale_assoc.th_filter,
				th_accurate:locale_assoc.th_accurate,
				btn_filter:locale_assoc.btn_filter,
				assoc_server_disabled:locale_assoc.sel_server_disabled,
				init:{'title':['选择用户:访问控制组'],'type_relation_id':['1'],'type_relation':['equipaccess'],'type':['identity'],'page':[1],'filter':['none']}
		  }, p);	 
		 //主要方法
		 var tbody={
		 	//初始化，隐藏和显示相关内容
		 	init:function(){
		 				$('#loadinfo').show();
						$('button').hide();
						$('#shterm-tool').hide();
						$('#submitinfo').hide();
						$('#tb_'+p.init.type[0]).hide();
						$('#tb_'+p.init.type[0]).find('tr').slice(1).remove();
		 	},
			showbtn:function(){
					var checkvalue=$('#filter_left').find(':radio[checked]').val();
					$('#sel_all').uncheck();
					switch(checkvalue){
						case '0':
							if(p.outFlag){
                                                                $('button:contains("'+p.btn_del_text+'")').show();
                                                                $('button:contains("'+p.btn_add_text+'")').show();
                                                                $('button:contains("'+p.btn_close_text+'")').show();
							}
							else{
								$('button').show();
							}
							break;
						case '1':
							if(p.outFlag){
								$('button:contains("'+p.btn_del_text+'")').show();
								$('button:contains("'+p.btn_add_text+'")').hide();
								$('button:contains("'+p.btn_close_text+'")').show();
							}
							else{
								$('button:eq(0)').hide();
								$('button:eq(1)').show();
								$('button:eq(2)').show();
							}
							break;
						case '2':
							if(p.outFlag){
								$('button:contains("'+p.btn_del_text+'")').hide();
								$('button:contains("'+p.btn_add_text+'")').show();
								$('button:contains("'+p.btn_close_text+'")').show();
							}
							else{
								$('button:eq(0)').show();
								$('button:eq(1)').hide();
								$('button:eq(2)').show();
							}
							break;
						default:
							break;
					}
			},
			checksel:function(){
				var num=0;
				var totalnum=0;
				$('#tb_'+p.init.type[0]).find('tr').slice(1).each(
					function(){
						totalnum++;
						if($(this).find('td:eq(0)').find(':checkbox').attr('checked')){
							num++;
						}
					}
				);
				if(num==totalnum){
					$('#sel_all').check();
				}
				else{
					$('#sel_all').uncheck();
				}
			},
		 	//ajax查询，为table添加tr
		 	addData:function(isinit,type){
		 		var dataurl='';
		 		if(isinit){
					dataurl=p.data+'?type='+p.init.type[0]+'&type_relation='+p.init.type_relation[0]+'&type_relation_id='+p.init.type_relation_id[0];
					if(p.init.filter[0] && p.init.filter[0]!='none'){
						dataurl+='&filter='+p.init.filter[0];
					}
					dataurl+='&checked=0&page='+p.init.page[0];
					$('#hidden_dataurl').val(dataurl);
					if(p.outFlag){
						$('button:contains("'+p.btn_add_text+'")').show();
						$('button:contains("'+p.btn_del_text+'")').show();
						$('button:contains("'+p.btn_close_text+'")').show();
					}
		 		}
		 		else{
		 			dataurl=$('#hidden_dataurl').val();
					/* 切换状态，过滤，和翻页时修改需要提交的URL
					switch(p.init.type[0]){
						case 'identity_zone':
						case 'server_zone':
							filterreg=new RegExp(".*");
							break;
						case 'server':
							filterreg=new RegExp("((^(\\d|[a-zA-Z]|[^ -~]|[.]|[_]|[-])+(([.]|[_]|[-])|(\\d|[a-zA-Z]|[^ -~]))*$)|(^([_]|[.]|[-])$))");
							break;
					}
					*/
		 			switch(type){
		 				case 'status':
		 					var ischeck=$('#filter_left').find(':radio[checked]').val();
		 					if(dataurl.indexOf('&checked=')>0){
		 						var urlarr=dataurl.split('&checked=');
		 						var checkarr='';
		 						if(urlarr[1].indexOf('&')>0){
		 							checkarr=urlarr[1].substr(urlarr[1].indexOf('&'));
		 						}
		 						dataurl=urlarr[0]+'&checked='+ischeck+checkarr;
		 					}
		 					else{
			 					dataurl+='&checked='+ischeck;
		 					}
							var showpage=$('#shterm-page').val();
		 					if(dataurl.indexOf('&page=')>0){
		 						var urlarr=dataurl.split('&page=');
		 						var pagearr='';
		 						if(urlarr[1].indexOf('&')>0){
		 							pagearr=urlarr[1].substr(urlarr[1].indexOf('&'));
		 						}
		 						dataurl=urlarr[0]+'&page=1'+pagearr;
		 					}
		 					else{
			 					dataurl+='&page=1';
		 					}
		 					break;
		 				case 'filter':
							var showpage=$('#shterm-page').val();
							if(dataurl.indexOf('&page=')>0){
								var urlarr=dataurl.split('&page=');
								var pagearr='';
								if(urlarr[1].indexOf('&')>0){
									pagearr=urlarr[1].substr(urlarr[1].indexOf('&'));
								}
								dataurl=urlarr[0]+'&page=1'+pagearr;
							}
							else{
								dataurl+='&page=1';
							}
		 					break;
						case 'page':
							var showpage=$('#shterm-page').val();
							if(dataurl.indexOf('&page=')>0){
								var urlarr=dataurl.split('&page=');
								var pagearr='';
								if(urlarr[1].indexOf('&')>0){
									pagearr=urlarr[1].substr(urlarr[1].indexOf('&'));
								}
								dataurl=urlarr[0]+'&page='+showpage+pagearr;
							}
							else{
								dataurl+='&page=1';
							}
		 					break;
		 				default:
		 					break;
		 			}
					$('#hidden_dataurl').val(dataurl);
		 		}
				var pz = $("#page_size").val();
				var params={ids:selectIdArray,identity_status:p.identity_status,pagesize:pz};
				if(p.identity_all){params.identity_all=p.identity_all;}
				if(p.service_server_id){params={ids:selectIdArray,service_server_id:p.service_server_id,identity_status:p.identity_status,pagesize:pz}}
				if(p.identity_notemp)params.identity_notemp=true;
                                if(p.show_server_all)params.show_server_all=p.show_server_all;
				if(p.batch) params.batch = true;
				var accurate = $("#ck_accurate").attr("checked");
				if(accurate) params.accurate = true;
				else params.accurate = false;
				var server_enable = $("#assoc_enable").attr("checked");
				if(server_enable) params.server_enable = 1;
				else params.server_enable = 0;
				var keyword=$.trim($('#filter_'+p.init.type[0]).val());
                                //keyword=keyword.replace(/[?]/g,'_').replace(/[？]/g,'_');
				params.filter = keyword;
				if(p.fixed_filter){params.fixed_filter=p.fixed_filter;params.fixed_column=p.fixed_column;params.fixed_type=p.fixed_type}
		 		$.ajax({
							url:dataurl,
							type:'POST',
							data:params,
							cache:false,
							success:function(html){
								var res = $.parseJSON(html);
								if(res.fatalError){
									alert(res.fatalError);
								}else if(res.total!=0){
									var items=Number(res.total);
									var pi=Number(res.page);
									var pz = Number($("#page_size").val());
									var pages = '1';
									if(pz>0)pages=''+(items+pz-1)/pz+'';
									if(pages.indexOf('.')>=0){
										pages=pages.substr(0,pages.indexOf('.'));
									}
									$('#page_total').text(pages);
									$("#shterm-page").empty();
									for(var pp=1;pp<=pages;pp++){
										var op = $("<option>").attr("value",pp).html(pp);
										$("#shterm-page").append(op);
									}
									$('#shterm-page').val(res.page);
                			                                var pcount = $("#shterm-page option").size();
        	                        		                var pindex = $("#shterm-page").val();
                                                                        $("#shterm-tool span ul.pages").remove();
	                                                		$("#shterm-page").pager({pagetext_id:'pt_'+p.init.type[0],pageindex:pindex,pagecount:pcount,paged:associatepagerchange});
									for(var i=0;i<res.rows.length;i++){
										//行循环
										var cls=i%2+1,
										    tdtr=$('<tr id="'+i+'" class="w'+cls+'"></tr>'),
										    isSelText=p.status_assoc,
										    disabled = '',
										    td_class='';
										if(p.outFlag){
											isSelText=p.status_added;
										}
                                                                                if(res.rows[i].forbidden || res.rows[i].disabled){
                                                                                        td_class=" class='warning' ";
                                                                                        disabled = 'disabled';
                                                                                }
                                                                                if(res.rows[i].ck=='1'){
                                                                                        tdtr.append('<td nowrap="nowrap"><input type="checkbox" old="1" value="'+res.rows[i].id+'" /><span>'+isSelText+'</span></td>');
                                                                                }else{
                                                                                        tdtr.append('<td nowrap="nowrap"><input type="checkbox" old="0" value="'+res.rows[i].id+'" ' + disabled + ' /><span></span></td>');
                                                                                }
										for(var j=0;j<res.rows[i].cells.length;j++){
											//每行的cells循环
											if(j<1)	tdtr.append('<td nowrap="nowrap" '+td_class+'>'+res.rows[i].cells[j]+'</td>');
											else tdtr.append('<td '+td_class+'>'+res.rows[i].cells[j]+'</td>');
										}
										$('#tb_'+p.init.type[0]).append(tdtr);
									}
									$('#tb_'+p.init.type[0]).onclass('tr',p.hoverclass,'td');
									$('#tb_'+p.init.type[0]).find('tr').slice(1).each(
										function(){
											$(this).find('td:eq(0)').find(':checkbox').click(
												function(){
													tbody.checksel();
												}	
											);
										}
									);
									tbody.showbtn();
									$('#loadinfo').hide();$('#shterm-tool').show();$('#tb_'+p.init.type[0]).show();
								}
								else{
									tbody.showbtn();
									$('#page_total').text('1');
								        $("#shterm-page").empty();$("#shterm-page").append("<option value='1'>1</option>");
                			                                var pcount = $("#shterm-page option").size();
        	                        	                	var pindex = $("#shterm-page").val();
                                                                        $("#shterm-tool span ul.pages").remove();
	                                        		        $("#shterm-page").pager({pagetext_id:'pt_'+p.init.type[0],pageindex:pindex,pagecount:pcount,paged:associatepagerchange});
									$('#submitinfo').html(p.nomsg).show();$('#shterm-tool').show();$('#loadinfo').hide();
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
									$('#loadinfo').hide();$('#submitinfo').html(p.errormsg).show();
									setTimeout('$("#submitinfo").hide();$("#shterm-tool").show();$("#tb_'+p.init.type[0]+'").show();',1000);
									setTimeout((function(){tbody.showbtn();}),1100);
							}
						});
		 	},
			submits:function(checktype){
				var idarray=new Array();
				$('#tb_'+p.init.type[0]).find('tr').slice(1).each(
					function(){
						if($(this).find('td:eq(0)').find(':checkbox').attr('checked')){
							idarray.push($(this).find('td:eq(0)').find(':checkbox').val());
						}
					}
				);
				if(idarray.length==0){
					alert(p.selectmsg);
					return false;
				}
				$('button').hide();
				$('#loadinfo').show();
				$('#submitinfo').hide();
				$('#shterm-tool').hide();
				$('#tb_'+p.init.type[0]).hide();
				$.ajax({
					url:p.target,
					type:'POST',
					data:{relation:p.init.type_relation[0],relation_id:p.init.type_relation_id[0],type:p.init.type[0],ids:idarray,check:checktype},
					success:function(html){
						done=1;
						if(html=='1'){
							$('#loadinfo').hide();$('#submitinfo').html(p.refreshmsg).show();
							var checkvalue=$('#filter_left').find(':radio[checked]').val();
							$('#sel_all').removeAttr('checked');
							if(checkvalue==0){
								//全部，不刷新页面
								//更改已选行的颜色状态和old值
								$('#tb_'+p.init.type[0]).find('tr').slice(1).each(
									function(){
										if($(this).find('td:eq(0)').find(':checkbox').attr('checked') &&checktype=='2'){
												$(this).find('td:eq(0)').find(':checkbox').attr('old','1').removeAttr('checked').parent().find('span').text(p.status_assoc);
										}
										else if($(this).find('td:eq(0)').find(':checkbox').attr('checked') &&checktype=='1'){
												$(this).find('td:eq(0)').find(':checkbox').attr('old','0').removeAttr('checked').parent().find('span').text('');
										}
									}
								);
								setTimeout('$("#submitinfo").hide();$("#shterm-tool").show();$("#tb_'+p.init.type[0]+'").show();',1000);
								setTimeout((function(){tbody.showbtn();}),1100);
							}
							else{
								//显示已关联的
		 						tbody.init();
		 						tbody.addData(false,'status');
							}
						}
						else if(html=='-1') {
							alert(p.del_ident_msg);
							$('#loadinfo').hide();$('#submitinfo').html(p.del_ident_msg).show();
							setTimeout('$("#submitinfo").hide();$("#shterm-tool").show();$("#tb_'+p.init.type[0]+'").show();',1000);
							setTimeout((function(){tbody.showbtn();}),1100);
						}
						else if(html=='-2') {
							alert(p.del_srv_msg);
							$('#loadinfo').hide();$('#submitinfo').html(p.del_srv_msg).show();
							setTimeout('$("#submitinfo").hide();$("#shterm-tool").show();$("#tb_'+p.init.type[0]+'").show();',1000);
							setTimeout((function(){tbody.showbtn();}),1100);
						}
						else{
							$('#loadinfo').hide();$('#submitinfo').html(p.servermsg).show();
							setTimeout('$("#submitinfo").hide();$("#shterm-tool").show();$("#tb_'+p.init.type[0]+'").show();',1000);
							setTimeout((function(){tbody.showbtn();}),1100);
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) { 
							$('#loadinfo').hide();$('#submitinfo').html(p.errormsg).show();
							setTimeout('$("#submitinfo").hide();$("#shterm-tool").show();$("#tb_'+p.init.type[0]+'").show();',1000);
							setTimeout((function(){tbody.showbtn();}),1100);
					}
				});
			},
			doselect:function(checktype){
				done=1;
				var idarray=[],namearray=[],ckboxes;
				var trs = $('#tb_'+p.init.type[0]+' tr:gt(0)');
				ckboxes = $('#tb_'+p.init.type[0]+' :checkbox:gt(0)');
				ckboxes.each(function(i,n){
					if($(n).attr('checked')){
						idarray.push(n.value);
						namearray.push($(n).parent().next().text());
					}
				});
				if(idarray.length==0){
					alert(p.selectmsg);
					return false;
				}
				//移除对象
				if(!checktype){
					if(selectIdArray.length>0){
						for(var i=0;i<idarray.length;i++){
							for(var j=0;j<selectIdArray.length;j++){
								if(idarray[i]==selectIdArray[j]){
									ckboxes.filter(function(){ return $(this).val()==idarray[i]}).next().text('');			
									selectIdArray.splice(j,1);
									selectNameArray.splice(j,1);
									break;
								}
							}
						}
					}
				}
				//添加对象
				else if(checktype){
					for(var i=0;i<idarray.length;i++){
						if(selectIdArray.length>0){
							var k=-1;
							for(var j=0;j<selectIdArray.length;j++){
								if(idarray[i]==selectIdArray[j]){
									k=i;
									break;
								}
							}
							if(k==-1){
								ckboxes.filter(function(){ return $(this).val()==idarray[i]}).next().text(p.status_added);			
								selectIdArray.push(idarray[i]);
								selectNameArray.push(namearray[i]);
							}
						}
						else{
							ckboxes.filter(function(){ return $(this).val()==idarray[i]}).next().text(p.status_added);			
							selectIdArray.push(idarray[i]);
							selectNameArray.push(namearray[i]);
						}
					}
				}
				$('#sel_all').uncheck();
				$('#tb_'+p.init.type[0]).find('tr').slice(1).each(
					function(){
						$(this).find('td:eq(0)').find(':checkbox').uncheck();
					}
				);
				if(selectIdArray.length>0){
					$(p.outEntityValue).val(selectNameArray.join(','));
					$(p.outValue).val(selectIdArray.join(','));
					var str_show_val='<ol>';
					for(var i=0;i<selectNameArray.length;i++){
						str_show_val+='<li>'+selectNameArray[i]+'</li>';
					}
					str_show_val+='</ol>';
					$(p.outShow).html(str_show_val);
					if(p.outCountSpan && p.outShort){
                        	                var thelen = 0;var str_name='';
                	                        for(var i = 0;i<selectNameArray.length;i++){
        	                                        thelen += selectNameArray[i].length;
	                                                if(thelen<=40) {
                                        	                str_name+=selectNameArray[i];
                                	                        if(i!=selectNameArray.length-1)str_name+='、';
                        	                        }
                	                                else {str_name+=" ...... ";break;}
        	                                }
	                                        $(p.outShort).text(str_name);
						$(p.outCountSpan).hide();
					}
					else{$(p.outCount).text(selectIdArray.length);}
				}
				else{	
					$(p.outEntityValue).val("");
					$(p.outValue).val("");
					$(p.outShow).html("");
					$(p.outCountSpan).show();
					if(p.outCountSpan && p.outShort){
						$(p.outShort).text('');
					}
					else{
						$(p.outCount).text(0);
					}
				}	
				var checkvalue=$('#filter_left').find(':radio[checked]').val();
				if(checkvalue!=0){
					tbody.init();
					tbody.addData(false,'status');
				}
			}
		 };
		 /* 根据初始化参数生成html元素 */
		var showdialog={
			single:function(){
					/* 单一选项的情况 */
					var outdiv_height=450;
					if(select_associate_bsh<550)outdiv_height=300;
					var table_div = outdiv_height-30;
					var container=$("<div id='shterm-dialog' title='"+p.init.title[0]+"'></div>");
					var out_div = $("<div style='height:"+outdiv_height+"px;overflow:hidden;'></div>");
					var isadd=p.status_assoc;
					var noadd=p.status_unassoc;
					if(p.outFlag){
						isadd=p.status_added;
						noadd=p.status_unadd;
					}
					if(p.domain!='none'){
						/* 有域名树的情况，暂时不做 */
					}
					else{
						/* 没有域名树的情况 */
						var tooldiv=$("<div id='shterm-tool'><span style='display:block;float:right;'>"+p.page_total+"<select id='shterm-page'><option value='1'>1</option></select> <select id='page_size' style='vertical-align:middle;margin-right:28px;'><option value='10'>"+sprintf(p.page_one,'10')+"</option><option value='15'>"+sprintf(p.page_one,'15')+"</option><option value='30'>"+sprintf(p.page_one,'30')+"</option><option value='50'>"+sprintf(p.page_one,'50')+"</option><option value='100'>"+sprintf(p.page_one,'100')+"</option><option value='0'>"+p.page_all+"</option></select></span></div>");
						var fl_left=$("<span id='filter_left' style='display:block'>"+p.status+" : <input style='cursor:pointer;' type='radio' name='status_"+p.init.type[0]+"' value='0' checked='true' /><span style='cursor:pointer;' onclick='previousSibling.click();'>"+p.status_both+"</span><input style='cursor:pointer;' type='radio' name='status_"+p.init.type[0]+"' value='1' /><span style='cursor:pointer;' onclick='previousSibling.click();' >"+isadd+"</span><input style='cursor:pointer;' type='radio' name='status_"+p.init.type[0]+"' value='2' /><span style='cursor:pointer;' onclick='previousSibling.click();'>"+noadd+"</span></span>");
						var loadinfo=$("<div id='loadinfo' style='text-align:center;margin:180px auto;'><img src='"+p.loadpath+"' /><br />"+p.procmsg+"</div>");
						var submitinfo=$("<div id='submitinfo' style='text-align:center;margin:190px auto;'>"+p.successmsg+"</div>");
						var tb_width = 850;
						if($.browser.msie && $.browser.version > 6 && $.browser.version < 9) tb_width = 840;
						var tb_div = $("<div id='dialog_table_div' style='width:" + tb_width + "px;height:"+table_div+"px;overflow:auto;'></div>");
						var tb=$("<table id='tb_"+p.init.type[0]+"' class='tab1' style='width:97%;'></table>");
						var thtr=$("<tr></tr>");
						var filterarray=new Array();
						/* 定义表头 */
						switch(p.init.type[0]){
							case 'identity':
							case 'authorize_identities':
							case 'confirm_identities':
								thtr.append("<th nowrap='nowrap'><input type='checkbox' id='sel_all'/>"+p.th_all+"</th><th nowrap='nowrap'>"+p.th_login+"</th><th nowrap='nowrap'>"+p.th_name+"</th><th>"+p.th_depart+"</th>");
								//filterarray.push('登录名;login');
								//filterarray.push('姓名;name');
								//filterarray.push('部门;department');
								break;
							case 'identity_zone':
								thtr.append("<th><input type='checkbox'  id='sel_all'/>"+p.th_all+"</th><th>"+p.th_izone+"</th><th>"+p.th_depart+"</th>");
								break;
							case 'server':
								thtr.append("<th><input type='checkbox'  id='sel_all'/>"+p.th_all+"</th><th>"+p.th_server+"</th><th>"+p.th_ipaddr+"</th><th>"+p.th_systype+"</th><th>"+p.th_depart+"</th>");
								//filterarray.push('设备名;name');
								//filterarray.push('IP地址;ipaddr');
								break;
							case 'server_zone':
								thtr.append("<th><input type='checkbox'  id='sel_all'/>"+p.th_all+"</th><th>"+p.th_szone+"</th><th>"+p.th_depart+"</th>");
								break;
							case 'account':
								thtr.append("<th><input type='checkbox'  id='sel_all'/>"+p.th_all+"</th><th>"+p.th_account+"</th>");
								break;
							case 'service':
								thtr.append("<th><input type='checkbox' id='sel_all'/>"+p.th_all+"</th><th>"+p.th_service+"</th><th>"+p.th_service_servers+"</th>");
								break;
							case 'domain':
								thtr.append("<th><input type='checkbox'  id='sel_all'/>"+p.th_all+"</th><th>"+p.th_depart+"</th>");
							default:
								break;
						}
						var filterdiv='';
						fl_left.append(" <span>"+p.th_filter+" : </span> <input id='filter_"+p.init.type[0]+"' type='text' style='width:90px;' /> <input type='checkbox' id='ck_accurate' /><span class='ml5 cp' onclick='previousSibling.click();'>"+p.th_accurate+"</span><input type='button' id='btn_filter_sa' value='"+p.btn_filter+"' style='display:none;' />");
						if(p.init.type[0]=='server')
						fl_left.append("<input class='ml5' type='checkbox' id='assoc_enable' value='1' /><span class='ml5 cp' onclick='previousSibling.click();'>"+p.assoc_server_disabled+"</span>");
						tb.append(thtr);
						tb.hide();
						submitinfo.hide();
						tooldiv.append(fl_left);
						tb_div.append(tb);
						out_div.append(loadinfo).append(tooldiv).append(tb_div).append(submitinfo).append('<input type="hidden" id="hidden_dataurl"/>');
						container.append(out_div);
						$('body').append(container);
						$("#ck_accurate").click(function(){
							tbody.init();
							tbody.addData(false,'filter');
						});
						$("#assoc_enable").click(function(){
							tbody.init();
							tbody.addData(false,'filter');
						});
						$('#page_size').val(p.pagesize);
						$('#page_size').change(
							function(){
								$("#shterm-page").val(1);
								tbody.init();
								tbody.addData(false,'page');
							}
						);
						/* 绑定翻页事件 */
						$('#shterm-page').change(
							function(){
								tbody.init();
								tbody.addData(false,'page');
							}
						);
						/* 绑定状态切换事件 */
						$(':radio[name=status_'+p.init.type[0]+']').click(
							function(){
								tbody.init();
								tbody.addData(false,'status');
							}
						);
						/* 绑定全选事件 */
						$('#sel_all').change(function(){
							if(this.checked){
								$('#tb_'+p.init.type[0]).find('tr').each(
									function(){
										if(!$(this).find('td:eq(1)').hasClass("warning"))
											$(this).find('td:eq(0)').find(':checkbox').check();
									}
								);
							}
							else{
								$('#tb_'+p.init.type[0]).find('tr').each(
									function(){
										$(this).find('td:eq(0)').find(':checkbox').uncheck();
									}
								);
							}
						});
						$('#btn_filter_sa').click(function(){tbody.init();tbody.addData(false,'filter')});
						/* 文本框按回车则查询 */
						$('#filter_'+p.init.type[0]).keyup(
							function(e){
								if(e.keyCode==13){
									tbody.init();
									tbody.addData(false,'filter');
								}
							}
						);
						/* 弹出模态对话框 AJAX加载数据 */
						if(!p.outFlag){
							$("#shterm-dialog").dialog({
								autoOpen:true,
								position:'top',
								width:880,
								modal:true,
								resizable:false,
								open:function(){
									/* 调用ajax方法读取数据 */
									tbody.init();
									tbody.addData(true);
								},
								close:function(){
									$(this).dialog("destroy");
									$(this).remove(); 
									if(done==1){
										done=0;
										if(!!p.refresh_url){
											location.href=p.refresh_url;
										}
										else history.go(0);
									}
								},
								buttons:[
                                                                        {
										text:p.btn_assoc,
										click:function() {
                                                                                	tbody.submits(2);
	                                                                        }
									},
									{
										text:p.btn_unassoc,
										click:function(){
											tbody.submits(1);
										}
									},
                                                                        {
										text:p.btn_close_text,
										click:function(){
	                                                                                $(this).dialog("destroy");
        	                                                                        $(this).remove();
                	                                                                if(done==1){
                        	                                                                done=0;
												if(!!p.refresh_url){
													location.href=p.refresh_url;
												}
                                                        	                                else history.go(0);
	                                                                                }
										}
                                                                        }
								]
							});
						}
						else{
							//将outValue的值传入数组
							if($.trim($(p.outValue).val())==''){
								selectIdArray=new Array();
								selectNameArray=new Array();
							}
							else{
								selectIdArray = $(p.outValue).val().split(',');
								selectNameArray = $(p.outEntityValue).val().split(',');
							}
							$("#shterm-dialog").dialog({
								autoOpen:true,
								position:'top',
								width:880,
								modal:true,
								resizable:false,
								open:function(){
									/* 调用ajax方法读取数据 */
									tbody.init();
									tbody.addData(true);
								},
								close:function(){
									$(this).dialog("destroy");
									$(this).remove();
									if(p.closed && done=='1'){
										done=0;
										eval(''+p.closed+'');
									}
									else if(p.beforeclose && done=='1'){
										done=0;
                                                                                p.beforeclose(p.outValue,p.data,p.loadpath);
									}
									else{done=0;}
								},
								buttons: [
									{
                                                                        	text:p.btn_add_text,
										click:function() {
                                                                                	tbody.doselect(true);
	                                                                        }
									},
									{
										text:p.btn_del_text,
										click:function(){
											tbody.doselect(false);
										}
									},
									{
	                                                                        text:p.btn_close_text,
										click:function(){
                                                                                	$(this).dialog("destroy");
	                                                                                $(this).remove();
        	                                                                        if(p.closed && done=='1'){
                	                                                                        done=0;
                        	                                                                eval(''+p.closed+'');
                                	                                                }
                                        	                                        else if(p.beforeclose && done=='1'){
                                                	                                        done=0;
                                                        	                                p.beforeclose(p.outValue,p.data,p.loadpath);
                                                                	                }
	                                                                                else{done=0;}
        	                                                                }
									}
								]
							});
						}
					}
			},
			multiple:function(){
				//多个TAB形式
			}
		}
		if(!p.tabFlag){
			showdialog.single();
		}
		else{
			showdialog.multiple();
		}
	}	  		

	$.selectassociate = function(p) {
			$.initDialog(p);
	};
	
	// provide backwards compability
	$.SelectAssociate = $.Selectassociate = $.selectAssociate = $.selectassociate;
	
})(jQuery);
var done=0;
var selectIdArray=new Array();
var selectNameArray=new Array();
//var filterreg=new RegExp("((^(\\d|[a-zA-Z]|[^ -~])+(([.]|[_]|[-])|(\\d|[a-zA-Z]|[^ -~]))*$)|(^([_]|[.]|[-])$))");
function associatepagerchange(page){
                $("#shterm-page").val(page);
                $("#shterm-page").change();
}
