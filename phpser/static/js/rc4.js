function rc4(e,g){var f=[],b=0,a,d="";for(var c=0;c<256;c++){f[c]=c}for(c=0;c<256;c++){b=(b+f[c]+e.charCodeAt(c%e.length))%256;a=f[c];f[c]=f[b];f[b]=a}c=0;b=0;for(var h=0;h<g.length;h++){c=(c+1)%256;b=(b+f[c])%256;a=f[c];f[c]=f[b];f[b]=a;d+=String.fromCharCode(g.charCodeAt(h)^f[(f[c]+f[b])%256])}return d}function toHex(c){var b="";for(var a=0;a<c.length;a++){b+=""+((c.charCodeAt(a).toString(16)).length==1?"0"+c.charCodeAt(a).toString(16):c.charCodeAt(a).toString(16))}return b}var rc4_uuid=(function(a,b){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()}})(/[xy]/g,function(d){var b=Math.random()*16|0,a=d=="x"?b:(b&3|8);return a.toString(16)});