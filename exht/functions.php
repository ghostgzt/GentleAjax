<?php
error_reporting(0);
require("config.php");
if (PATH_SEPARATOR == ':') {
	$charset="utf-8";
}else{
	$charset="gbk";
}
header("Content-type: text/html; charset=$charset");
function gethomepath(){
	return "http://".$_SERVER["HTTP_HOST"].str_replace('//','/',str_replace($_SERVER['DOCUMENT_ROOT'],'',str_replace('/mnt','',str_replace('\\','/',getcwd())).'/'));
}
function mysort(&$array){
	natsort($array);
	$array=array_values($array);	
}
function cleandz($gz, $html, $full = null, $single = null, $est = null)
{
    @preg_match_all($gz, $html, $match);
    if (!$full) {
        $match = @$match[1];
    }
    @$a = array_unique($match);
    $s = array();
    for ($i = 0; $i < count($match); $i++) {
        if (@$a[$i]) {
            $s[count($s)] = $a[$i];
        }
    }
    if ($s) {
        if ($full) {
            $s = $s[0];
        }
    } else {
        $s = array(
            $gz
        );
    }
    if ($single) {
        $s = $s[0];
    }
    if (($est && ($s == $gz)) || ($est && ($s[0] == $gz) && (count($s) == 1))) {
        return (false);
    }
    return ($s);
}
function curl($url,$agent=null,$proxy=null,$ref=null,$cookie=null,$header=null,$data=null,$timeout=120){
	$ch = curl_init($url);
	//curl_setopt($ch, CURLOPT_FOLLOWLOCATION,true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 返回字符串，而非直接输出
	curl_setopt($ch, CURLOPT_HEADER, 1); // 不返回header部分
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout); // 设置socket连接超时时间
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($ch, CURLOPT_ENCODING, 'gzip');
	if (!empty($agent)) {
		curl_setopt($ch, CURLOPT_USERAGENT, $agent);
	}
	if (!empty($ref)) {
		curl_setopt($ch, CURLOPT_REFERER, $ref); // 设置引用网址
	}
	if (!empty($proxy)) {
		//die($proxy);
		curl_setopt($ch, CURLOPT_PROXY, $proxy);
	}
	if (!empty($header)) {
		$header = explode("\n", str_replace("\r", "", $header));
		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	}
	if (!empty($cookie)) {
		if ($cookie != "*") {
			if (is_array($cookie)) {
				$cookie = str_replace("&", ";", http_build_query($cookie));
			}
			curl_setopt($ch, CURLOPT_COOKIE, $cookie); // 设置引用Cookies
		} else {
			if (!file_exists(ADIR . "/curl_cookie")) {
				file_put_contents(ADIR . "/curl_cookie", "");
			}
			curl_setopt($ch, CURLOPT_COOKIEFILE, realpath(ADIR . "/curl_cookie"));
			curl_setopt($ch, CURLOPT_COOKIEJAR, realpath(ADIR . "/curl_cookie"));
		}
	}
	if (is_null($data) || !$data) {
		// GET
	} else if (is_string($data)) {
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		// POST
	} else if (is_array($data)) {
		// POST
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
	}
	$str = curl_exec($ch);
	$hc  = curl_getinfo($ch);
	if (curl_getinfo($ch, CURLINFO_HTTP_CODE)) {
		$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
		$hdr = substr($str, 0, $headerSize);
		$str = substr($str, $headerSize);
	} else {
		$hdr = "";
	}
	curl_close($ch);
	return array(
		"header" => $hdr,
		"result" => $str,
		"info" => $hc
	);
}
function activefn($url,$timeout){
        $options = array(
            'http' => array(
				'method' =>'GET',
				'timeout' => $timeout
            )
        );
	@file_get_contents($url, false, stream_context_create($options));
}
function xffopen($url,$timeout){
       $ch = curl_init();
       curl_setopt($ch, CURLOPT_URL,$url);
       curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
       curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);   //只需要设置一个秒的数量就可以
       curl_exec($ch);
       curl_close($ch);
}
function fsize($fsize){
    $kb=1024;
	$i=0;
	$dw=array("B","K","M","G","T");
	while($fsize>=$kb&&$i<count($dw)-1){
	$kb=$kb*1024;
	$i++;
	}
	$t = explode(".", ($fsize*1024)/$kb);
	$x = substr($t[1], 0, 2);
	$fsize = $t[0] . (($x) ? ("." . $x) : ("")) . $dw[$i];
    /*if ($fsize > (1024 * 1024 * 1024)) {
        $t = explode(".", $fsize / 1024 / 1024 / 1024);
        $x = substr($t[1], 0, 2);
        $fsize = $t[0] . (($x) ? ("." . $x) : ("")) . "G";
    } else {
        if ($fsize > (1024 * 1024)) {
            $t = explode(".", $fsize / 1024 / 1024);
            $x = substr($t[1], 0, 2);
            $fsize = $t[0] . (($x) ? ("." . $x) : ("")) . "M";
        } else {
            if ($fsize > (1024)) {
                $t = explode(".", $fsize / 1024);
                $x = substr($t[1], 0, 2);
                $fsize = $t[0] . (($x) ? ("." . $x) : ("")) . "K";
            } else {
                $fsize = $fsize . "B";
            }
        }
    }*/
	return $fsize;
}
function getimgurl($imagepageurl){
	global $agent,$proxy,$ref,$cookie,$header,$data;
	$imagepage=curl("http://exhentai.org/s/".$imagepageurl,$agent,$proxy,$ref,$cookie,$header,$data);
	$imagepage=$imagepage["result"];
	$image=cleandz('/\<img\s*id\=\"img\"\s*src\=\"(.*?)\"/is',$imagepage,0,1,1);
	$image=function_exists("htmlspecialchars_decode")?htmlspecialchars_decode($image):$image;
	$nlcode=cleandz('/return\ nl\((.*?)\)/is',$imagepage,0,1,1);
	return array("imgpath"=>$image,"nlcode"=>$nlcode);
}
function vardump($st,$tt="",$pre=0){
	if($pre){
		echo($tt.'<pre>'.PHP_EOL);
	}else{
		echo "\n<br>\n->$tt";
	}
	var_dump($st);
	if($pre){echo('</pre>');}
}
function destroyDir($dir, $virtual = false)
{
    $ds  = DIRECTORY_SEPARATOR;
    $dir = $virtual ? realpath($dir) : $dir;
    $dir = substr($dir, -1) == $ds ? substr($dir, 0, -1) : $dir;
    if (is_dir($dir) && $handle = opendir($dir)) {
        while ($file = readdir($handle)) {
            if ($file == '.' || $file == '..') {
                continue;
            } elseif (is_dir($dir . $ds . $file)) {
                destroyDir($dir . $ds . $file);
            } else {
                unlink($dir . $ds . $file);
            }
        }
        closedir($handle);
        rmdir($dir);
        return true;
    } else {
        return false;
    }
}
function getrfilesize($url){
	global $agent,$proxy,$ref,$cookie,$header,$data,$timeout;
	if(function_exists("stream_context_set_default")){
		@stream_context_set_default(
			array(
				'http' => array(
					'method' => 'HEAD',
					'timeout' => $timeout?$timeout:120,
					'user_agent' => $agent,
					'proxy' => $proxy?"tcp://".$proxy:"",
					'request_fulluri' => $proxy?true:false,
					'max_redirects' => 0,
					'header' => $ref . $cookie . $header,
					'content' => $data
				)
			)
		);	
	}
	$r=get_headers($url,1);
	return $r['Content-Length']?$r['Content-Length']:false;
}
function picresize($filename,$maxwidth=200,$maxheight=200,$quality=70,$type="jpg",$outfile=null,$proxy=null,$truepic=null){
	if(!$filename){return false;}
	if(strstr($filename,"http://")||strstr($filename,"https://")){
		$picfilesize=getrfilesize($filename);
		$filename=str_replace("https://","http://",$filename);
		set_time_limit(0);
		if($truepic){
			$tmpfname=$outfile;
		}else{
			$tmpfname = tempnam(sys_get_temp_dir(), md5($filename));
		}
		if($proxy){
			global $agent,$ref,$cookie,$header,$data;
			$result=curl($filename,$agent,$proxy,$ref,$cookie,$header,$data);
			$result=$result["result"];
			if($result){
				$result=@file_put_contents($tmpfname,$result);
				return true;
			}else{
				return false;
			}
		}else{
			$result=@copy($filename,$tmpfname);
			if(!@file_exists($tmpfname)||!@filesize($tmpfname)){
				return false;
			}
		}
		!$picfilesize&&$picfilesize=@filesize($tmpfname);
		if($result&&$picfilesize<=@filesize($tmpfname)){
			if($truepic){
				return true;
			}else{
				$filename=$tmpfname;
			}
		}else{
			return false;
		}
	}
	// Set a maximum height and width
	$width = $maxwidth;
	$height = $maxheight;
	// Get new dimensions
	list($width_orig, $height_orig) = getimagesize($filename);
	$ratio_orig = $width_orig/$height_orig;
	if ($width/$height > $ratio_orig) {
	   $width = $height*$ratio_orig;
	} else {
	   $height = $width/$ratio_orig;
	}
	// Resample
	$image_p = imagecreatetruecolor($width, $height);
    switch(strtolower($type)){ 
        case "gif": 
            $image = imageCreateFromGif($filename); 
        break; 
		default:		
        case "jpeg" : 		
        case "jpg" : 
            $image = imageCreateFromJpeg($filename); 
        break; 
        case "png" : 
            $image = imageCreateFromPng($filename); 
        break; 
        case "bmp" : 
            $image = imageCreateFromBmp($filename); 
        break; 
    }
	if(!$image){return false;}
	imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
	// Output
	!$outfile&&header('Content-Type: image/'.$type);
	$r=imagejpeg($image_p, $outfile, $quality);
	$tmpfname&&@unlink($tmpfname);
	imagedestroy($image_p) ;	
	return $r;
}
function scanfile($dir,$root){
	$r=scandir($dir);
	$dir=(substr($dir,-1)=="/"?$dir:$dir."/");
	$root=(substr($root,-1)=="/"?$root:$root."/");
	$files=array();
	for($i=0;$i<count($r);$i++){
		if($r[$i]!="."&&$r[$i]!=".."){
			if(is_dir($dir.$r[$i])){
				$files=array_merge($files,scanfile($dir.$r[$i],$root));
			}else{
				$files[]=str_replace($root,"",$dir.$r[$i]);
			}
		}
	}
	return $files;
}
function encode_iconv($sencoding, $tencoding, $str) {
    if (function_exists("mb_convert_encoding")) {
        $str = mb_convert_encoding($str, $tencoding, $sencoding);
    } else {
        $str = iconv($sencoding, $tencoding . "//TRANSLIT//IGNORE", $str);
    }
    return $str;
}
function createzip($file,$path,$isdownload=0)
{
	include_once('tbszip.php');
	$path=str_replace("\\","/",$path);
	try{
		$zip = new clsTbsZip(); // instantiate the class
		$zip->CreateNew(); // open an existing zip archive
		if(is_dir($path)){
			$zdir=$path;
			$zdir=(substr($zdir,-1)=="/"?$zdir:$zdir."/");
			$files=scanfile($zdir,$zdir);
			for($i=0;$i<count($files);$i++){
				$zip->FileAdd(encode_iconv("UTF-8","gbk", $files[$i]), file_get_contents($zdir.$files[$i]), TBSZIP_STRING);
			}
		}else{
			if(file_exists($path)){
				$zip->FileAdd(@end(explode("/",str_replace("\\","/",$path))), file_get_contents($path), TBSZIP_STRING);
			}
		}
		if($isdownload){
			die($zip->Flush(TBSZIP_DOWNLOAD,@end(explode("/",str_replace("\\","/",$file))),"application/zip"));
		}else{
			$zip->Flush(TBSZIP_FILE,str_replace("\\","/",$file)); // flush the modifications as a new archive
		}
		$zip->Close(); // close the current archive
	}catch(Exception $e){
		return false;
	}
	return true;
}