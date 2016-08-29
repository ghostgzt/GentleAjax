var ajaxurl='ajax.php';
//var ajaxurl='<?php echo "http://".$_SERVER["HTTP_HOST"].$_SERVER["SCRIPT_NAME"];?>';
var lastScript;
var b = new Base64();
var run=0;
var timeout=30000;
function CrossScript(url, method, element, fn, encode, cache, match, errfn, xajaxurl) {
if(xajaxurl){ajaxurl=xajaxurl;}
var src=ajaxurl+'?ajax_get_el=' + b.encode(element) + '&ajax_get_url=' + b.encode(url) + (method?('&method=' + b.encode(arrayToJson(method))):'') + (encode?('&encode=' + b.encode(encode)):'') + (match?('&match=' + b.encode(match)):'') + (cache?('&cache='+cache):'') ;
MainScript(src,element,fn,errfn);
return src;
}
function MainScript(src,element,fn,errfn){
try{
	var h = document.getElementsByTagName("head")[0];
	var f = document.createElement("script");
	var k = (new Date).valueOf();
	run=k;
	if(errfn){setTimeout('if((run!=0)&&(((new Date).valueOf())-timeout>run)){eval(\''+errfn+'\')}',timeout);}
	f.type = "text/javascript";
	f.id = b.encode(getxdate(0));
	f.src = src ;
	h.appendChild(f);
	f.onload = f.onreadystatechange = function() {
		if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
			run=0;
			eval(element + '=getdata(' + element + ');');
			eval(fn);
		}
		f.onload = f.onreadystatechange = null;
	}
	if (lastScript && getels(lastScript)) getels(lastScript).parentNode.removeChild(getels(lastScript));
	}catch(e){
	if(errfn){
	eval(errfn);
	}
	}
	lastScript = f.id;	
	return lastScript;
}
function getmatchtext(url,match,replace,element,fn,encode,cache,method,errfn){
var xmatch;
xmatch=b.encode(arrayToJson(match))+'|'+b.encode(arrayToJson(replace));
getmatcharray(url,xmatch,2,element,fn,encode,cache,method,errfn);
}
function getmatcharray(url,match,type,element,fn,encode,cache,method,errfn){
var gz='';
gz=b.encode(match)+'|'+type;
CrossScript(url,method,element,fn,encode,cache,gz,errfn);
}
function getfile(url, referrer, type, method, cache, kzm, xajaxurl) {
if(xajaxurl){ajaxurl=xajaxurl;}
	var data = '';
	//var d = b.encode(getxdate(cache));
	if (method) {
		data = arrayToJson(method);
	} else {
		data = '["get",0,0,"' + referrer + '",0,"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31",["X-Requested-With:XMLHttpRequest"]]';
	}
	return ajaxurl+'?ajax_get_url=' + b.encode(url) + '&method=' + b.encode(data) + (type?('&type=' + b.encode(type)):'') + (cache?('&cache='+cache):'') + (kzm?('&kzm=' + kzm):'');
}
function readfile(path,element,fn,encode,errfn,xajaxurl){
if(xajaxurl){ajaxurl=xajaxurl;}
var op='readfile';
var src=ajaxurl+'?op='+op+'&ajax_get_el=' +b.encode(element) + '&path=' + path + (encode?('&encode=' + b.encode(encode)):'') ;
MainScript(src,element,fn,errfn);
return src;
}
function savefile(path,contents,element,fn,encode,errfn,xajaxurl){
if(xajaxurl){ajaxurl=xajaxurl;}
var op='savefile';
var src=ajaxurl+'?op='+op+'&ajax_get_el=' +b.encode(element) + '&path=' + path + '&contents=' + b.encode(contents) + (encode?('&encode=' + b.encode(encode)):'') ;
MainScript(src,element,fn,errfn);
return src;
}
function delfile(path,element,fn,errfn,xajaxurl){
if(xajaxurl){ajaxurl=xajaxurl;}
var op='delfile';
var src=ajaxurl+'?op='+op+'&ajax_get_el=' +b.encode(element) + '&path=' +path  ;
MainScript(src,element,fn,errfn);
return src;
}
function checkfile(path,element,fn,errfn,xajaxurl){
if(xajaxurl){ajaxurl=xajaxurl;}
var op='checkfile';
var src=ajaxurl+'?op='+op+'&ajax_get_el=' +b.encode(element) + '&path=' + path  ;
MainScript(src,element,fn,errfn);
return src;
}
function clearall(element,fn,errfn,xajaxurl){
if(xajaxurl){ajaxurl=xajaxurl;}
var op='clearall';
var src=ajaxurl+'?op='+op+'&ajax_get_el=' +b.encode(element)   ;
MainScript(src,element,fn,errfn);
return src;
}
function shell(contents,element,fn,encode,errfn,xajaxurl){
if(xajaxurl){ajaxurl=xajaxurl;}
var op='shell';
var src=ajaxurl+'?op='+op+'&ajax_get_el=' +b.encode(element) + '&contents=' + b.encode(contents) + (encode?('&encode=' + b.encode(encode)):'') ;
MainScript(src,element,fn,errfn);
return src;
}
function setmethod(method,postdata,cookie,referer,proxy,agent,mshead){
var ms = new Array();
				ms[0] = method;
				ms[1] = postdata;
				ms[2] = cookie;
				ms[3] = referer;
				ms[4] = proxy;
				ms[5] = agent;
				ms[6] = mshead;
return ms;
}
function jspost(URL, PARAMS, TARGET) {      
    var temp = document.createElement("form");      
    temp.action = URL;     
	temp.target = TARGET;	
    temp.method = "post";      
    temp.style.display = "none";      
    for (var x in PARAMS) {      
        var opt = document.createElement("textarea");      
        opt.name = x;      
        opt.value = PARAMS[x];         
        temp.appendChild(opt);      
    }      
    document.body.appendChild(temp);      
    temp.submit(); 
    temp.remove();	
} 
function addels(html,ele,nod){
if(!ele){ele="div"}
if(!nod){nod=document.body}
var zf= document.createElement(ele);
zf.innerHTML=html;
nod.appendChild(zf);
return zf;
}
function clearStorage(name){
var storage = window.localStorage; 
if(name){
storage.removeItem(name);
}else{
storage.clear();
}
}
function getStorage(name){ 
try{
		 var storage = window.localStorage; 
            if(storage.getItem(name)){ 
			var t=storage.getItem(name).split('\|');
			if(t[0]>((new Date).valueOf())){

				return b.decode(t[1]);
				}else{
				storage.removeItem(name);
				return '';
				}
            }else{
			    return '';
			}
			}catch(e){}
} 
function setStorage(name,value,time,init){ 
try{
             var storage = window.localStorage; 
            if (storage) { 
			try{
			if(init){storage.clear();}
           storage.setItem(name, (((new Date).valueOf())+(time*1000))+'|'+b.encode(value)); 
		   }catch(e){}
           return true
        }else{return false} 
		}catch(e){}
} 
function arrayToJson(o) {
	var r = [];
	if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
	if (typeof o == "object") {
		if (!o.sort) {
			for (var i in o) r.push(i + ":" + arrayToJson(o[i]));
			if ( !! document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
				r.push("toString:" + o.toString.toString());
			}
			r = "{" + r.join() + "}";
		} else {
			for (var i = 0; i < o.length; i++) {
				r.push(arrayToJson(o[i]));
			}
			r = "[" + r.join() + "]";
		}
		return r;
	}
	return o.toString();
}
function getels(x,y,z) {
	if(!y){y=document}
switch(z){
case 0:
return y.getElementById(x);
break;
case 1:
return y.getElementById(x);
break;
break;
case 2:
return y.getElementsByName(x);
break;
break;
case 3:
return y.getElementsByClassName(x);
break;
break;
case 4:
return y.getElementsByTagName(x);
break;
break;
default:
return y.getElementById(x);
break;
break;
}		
}
/*urlencode | urldecode*/
var LittleUrl = {
	encode: function(string) {
		return escape(this._utf8_encode(string)).replace(/\//ig,"%2F");
	},
	decode: function(string) {
		return this._utf8_decode(unescape(string));
	},
	_utf8_encode: function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	_utf8_decode: function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}
function Base64() {

	// private property
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// public method for encoding
	this.encode = function(input) {
	    input=(input+" ").trim();
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}

	// public method for decoding
	this.decode = function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}

	// private method for UTF-8 encoding
	_utf8_encode = function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	// private method for UTF-8 decoding
	_utf8_decode = function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}
