var ShtermClient = {
	opentip : false,
    createJavaApplet : function(){
        var dom = '<APPLET style="_display:none;" id="app" archive="/java/AppletLoader.jar" code="com.shterm.loader.Loader.class" width=0 height=0 MAYSCRIPT>';
        dom += '<PARAM NAME="onInit" VALUE="_init"/>';
        dom += '<PARAM NAME="onClose" VALUE="_close"/>';                                      
        dom += '</APPLET>';
        $('#shterm-applet').html(dom);
        this.applet = document.getElementById('app') || {};
    },
    getCookie : function(name){
        if(document.cookie.length > 0){
            var start = document.cookie.indexOf(name + '=');
            if(start != -1){
                start = start + name.length + 1;
                var end = document.cookie.indexOf(";", start);
                if(end == -1) end = document.cookie.length;
                return unescape(document.cookie.substring(start, end));
            }
        }
        return "";
    },
    runShtermApp : function(json){
        var me = this;
        $.post('/qizhi/inflate',{data:json},function(response){
            if(response.match('windows')){
                var finalCnt = response.replace(';windows','');
                var url = 'shterm://'+response;
            }else{
                var url = 'qizhissh://'+response;
            }
            
            window.location.href = url;
        });
    }
}
