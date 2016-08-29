<?php
/*==========Function Begin=============*/
require_once("functions.php");
/*==========Function End=============*/
/*==========Project Begin===========*/
if(@$_GET["project"]&&@$_GET["url"]){
	$name=@base64_decode(str_replace(" ","+",@$_GET["project"]));
	$url=$_GET["url"];
	die(strtr(file_get_contents("index.xkz"),array("{{cGallery}}"=>$url,"{{cFolder}}"=>rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name))),"{{cName}}"=>"ExHentai/$name")));
}
/*==========Project End===========*/
/*==========CZip Begin===========*/
if(@$_GET["czip"]){
	$file=@base64_decode(str_replace(" ","+",@$_GET["file"]));
	$path=@base64_decode(str_replace(" ","+",@$_GET["path"]));
	$pathc=(PATH_SEPARATOR == ':')?$path:encode_iconv("gbk","utf-8",$path);
	$isdownload=@base64_decode(str_replace(" ","+",@$_GET["isdownload"]));
	echo '<title>Create Zip - ExHentai</title>'.$style.'<div>Create Zip - '.@end(@explode("/",$file)).'</div><hr><div id="main">';
	if($file&&$path){
		if(file_exists($path)){
			$r=createzip($file,$path,$isdownload);
			$r?die("->".@end(@explode("/",$file)).' ('.fsize(filesize($file)).')'."<br>Done! </div><hr><a href=\"?new=1\">New</a>&nbsp;<a href=\"$file\">Download".'('.fsize(filesize($file)).')'.'</a>&nbsp<a target="_blank" href="/gftp.php?op=viewframe&file='.rawurlencode((PATH_SEPARATOR == ':')?@end(@explode("/",$file)):encode_iconv("gbk","utf-8",@end(@explode("/",$file)))).'&folder='.rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai'):encode_iconv("gbk","utf-8",realpath('ExHentai'))).'">Preview</a>'."&nbsp<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai'):encode_iconv("gbk","utf-8",realpath('ExHentai')))."\">Manage</a>".'&nbsp;<a href="?del=1&path='.base64_encode(dirname($pathc)).'">Delete Folder</a>&nbsp<a href="javascript:void(0);" onclick="history.go(-1);">Back</a></div>'):die("Failure! ".$path.'<hr><a href="?del=1&path='.base64_encode(dirname($path)).'">Delete Folder</a>'."&nbsp<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai'):encode_iconv("gbk","utf-8",realpath('ExHentai')))."\">Manage</a>".'&nbsp;<a href="javascript:void(0);" onclick="history.go(-1);">Back</a></div>');	
		}else{
			die("$path Can Not Found!");
		}	
	}else{
		die("Flag file&path Not Setted!");
	}
}
/*==========CZip End===========*/
/*==========Delete Begin==========*/
if(@$_GET["del"]){
	$file=@base64_decode(str_replace(" ","+",@$_GET["file"]));
	$path=@base64_decode(str_replace(" ","+",@$_GET["path"]));
	if($path){$file=$path;}
	$file=(PATH_SEPARATOR == ':')?$file:encode_iconv("utf-8","gbk",$file);
	echo '<title>Delete File - ExHentai</title>'.$style.'<div>Delete File - '.$file.'</div><hr><div id="main">';
	$r=$path?@destroyDir($file):@unlink($file);
	echo "->$file<br>";
	echo $r?"Have Been Deleted!":"Delete Failured!";
	die("</div><hr>".($path?"<a href=\"?new=1\">New</a>&nbsp;<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai'):encode_iconv("gbk","utf-8",realpath('ExHentai')))."\">Manage</a>".(!$r?"&nbsp;<a href=\"javascript:void(0);\" onclick=\"history.go(-1);\">Back</a>":""):"<a href=\"javascript:void(0);\" onclick=\"history.go(-1);\">Back</a>"));
}
/*==========Delete End===========*/
/*==========LookFiles Begin===========*/
if(@$_GET["lookfile"]){
	$name=@base64_decode(str_replace(" ","+",@$_GET["name"]));
	$namec=(PATH_SEPARATOR == ':')?$name:encode_iconv("gbk","utf-8",$name);
	$lp=@$_GET["lp"];
	$sum=@$_GET["sum"];
	$r=@scandir("ExHentai/$name/out");
	/*if (PATH_SEPARATOR == ':') {
		sort($r,SORT_NUMERIC);
	}else{
		sort($r,SORT_REGULAR);
	}*/
	mysort($r);
	$r=@array_diff($r,array(".",".."));
	echo '<title>Look Files - ExHentai</title><style>.xpic{white-space:nowrap;height:100%;width:220px;border:solid black 10px;-webkit-transition:opacity 0.5s,display 0.5s;display:block;opacity:1;}</style>'.$style.'<div>Look Files - '.$name.'<span style="float:right;right:0;"><a href="?lookfile=1&sum='.$sum.'&name='.base64_encode($name).($lp?'':'&lp=1').'">'.($lp?'List':'Gallery').'</a></span></div><hr><div id="main">'.(file_exists("ExHentai/$name/errors.log")?'Log Errors <a target="_blank" href="ExHentai/'.$name.'/errors.log">errors.log</a>&nbsp;'.'<a href="?del=1&file='.base64_encode("ExHentai/$name/errors.log").'">Delete</a>'.'<br>':'').(file_exists("ExHentai/$name/proxy.log")?'Log Proxy <a target="_blank" href="ExHentai/'.$name.'/proxy.log">proxy.log</a>&nbsp;'.'<a href="?del=1&file='.base64_encode("ExHentai/$name/proxy.log").'">Delete</a>'.'<br>':'').(file_exists("ExHentai/$name/nlcode.log")?'Log Nlcode <a target="_blank" href="ExHentai/'.$name.'/nlcode.log">nlcode.log</a>&nbsp;'.'<a href="?del=1&file='.base64_encode("ExHentai/$name/nlcode.log").'">Delete</a>'.'<br>':'').'Path:ExHentai/'.$name.'/out<br>Files: '.@count($r).($sum?('/'.$sum.' '.@reset(@explode(".",(@count($r)/$sum)*100)))."%":'');
	//echo '<script>setTimeout(function(){window.location.reload();},30000);</script>';
	if($r){
		if($lp){echo '<div id="content" style="margin-left:0px;overflow:auto;"><table><tr>';}
		foreach($r as $key){
		
			$keyc=(PATH_SEPARATOR == ':')?$key:encode_iconv("gbk","utf-8",$key);
			if($lp){
				echo '<td><div class="xpic">-&gt<a target="_blank" title="'.$key.'" href="ExHentai/'.$name.'/out/'.$key.'">'.(strlen($key)<=20?$key:(substr($key,0,20).'...')).'<hr><div align="center" style="width:100%;"><img onmouseover="var s=document.getElementById(\'content\');if(event.clientX>document.documentElement.clientWidth/2){if(parseInt(s.scrollLeft)>-(s.scrollWidth-document.documentElement.clientWidth)){s.scrollLeft=parseInt(s.scrollLeft)+120;}}else{if(parseInt(s.scrollLeft)>0){s.scrollLeft=parseInt(s.scrollLeft)-120;}}" class="ipic" src="ExHentai/'.$name.'/out/'.$key.'"></div></a><hr>-&gt<a href="?del=1&file='.base64_encode("ExHentai/$namec/out/$keyc").'">Delete</a></div></td>';
			}else{
				echo '<br>-&gt<a onmouseover="pics.over(this);" onmouseout="pics.out(this);" target="_blank" href="ExHentai/'.$name.'/out/'.$key.'">'.$key.'</a>&nbsp;<a href="?del=1&file='.base64_encode("ExHentai/$namec/out/$keyc").'">Delete</a>';			
			}
			
		}
		if($lp){echo '</tr></table></div>';}
	}
	if(@count($r)<$sum){
		die("</div><hr><a href=\"?new=1\">New</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"window.location.reload();\">Continue</a>&nbsp<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name.'/out'):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name.'/out')))."\">Manage</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"window.location.reload();\">Refresh".($autonrefreshtime?"(<span id=\"autonrefreshtime\">".$autonrefreshtime."</span>".'<script>refreshser=setInterval(function(){var s=document.getElementById("autonrefreshtime");if(s.innerHTML==0){s.click();}else{s.innerHTML=s.innerHTML-1;}},1000)</script>'."s)</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"clearInterval(refreshser);this.style.display='none';document.getElementById('autonrefreshtime').parentNode.innerHTML='Refresh';\">Stop Time</a>":"</a>")."&nbsp;<a href=\"javascript:void(0);\" onclick=\"history.go(-1);\">Back</a>");
	}else{
		die("</div><hr><a href=\"?new=1\">New</a>".(!(@count($r)<$sum)?"&nbsp;<a href=\"?czip=1&file=".base64_encode("ExHentai/$name.zip")."&path=".base64_encode("ExHentai/$name/out")."\">Create Zip File</a>":"")."&nbsp<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name.'/out'):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name.'/out')))."\">Manage</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"window.location.reload();\">Refresh".($autonrefreshtime?"(<span id=\"autonrefreshtime\">".$autonrefreshtime."</span>".'<script>refreshser=setInterval(function(){var s=document.getElementById("autonrefreshtime");if(s.innerHTML==0){s.click();}else{s.innerHTML=s.innerHTML-1;}},1000)</script>'."s)</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"clearInterval(refreshser);this.style.display='none';document.getElementById('autonrefreshtime').parentNode.innerHTML='Refresh';\">Stop Time</a>":"</a>")."</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"history.go(-1);\">Back</a>");
	}
}
/*==========LookFiles End=============*/
/*==========Setting Begin=============*/
$url=@$_GET["url"]?@$_GET["url"]:"";
$page=@$_GET["page"]?@$_GET["page"]:1;
$nextpage=$page;
/*==========Setting End=============*/
/*===========Action Begin============*/
	set_time_limit(0);
	ob_start();			
	@mkdir("ExHentai");
	preg_match_all('/exhentai\.org\/g\/\d+\/[a-z,0-9]+\//is',$url,$out);
	$out=$out[0];
	if(@$out[0]&&!@$_GET["new"]){
		$url="http://".$out[0];
	}else{
		//die("The URL Is Fake!");
		echo '<title>ExHentai Downloader - ExHentai</title>'.$style.'<div>ExHentai Downloader</div><hr><div id="main">';
		echo 'ExHentai Gallery: <input id="path" name="path" style="width:500px;" type="text" value="'.$url.'">'."&nbsp<a target=\"_blank\" href=\"/gftp.php?op=viewframe&file=config.php&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('./'):encode_iconv("gbk","utf-8",realpath('./')))."\">Config</a>";
		die('</div><hr><a href="javascript:void(0);" onclick="window.open(\'?url=\'+document.getElementById(\'path\').value,\'_self\');">Start</a>'."&nbsp<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai'):encode_iconv("gbk","utf-8",realpath('ExHentai')))."\">Manage</a>".'&nbsp;<a target="_blank" href="http://www.exhentai.org/">ExHentai</a>');
	}
	echo '<title>ExHentai Downloader - ExHentai</title>'.$style.'<script>var sser=setInterval(function(){window.scroll(0,document.body.offsetHeight);},1000);</script><div>ExHentai Downloader - '.$url.'<span style="float:right;right:0;"><span id="actionsum"></span>&nbsp;<a id="quickaction" href="javascript:void(0);" onclick=""></a>&nbsp;<a id="reaction" href="javascript:void(0);" onclick=""></a>&nbsp;<a target="_blank" href="/gftp.php?op=viewframe&file=config.php&folder='.rawurlencode((PATH_SEPARATOR == ':')?realpath('./'):encode_iconv("gbk","utf-8",realpath('./'))).'">Config</a></span></div><hr><div id="main">Log Start';
	vardump("Action $url ");
	echo str_pad(' ', 4096);
	ob_flush();
	flush();		
	//while($nextpage){
		vardump("Page $page");		
        $str=curl($url.(($nextpage>1)?"?p=".($nextpage-1):""),$agent,$proxy,$ref,$cookie,$header,$data);
		$str=$str["result"];
		if (PATH_SEPARATOR != ':') {
			$str=encode_iconv("UTF-8", "GBK", $str);
		}		
		$nextpage=0;		
		$name=cleandz('/\<h1\s*id\=\"gn\"\>(.*?)\<\/h1\>/is',$str,0,1,1);
		$name=strtr($name,array('&amp;'=>'_','&quot;'=>'_','&#039;'=>'_','&lt;'=>'_','&gt;'=>'_','+'=>'-','/'=>'_','\\'=>'_',':'=>'_','*'=>'_','"'=>'_','<'=>'_','>'=>'_','|'=>'_','{'=>'_','}'=>'_','?'=>'_',' '=>'_'));
		if(!$name){
			vardump("Name Is No Found!");
			vardump("$url Failure!");
			die("<br>Log End</div><hr><a href=\"?new=1\">New</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"window.location.reload();\">Reload</a>");
		}
		@mkdir("ExHentai/$name");
		if(!file_exists("ExHentai/$name")){
			$name=urlencode($name);
			@mkdir("ExHentai/$name");
		}
		@copy("config.php","ExHentai/$name/config.php");
		$sum=cleandz('/\<p\ class\=\"ip\"\>Showing\s*(.*?)\s*images\<\/p\>/is',$str,0,1,1);
		$sum=strtr($sum,array("images"=>""," "=>""));
		$sum=@end(@explode("of",$sum));
		$pagesum=ceil(intval($sum)/40);
		vardump("Pages $pagesum");
		if(($pagesum>1)&&($page<$pagesum)){
			$nextpage=$page+1;
		}
		$pages=cleandz('/href\=\"http\:\/\/exhentai\.org\/s\/(.*?)\"/is',$str,0,0,1);
		vardump("Name $name");
		vardump("ForkTime $forktime"."s");
		vardump("ActionTime $actiontime"."s");		
		vardump("Images $sum");		
		//vardump($pages,"<br>->ImagePages\n",1);
		echo str_pad(' ', 4096);
		ob_flush();
		flush();			
		$images=array("ImagesPage"=>array(),"name"=>base64_encode($name),"displayname"=>base64_encode((PATH_SEPARATOR == ':')?$name:encode_iconv("gbk","utf-8",$name)),"pages"=>$pagesum,"sum"=>$sum,"forktime"=>$forktime*1000,"Gallery"=>$url);
		$isi=0;
		foreach($pages as $key){	
			//$skey=getimgurl($key);
			$ckey=/*gethomepath().*/"picsize.php?pageurl=".base64_encode($key)."&name=".base64_encode($name);
			//$igs=$images["images"][]=array("page"=>$key);
			array_push($images["ImagesPage"],array("key"=>$key,"afn"=>base64_encode($key)));
			vardump("ImagePage $key");
			//activefn($ckey,1);
			//xffopen($ckey,1);
			vardump("<span><a href=\"javascript:void(0);\" onclick=\"aaone(this,".$isi.");\">Action</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"this.getElementsByClassName('wait')[0].innerHTML='[0s]';\"><span class=\"wait\"></span></a>&nbsp;<a class='ipage' target='_blank' href='$ckey'>$key</a>&nbsp;<a onmouseover=\"pics.over(this);\" onmouseout=\"pics.out(this);\" target='_blank' class=\"prw\" href=\"\"></a></span>");			
			echo str_pad(' ', 4096);
			ob_flush();
			flush();				
			$isi++;
		}
		if($images["ImagesPage"]){
			$outname="ExHentai/$name/$page.json";
			file_put_contents($outname,json_encode($images));
			vardump("Export <a target='_blank' href='$outname'>$page.json</a>");
			//strtr(file_get_contents("index.xkz"),array("{{cGallery}}"=>$url,"{{cFolder}}"=>rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name)))))
			//file_put_contents("ExHentai/$name/index.html",strtr(file_get_contents("index.xkz"),array("{{cGallery}}"=>$url,"{{cFolder}}"=>rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name))))));
			

			file_put_contents("ExHentai/$name/index.html",'<meta http-equiv="refresh" content="0;url=../../getlist.php?project='.base64_encode($name).'&url='.$url.'">');
			//file_put_contents("ExHentai/$name/index.php",'<?php'.PHP_EOL.'die(strtr(file_get_contents("../../index.xkz"),array("{{cGallery}}"=>"'.$url.'","{{cFolder}}"=>"'.rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name))).'")));');
			!$nextpage&&vardump("Index <a target='_blank' href='"."ExHentai/".urlencode((PATH_SEPARATOR == ':')?$name:encode_iconv("gbk","utf-8",$name))."/'>$name</a>");
		}else{
			//destroyDir("ExHentai/$name");
			vardump("$url  Can Not Found Any Images!".'&nbsp;<a href="?del=1&path='.base64_encode("ExHentai/".urlencode((PATH_SEPARATOR == ':')?$name:encode_iconv("gbk","utf-8",$name))).'">Delete Folder</a>');
			die("</div>");
		}
		vardump("Page $page Done!");
		vardump(($nextpage?"Page $nextpage Go On Afate ".($autonextpagetime?$autonextpagetime."s!":"Press The Button!"):"All Page Done!"));		
		echo str_pad(' ', 4096);
		ob_flush();
		flush();	
		$page++;		
		if(!$nextpage){
			//sleep(5);
			vardump("$url Done!");
		}
	//}
	ob_end_clean();	
	die("<br>Log End</div><hr><a href=\"?new=1\">New</a>".($nextpage?"&nbsp;<a id=\"nextpage\" href=\"?url=$url&page=$nextpage\">Next Page ".($autonextpagetime?" (<span id=\"autonextpagetime\">".$autonextpagetime."</span>".'<script>nextpageser=setInterval(function(){var s=document.getElementById("autonextpagetime");if(s.innerHTML==0){window.open(document.getElementById("nextpage").href,"_self");}else{s.innerHTML=s.innerHTML-1;}},1000)</script>'."s)</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"clearInterval(nextpageser);this.style.display='none';document.getElementById('autonextpagetime').parentNode.innerHTML='Next Page';\">Stop Time</a>":"</a>")."":"").($pagesum>1?"&nbsp;<a href=\"javascript:void(0);\" onclick=\"window.open('?url=$url','_self')\">Reload</a>":"")."&nbsp;<a target=\"_blank\" href=\"?lookfile=1&name=".base64_encode($name)."&sum=".$sum."\">Look Files</a>"."&nbsp<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name)))."\">Manage</a>"."&nbsp;<a href=\"javascript:void(0);\" onclick=\"window.location.reload();\">".($pagesum>1?"Refresh":"Reload")."</a>&nbsp;<a href=\"javascript:void(0);\" onclick=\"history.go(-1);\">Back</a><script>window.scroll(0,document.body.offsetHeight);clearInterval(sser);"
	.'var actionser;
	function actionall(first){
	var timeout='.($forktime*1000).';
	var tto=first?timeout:prompt("Timeout:",timeout);
	if(tto){timeout=tto;
	var ips=document.getElementsByClassName("ipage");
	var t=document.getElementsByClassName("wait");
	for(var i=0;i<t.length;i++){
	t[i].innerHTML="";
	}
	bi=0;
	bk=0;
	actionser&&clearInterval(actionser);
	if(first){
	actionser=setInterval(afn("",timeout),1000);
	}else{
	for(var i=0;i<ips.length;i++){
	bk=1;
	action([ips[i],i],timeout);
	}
	}
	}}
	function afn(c,t){return function(){action(c,t);}}
	function actionone(c,t){
		loaddata(c[0].getAttribute("href")+"&ajax=1", "GET", "",function(r,c){c[0].innerHTML=c[0].innerHTML+" [Success!]";var p=document.getElementsByClassName("prw")[c[1]];p.setAttribute("href","'.'ExHentai/'.$name.'/out/"+r);p.innerHTML="-&gt;"+r+"&lt;-";},t, function(r,c){c[0].innerHTML=c[0].innerHTML+" [Failure!]";var p=document.getElementsByClassName("prw")[c[1]];p.setAttribute("href","");p.innerHTML="";},function(r,c){c[0].innerHTML=c[0].innerHTML+" [Timeout!]";},"",c);
		c[0].innerHTML="->"+c[0].innerHTML;
		var p=document.getElementsByClassName("prw")[c[1]];
		p.setAttribute("href","");
		p.innerHTML="";
	}
	function aaone(c,i){
		var ts=prompt("Timeout:",'.($forktime*1000).');
		if(ts){
			bk=1;
			actionser&&clearInterval(actionser);
			document.getElementById("reaction").innerHTML="ReAction";
			actionone([c.parentNode.getElementsByClassName("ipage")[0],i],ts);
			document.getElementById("actionsum").innerHTML="";	
			var t=document.getElementsByClassName("wait");
			for(var i=0;i<t.length;i++){
				t[i].innerHTML="";
			}
		}
	}		
	function action(c,t){
	var t=document.getElementsByClassName("wait");
	var ips=document.getElementsByClassName("ipage");	
	var cf=0;
	if(!c){
		if(bi>ips.length-1){
		actionser&&clearInterval(actionser);}

		if(!t[bi].innerHTML&&parseInt(t[bi].innerHTML.replace("[","").replace("]",""))!=1){t[bi].innerHTML="'.($actiontime+1).'s";}
		c=[ips[bi],bi];
		cf=1;
		//alert(parseInt(t[bi].innerHTML));
	}
	if(bk&&cf){actionser&&clearInterval(actionser);}
	if(parseInt(t[bi].innerHTML.replace("[","").replace("]",""))>1&&cf){
		t[bi].innerHTML="["+(parseInt(t[bi].innerHTML.replace("[","").replace("]",""))-1)+"s]";


	}else{
	if(cf){	
	t[bi].innerHTML="";
	}
	actionone(c,t);	
	bi++;
	document.getElementById("actionsum").innerHTML=(c[1]+1)+"/"+ips.length;	
	if((c[1]+1)==ips.length){
		document.getElementById("reaction").innerHTML="ReAction";
	}
	}
	}
	function loaddata(url,type,data,code,timeout,errorcode,timeoutcode,encoding,jsback){var xmlhttp=null;if(window.XMLHttpRequest){xmlhttp=new XMLHttpRequest();}else{if(window.ActiveXObject){xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}}if(xmlhttp!=null){xmlhttp.onreadystatechange=function(){try{if(xmlhttp.readyState==4){if((xmlhttp.status>=200&&xmlhttp.status<300)||xmlhttp.status==304){code&&code(this.response,jsback);}else{errorcode&&errorcode(xmlhttp.statusText,jsback);}}}catch(e){}};xmlhttp.open(type,url,true);timeout&&(xmlhttp.timeout=timeout);timeoutcode&&(xmlhttp.ontimeout=function(){timeoutcode&&timeoutcode(this,jsback);});encoding&&xmlhttp.overrideMimeType("text/html;charset="+encoding);xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xmlhttp.send(data);}else{errorcode&&errorcode("Your browser does not support XMLHTTP.");}}
	actionall(1);
	document.getElementById("quickaction").innerHTML="QAction";
	document.getElementById("quickaction").onclick=function(){
		clearInterval(actionser);
		actionall(0);
	}
	document.getElementById("reaction").innerHTML="Stop";
	document.getElementById("reaction").onclick=function(){
		if(this.innerHTML=="Stop"){
			clearInterval(actionser);
			var t=document.getElementsByClassName("wait");
			for(var i=0;i<t.length;i++){
				t[i].innerHTML="";
			}			
			this.innerHTML="ReAction";
		}else{
			this.innerHTML="Stop";
			actionall(1);
		}
	}
	</script>'
	);
/*===========Action End============*/	
		
		
		

		
		
		/*http://exhentai.org/g/755584/2a5ed8791d/?p=7
		/exhentai.org/g/(.*?)//is
		return nl(15858)
		/return\ nl\(\d+\)/is
		<h1 id="gn">[Aquaplus/Leaf] White Album2 + PS3 + Mini after story (EV)</h1>
		/\<h1\s*id\=\"gn\"\>(.*?)\<\/h1\>/is
		of 383 images
		/of\s*(.*?)\s*images/is
		href="http://exhentai.org/s/2f68f4f962/772685-14"
		/href\=\"http\:\/\/exhentai\.org\/s\/(.*?)\"/is
		<img id="img" src="http://23.251.136.67:6556/h/3aa8e3b8a7a15f23ee5308222481860c004ff845-267459-1200-1705-jpg/keystamp=1420273800-e16a08585c/00.jpg"
		/\<img\s*id\=\"img\"\s*src\=\"(.*?)\"/is
		*/		