function getdata(odata) {
	var b = new Base64();
	return b.decode(odata);
}
function getAbsPoint(e, type) {
	var x = e.offsetLeft,
	y = e.offsetTop;
	while (e = e.offsetParent) {
		x += e.offsetLeft;
		y += e.offsetTop;
	}
	if (type == 'x') {
		return x;
	}
	if (type == 'y') {
		return y;
	}
	if (!type) {
		return [x, y];
	}
}
function getCookie(name) {
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null) {
		return unescape(arr[2])
	}
	return ''
}
function setCookie(name, value, n) {
	var expdate = new Date;
	expdate.setTime(expdate.getTime() + n * 1000);
	document.cookie = name + ("=" + escape(value) + ";expires=" + expdate.toGMTString() + ";path=/;")
}
function delCookie(name){
	var expdate = new Date;
	expdate.setTime(expdate.getTime() - (3600 * 24 * 1000));
	document.cookie = name + ("=" + escape('') + ";expires=" + expdate.toGMTString() + ";path=/;")
}
function getimgsrc(htmlstr) {
	var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
	var arr = [];
	while (tem = reg.exec(htmlstr)) {
		arr.push(tem[2]);
	}
	alert(arr);
	return arr;
}
function screensnpt(data) {
	document.writeln(data);
	var gct = getimgsrc(data.replace(/http\:\/\//ig, '<img src="http://').replace(/\.jpg/ig, '.jpg">'));
	alert(gct.length);
	for (var i = 1; i < gct.length; i++) {
		document.writeln('<img src="' + gct[i] + '"/><br/>');
	}
}

Date.prototype.format = function(format){ 
var o = { 
"y+" : this.getYear(), //year 
"M+" : this.getMonth()+1, //month 
"d+" : this.getDate(), //day 
"h+" : this.getHours(), //hour 
"m+" : this.getMinutes(), //minute 
"s+" : this.getSeconds(), //second 
"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
"S" : this.getMilliseconds() //millisecond 
} 

if(/(y+)/.test(format)) { 
format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
} 

for(var k in o) { 
if(new RegExp("("+ k +")").test(format)) { 
format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
} 
} 
return format; 
}
function getPgjs(){
        var agent = navigator.userAgent.toLowerCase();
        var res = agent.match(/android/);
        if(res == "android")
            return res;
        res = agent.match(/iphone/);
        if(res == "iphone")
            return "ios";
        res = agent.match(/ipad/);
        if(res == "ipad")
            return "ios";
        res = agent.match(/windows/);
        if(res == "windows")
            return "wp";
        return "pc";
}
function getxdate(type){
var fstr;
switch(type){
case 0://all
fstr="yyyy-MM-dd hh:mm:ss";
break;
case 1://min
fstr="yyyy-MM-dd hh:mm";
break;
case 2://hour
fstr="yyyy-MM-dd hh";
break;
case 3://day
fstr="yyyy-MM-dd";
break;
case 4://mon
fstr="yyyy-MM";
break;
case 4://year
fstr="yyyy";
break;
default:
return false;
break;
}
var now = new Date(); 
var nowStr = now.format(fstr);
return nowStr;
}
function getele(nod, cs, type) {
/*
XML
0 s s
1 n n
2 n s
3 s n
*/
	try {
		if ((type == 1 || type == 2) && (type)) {
			var xnod = nod;
		} else {
			var xnod = (new DOMParser()).parseFromString(nod, "text/xml");
		}
		var s = cs.split('\.');
		for (var i = 0; i < s.length; i++) {
			if ((type == 1 || type == 3) && (i == s.length - 1)) {
				return xnod.getElementsByTagName(s[i]);
			} else {
				xnod = xnod.getElementsByTagName(s[i])[0];
			}
		}
		return xnod.childNodes[0].nodeValue;
	} catch(e) {
		return '';
	}
}
/*
// A simple call - myXML is a string containing your XML:  myJsonObject=xml2json.parser(myXML);    
// A 2:nd, optional, parameter is "tags not to convert" - for example <b> and <i>:  myJsonObject=xml2json.parser(myXML,'b,i');    
// A 3:rd, optional, parameter gives us a string showing us the JSON structure   
// instead of the actual JSON object: 
myString=xml2json.parser(myXML,'','html');    
// - use "compact" for output without linebreaks or tabbing  
// - use "normal" for output with linebreaks and tabbing  
// - use "html" for a html representation
*/
xml2json={
	parser:function(xmlcode,ignoretags,debug){
		if(!ignoretags){ignoretags=""};
		xmlcode=xmlcode.replace(/\s*\/>/g,'/>');
		xmlcode=xmlcode.replace(/<\?[^>]*>/g,"").replace(/<\![^>]*>/g,"");
		if (!ignoretags.sort){ignoretags=ignoretags.split(",")};
		var x=this.no_fast_endings(xmlcode);
		x=this.attris_to_tags(x);
		x=escape(x);
		x=x.split("%3C").join("<").split("%3E").join(">").split("%3D").join("=").split("%22").join("\"");
		for (var i=0;i<ignoretags.length;i++){
			x=x.replace(new RegExp("<"+ignoretags[i]+">","g"),"*$**"+ignoretags[i]+"**$*");
			x=x.replace(new RegExp("</"+ignoretags[i]+">","g"),"*$***"+ignoretags[i]+"**$*")
		};
		x='<JSONTAGWRAPPER>'+x+'</JSONTAGWRAPPER>';
		this.xmlobject={};
		var y=this.xml_to_object(x).jsontagwrapper;
		if(debug){y=this.show_json_structure(y,debug)};
		return y
	},
	xml_to_object:function(xmlcode){
		var x=xmlcode.replace(/<\//g,"?");
		x=x.split("<");
		var y=[];
		var level=0;
		var opentags=[];
		for (var i=1;i<x.length;i++){
			var tagname=x[i].split(">")[0];
			opentags.push(tagname);
			level++
			y.push(level+"<"+x[i].split("?")[0]);
			while(x[i].indexOf("?"+opentags[opentags.length-1]+">")>=0){level--;opentags.pop()}
		};
		var oldniva=-1;
		var objname="this.xmlobject";
		for (var i=0;i<y.length;i++){
			var preeval="";
			var niva=y[i].split("<")[0];
			var tagnamn=y[i].split("<")[1].split(">")[0];
			tagnamn=tagnamn.toLowerCase();
			var rest=y[i].split(">")[1];
			if(niva<=oldniva){
				var tabort=oldniva-niva+1;
				for (var j=0;j<tabort;j++){objname=objname.substring(0,objname.lastIndexOf("."))}
			};
			objname+="."+tagnamn;
			var pobject=objname.substring(0,objname.lastIndexOf("."));
			if (eval("typeof "+pobject) != "object"){preeval+=pobject+"={value:"+pobject+"};\n"};
			var objlast=objname.substring(objname.lastIndexOf(".")+1);
			var already=false;
			for (k in eval(pobject)){if(k==objlast){already=true}};
			var onlywhites=true;
			for(var s=0;s<rest.length;s+=3){
				if(rest.charAt(s)!="%"){onlywhites=false}
			};
			if (rest!="" && !onlywhites){
				if(rest/1!=rest){
					rest="'"+rest.replace(/\'/g,"\\'")+"'";
					rest=rest.replace(/\*\$\*\*\*/g,"</");
					rest=rest.replace(/\*\$\*\*/g,"<");
					rest=rest.replace(/\*\*\$\*/g,">")
				}
			} 
			else {rest="{}"};
			if(rest.charAt(0)=="'"){rest='unescape('+rest+')'};
			if (already && !eval(objname+".sort")){preeval+=objname+"=["+objname+"];\n"};
			var before="=";after="";
			if (already){before=".push(";after=")"};
			var toeval=preeval+objname+before+rest+after;
			eval(toeval);
			if(eval(objname+".sort")){objname+="["+eval(objname+".length-1")+"]"};
			oldniva=niva
		};
		return this.xmlobject
	},
	show_json_structure:function(obj,debug,l){
		var x='';
		if (obj.sort){x+="[\n"} else {x+="{\n"};
		for (var i in obj){
			if (!obj.sort){x+=i+":"};
			if (typeof obj[i] == "object"){
				x+=this.show_json_structure(obj[i],false,1)
			}
			else {
				if(typeof obj[i]=="function"){
					var v=obj[i]+"";
					//v=v.replace(/\t/g,"");
					x+=v
				}
				else if(typeof obj[i]!="string"){x+=obj[i]+",\n"}
				else {x+="'"+obj[i].replace(/\'/g,"\\'").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r")+"',\n"}
			}
		};
		if (obj.sort){x+="],\n"} else {x+="},\n"};
		if (!l){
			x=x.substring(0,x.lastIndexOf(","));
			x=x.replace(new RegExp(",\n}","g"),"\n}");
			x=x.replace(new RegExp(",\n]","g"),"\n]");
			var y=x.split("\n");x="";
			var lvl=0;
			for (var i=0;i<y.length;i++){
				if(y[i].indexOf("}")>=0 || y[i].indexOf("]")>=0){lvl--};
				tabs="";for(var j=0;j<lvl;j++){tabs+="\t"};
				x+=tabs+y[i]+"\n";
				if(y[i].indexOf("{")>=0 || y[i].indexOf("[")>=0){lvl++}
			};
			if(debug=="html"){
				x=x.replace(/</g,"&lt;").replace(/>/g,"&gt;");
				x=x.replace(/\n/g,"<BR>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
			};
			if (debug=="compact"){x=x.replace(/\n/g,"").replace(/\t/g,"")}
		};
		return x
	},
	no_fast_endings:function(x){
		x=x.split("/>");
		for (var i=1;i<x.length;i++){
			var t=x[i-1].substring(x[i-1].lastIndexOf("<")+1).split(" ")[0];
			x[i]="></"+t+">"+x[i]
		}	;
		x=x.join("");
		return x
	},
	attris_to_tags: function(x){
		var d=' ="\''.split("");
		x=x.split(">");
		for (var i=0;i<x.length;i++){
			var temp=x[i].split("<");
			for (var r=0;r<4;r++){temp[0]=temp[0].replace(new RegExp(d[r],"g"),"_jsonconvtemp"+r+"_")};
			if(temp[1]){
				temp[1]=temp[1].replace(/'/g,'"');
				temp[1]=temp[1].split('"');
				for (var j=1;j<temp[1].length;j+=2){
					for (var r=0;r<4;r++){temp[1][j]=temp[1][j].replace(new RegExp(d[r],"g"),"_jsonconvtemp"+r+"_")}
				};
				temp[1]=temp[1].join('"')
			};
			x[i]=temp.join("<")
		};
		x=x.join(">");
		x=x.replace(/ ([^=]*)=([^ |>]*)/g,"><$1>$2</$1");
		x=x.replace(/>"/g,">").replace(/"</g,"<");
		for (var r=0;r<4;r++){x=x.replace(new RegExp("_jsonconvtemp"+r+"_","g"),d[r])}	;
		return x
	}
};
function HTMLEncode(html)
{
var temp = document.createElement ('div');
(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
var output = temp.innerHTML;
temp = null;
return output;
}
function HTMLDecode(text)
{
var temp = document.createElement('div');
temp.innerHTML = text;
var output = temp.innerText || temp.textContent;
temp = null;
return output;
}

function loadXMLDoc(url, type, data, code, encoding) {
	var xmlhttp = null;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else{
		if (window.ActiveXObject) {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	if (xmlhttp != null) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					eval(code);
				} else {
					alert('Problem retrieving XML data:' + xmlhttp.statusText);
				}
			}
		}
		xmlhttp.open(type, url, true);
		xmlhttp.overrideMimeType("text/html;charset=" + encoding);
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.send(data);
	} else {
		alert('Your browser does not support XMLHTTP.');
	}
}	
/*QueryString*/
  //获取QueryString的数组

     function getQueryString(){

         var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));

         for(var i = 0; i < result.length; i++){

              result[i] = result[i].substring(1);

         }

         return result;

     }

     //根据QueryString参数名称获取值

     function getQueryStringByName(name){

         var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));

         if(result == null || result.length < 1){

              return "";

         }

         return result[1];

     }

     //根据QueryString参数索引获取值

     function getQueryStringByIndex(index){

         if(index == null){

              return "";

         }

         var queryStringList = getQueryString();

         if (index >= queryStringList.length){

              return "";

         }

         var result = queryStringList[index];

         var startIndex = result.indexOf("=") + 1;

         result = result.substring(startIndex);

         return result;

     }
	 
  //绑定当控件高亮选中时，点击“回车键”时执行的操作

     //control：要绑定事件的控件

     //func：要执行的方法

     function bindEnterEvent(control, func){

         control.onkeypress = function(){

              if (event.keyCode == 13){

                   func();

              }

         }

     }
/*QueryString*/
/*md5*/				
var hexcase=0;function hex_md5(a){ if(a=="") return a; return rstr2hex(rstr_md5(str2rstr_utf8(a)))}function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72"}function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}function rstr2hex(c){try{hexcase}catch(g){hexcase=0}var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}return b}function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}return b}function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}return a}function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}return a}function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}return Array(o,n,m,l)}function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}function bit_rol(a,b){return(a<<b)|(a>>>(32-b))};