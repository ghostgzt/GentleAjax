<?php
/*==========Function Begin=============*/
require_once("functions.php");
/*==========Function End=============*/
$name=@base64_decode(str_replace(" ","+",@$_GET["name"]));
$pageurl=@base64_decode(str_replace(" ","+",@$_GET["pageurl"]));
$ajax=@$_GET["ajax"];
if (PATH_SEPARATOR == ':') {
	$charset="utf-8";
}else{
	$charset="gbk";
}
header("Content-type: text/html; charset=$charset");
if($pageurl&&$name){
	ignore_user_abort(1);
	@mkdir("ExHentai");
	@mkdir("ExHentai/$name");
	@mkdir("ExHentai/$name/out");
	$path="ExHentai/$name/out";
	$cs=0;
	$lcs=0;
	$r=false;
	$nlcode=0;
	if(!$ajax){
		ob_start();		
		echo '<title>Picture Sizer - ExHentai</title>'.$style.'<div>Picture Sizer - '.$pageurl.'<span style="float:right;right:0;"><a target="_blank" href="/gftp.php?op=viewframe&file=config.php&folder='.rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name))).'">Config</a></span></div><hr><div id="main">Log Start';		
		echo str_pad(' ', 4096);
		ob_flush();
		flush();		
	}
	$d=scandir($path);
	foreach($d as $key){
		if(strstr($key,@end(@explode("/",$pageurl)))){
			if(!$ajax){	
				$ofile=$key;
				$outfile="$path/$ofile";
				die("<br>->$key Existed!<br>->Done! <br>Log End</div><hr><a ".'onmouseover="pics.over(this);" onmouseout="pics.out(this);"'." href=\"$outfile\">".$ofile."</a>".'&nbsp<a target="_blank" href="/gftp.php?op=viewframe&file='.rawurlencode((PATH_SEPARATOR == ':')?@end(@explode("/",$outfile)):encode_iconv("gbk","utf-8",@end(@explode("/",$outfile)))).'&folder='.rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name.'/out'):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name.'/out'))).'">Preview</a>'."&nbsp<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name.'/out'):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name.'/out')))."\">Manage</a>");	
			}else{
				die($key);
			}			
		}
	}
	while(!$r&&($cs<(count($imgproxy)+1))){
		$snlcode=0;
		$snlcode=$nlcode;
		$skey=getimgurl($pageurl.($nlcode?"?nl=$nlcode":""));
		$url=$skey["imgpath"];
		if(!$ajax){		
			vardump($url);		
			vardump($skey["nlcode"]);	
			echo str_pad(' ', 4096);
			ob_flush();
			flush();		
		}
		$ofile=@end(@explode(($nlcode?"=":"/"),$url));	
		(substr($ofile,0,strlen("image.php"))=="image.php")&&$ofile=@end(@explode("=",$ofile));
		$outfile="$path/".@reset(@explode(".",$ofile))."_".@end(@explode("/",$pageurl)).".".@end(@explode(".",$ofile));		
		$nlcode=0;	
		$nlcode=$skey["nlcode"];
		if(!@file_exists($outfile)||!@filesize($outfile)){
			$gg=$lcs?1:0;//$lcs为true本地ip带nlcode尝试1次,$lcs为false不带nlcode尝试2次
			while(!$r&&$gg<2){
				if(!@file_exists($outfile)||!@filesize($outfile)){	
					if($cs){
						$iproxy=$imgproxy[$cs-1];
						vardump($iproxy);
						file_put_contents("ExHentai/$name/proxy.log",date("Y-m-d H:i:s",time())." $pageurl->[$iproxy]$url".PHP_EOL,FILE_APPEND);
					}
					file_exists("ExHentai/$name/config.php")&&@include("ExHentai/$name/config.php");
					if($url&&($url!="http://st.exhentai.net/img/509s.gif")){
						$r=picresize($url,$imgmaxwidth,$imgmaxheight,$imgquality,@end(@explode(".",$ofile)),$outfile,($cs?$iproxy:null),$imgtruepic);
					}
					!$r&&file_put_contents("ExHentai/$name/errors.log",date("Y-m-d H:i:s",time())." $pageurl->[$snlcode]$url".PHP_EOL,FILE_APPEND);	
					if(($cs&&$r)||($lcs&&!$cs&&$r)){
						file_put_contents("ExHentai/$name/nlcode.log",date("Y-m-d H:i:s",time())." $pageurl->[$snlcode]$url".PHP_EOL,FILE_APPEND);
					}
					if($cs==0){
						$gg++;
					}else{
						$gg=2;
					}
				}else{
					$r=true;
				}
			}
		}else{
			$r=true;
		}
		if(!$r&&!$ajax){
			vardump("Failure! cs:$cs lcs:$lcs");
			echo str_pad(' ', 4096);
			ob_flush();
			flush();
		}
		if($lcs){
			$cs++;
		}else{
			$lcs=1;
		}
	}
	if(!$ajax){	
		ob_end_clean();
	}
	!$r&&file_put_contents("ExHentai/$name/errors.log",date("Y-m-d H:i:s",time())." $pageurl->[Cancle]".PHP_EOL,FILE_APPEND);
	if($ajax&&!$r){
		die(header("HTTP/1.1 404 Not Found"));
	}
	if(!$ajax){	
		$r?die("<br>->Done! <br>Log End</div><hr><a ".'onmouseover="pics.over(this);" onmouseout="pics.out(this);"'." href=\"$outfile\">".((PATH_SEPARATOR == ':')?@end(@explode("/",$outfile)):encode_iconv("gbk","utf-8",@end(@explode("/",$outfile))))."</a>".'&nbsp<a target="_blank" href="/gftp.php?op=viewframe&file='.rawurlencode((PATH_SEPARATOR == ':')?@end(@explode("/",$outfile)):encode_iconv("gbk","utf-8",@end(@explode("/",$outfile)))).'&folder='.rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name.'/out'):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name.'/out'))).'">Preview</a>'."&nbsp<a target=\"_blank\" href=\"/gftp.php?op=home&folder=".rawurlencode((PATH_SEPARATOR == ':')?realpath('ExHentai/'.$name.'/out'):encode_iconv("gbk","utf-8",realpath('ExHentai/'.$name.'/out')))."\">Manage</a>"):die("<br>->Failure! ".((PATH_SEPARATOR == ':')?$path."/".@end(@explode("/",$outfile)):encode_iconv("gbk","utf-8",$path."/".@end(@explode("/",$outfile))))."<br>Log End</div><hr><a href=\"javascript:void(0);\" onclick=\"window.location.reload();\">Continue</a>");	
	}else{
		die(((PATH_SEPARATOR == ':')?@end(@explode("/",$outfile)):encode_iconv("gbk","utf-8",@end(@explode("/",$outfile)))));
	}
}
?>