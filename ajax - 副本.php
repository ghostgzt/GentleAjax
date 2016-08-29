<?php
/* vim: set expandtab tabstop=4 shiftwidth=4: */
// +----------------------------------------------------------------------+
// | Ajax Over All Domain                                                 |
// +----------------------------------------------------------------------+
// | Copyright (c) 2013-2014 Powered By Gentle                            |
// +----------------------------------------------------------------------+
// | This source file is subject to version 3.0 of the PHP license,       |
// | that is bundled with this package in the file LICENSE, and is        |
// | available through the world-wide-web at the following url:           |
// | http://www.php.net/license/3_0.txt.                                  |
// | If you did not receive a copy of the PHP license and are unable to   |
// | obtain it through the world-wide-web, please send a note to          |
// | license@php.net so we can mail you a copy immediately.               |
// +----------------------------------------------------------------------+
// | Authors: Original Author Gentle_Kwan <ghostgzt@gmail.com>            |
// +----------------------------------------------------------------------+
// $version:3.5
//
//Ajax Over All Domain
error_reporting(0);
$ref_disable=array();//来路黑名单
$ref_allow=array("localhost","127.0.0.1");//来路白名单
define("CACHE_TIME",3600*24*7);
define("CACHE_MIN",512);
define("CACHE_MAX",52428800);
$refhost=strtolower(reset(explode("/",end(explode("//",$_SERVER["HTTP_REFERER"])))));
if($ref_disable){
    if(in_array($refhost,$ref_disable)){
        die(header("HTTP/1.1 403 Forbidden "));
    }
}
if($ref_allow){
    if(!in_array($refhost,$ref_allow)){
        die(header("HTTP/1.1 403 Forbidden "));
    }
}
if($_POST["cors"]){
    header("Access-Control-Allow-Origin:*");
}
if(Extension_Loaded('zlib')) Ob_Start('ob_gzhandler');
class Downloader
{
    function downFile($fileName, $fancyName = '',$iswebfile=0,$flag=array(
        'timeout'=>120,
        'agent'=>"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",
        'proxy'=>"",
        'ppx'=>false,
        'maxrds'=>3,
        'method'=>"GET",
        'head'=>"",
        'data'=>""
    ),$contentType = '', $forceDownload = true, $speedLimit = 0 ,$superCache=0) {
        if($iswebfile){
            stream_context_set_default(
                array(
                    'http' => array(
                        'method' => $flag['method'],
                        'timeout' => $flag['timeout'],
                        'user_agent' => $flag['agent'],
                        'proxy' => $flag['proxy'],
                        'request_fulluri' => $flag['ppx'],
                        'max_redirects' => $flag['maxrds'],
                        'header' => $flag['head'],
                        'content' => $flag['data']
                    )
                )
            );
            $preinfo=get_headers($fileName, 1);
            $fileSize = $preinfo['Content-Length'];
            @preg_match_all('/HTTP\/1\.[0|1]\s(.*?)\s/is', $preinfo[0], $match);
            if ($match[1][0]=="404") {
                die(header("HTTP/1.1 404 Not Found"));
            }
            if($preinfo["ETag"]){
                $etag=$preinfo["ETag"];
                header("ETag: $etag");
            }
            if($preinfo["Last-Modified"]){
                $lastModified=$preinfo["Last-Modified"];
                header("Last-Modified:  $lastModified");
            }
            if($preinfo["Accept-Ranges"]){
                $AcceptRanges=$preinfo["Accept-Range"];
                header("Accept-Range:  $AcceptRanges");
            }
        }else{
            if (!is_readable($fileName))
            {
                header("HTTP/1.1 404 Not Found");
                return false;
            }
            $fileStat = stat($fileName);
            $fileSize = $fileStat['size'];
            $lastModified = $fileStat['mtime'];
            $md5 = md5($fileStat['mtime'] .'='. $fileStat['ino'] .'='. $fileStat['size']);
            $etag = '"' . $md5 . '-' . crc32($md5) . '"';
            header('Last-Modified: ' . gmdate("D, d M Y H:i:s", $lastModified) . ' GMT');
            header("ETag: $etag");
        }
        if($superCache){
            if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $lastModified)
            {
                header("HTTP/1.1 304 Not Modified");
                return true;
            }

            if (isset($_SERVER['HTTP_IF_UNMODIFIED_SINCE']) && strtotime($_SERVER['HTTP_IF_UNMODIFIED_SINCE']) < $lastModified)
            {
                header("HTTP/1.1 304 Not Modified");
                return true;
            }

            if (isset($_SERVER['HTTP_IF_NONE_MATCH']) &&  $_SERVER['HTTP_IF_NONE_MATCH'] == $etag)
            {
                header("HTTP/1.1 304 Not Modified");
                return true;
            }
        }
        if ($fancyName == '')
        {
            $fancyName = basename($fileName);
        }

        if ($contentType == '')
        {
            $contentType = 'application/octet-stream';
        }


        $contentLength = $fileSize;
        $isPartial = false;

        if (isset($_SERVER['HTTP_RANGE']))
        {
            if (preg_match('/^bytes=(\d*)-(\d*)$/', $_SERVER['HTTP_RANGE'], $matches))
            {
                $startPos = $matches[1];
                $endPos = $matches[2];

                if ($startPos == '' && $endPos == '')
                {
                    return false;
                }

                if ($startPos == '')
                {
                    $startPos = $fileSize - $endPos;
                    $endPos = $fileSize - 1;
                }
                else if ($endPos == '')
                {
                    $endPos = $fileSize - 1;
                }

                $startPos = $startPos < 0 ? 0 : $startPos;
                $endPos = $endPos > $fileSize - 1 ? $fileSize - 1 : $endPos;

                $length = $endPos - $startPos + 1;

                if ($length < 0)
                {
                    return false;
                }

                $contentLength = $length;
                $isPartial = true;
            }
        }

        // send headers
        if ($isPartial)
        {
            header('HTTP/1.1 206 Partial Content');
            header("Content-Range: bytes $startPos-$endPos/$fileSize");
            $rangz=PHP_EOL."Accept-Ranges: bytes".PHP_EOL."Range: bytes= $startPos-";
        }
        else
        {
            header("HTTP/1.1 200 OK");
            $startPos = 0;
            $endPos = $contentLength - 1;
        }

        header('Pragma: cache');
        header('Cache-Control: public, must-revalidate, max-age=0');
        header('Accept-Ranges: bytes');
        header('Content-type: ' . $contentType);
        header('Content-Length: ' . $contentLength);

        if ($forceDownload)
        {
            header('Content-Disposition: attachment; filename="' . rawurlencode($fancyName). '"');
        }

        header("Content-Transfer-Encoding: binary");

        $bufferSize = 128;

        if ($speedLimit != 0)
        {
            $packetTime = floor($bufferSize * 1000000 / $speedLimit);
        }

        $bytesSent = 0;

        set_time_limit(0);
        $url=$fileName;
        $url = ((strtolower(substr($url, 0, strlen("https"))) == "https") ? ("http" . substr($url, strlen("https"))) : ($url));
        if($iswebfile){
            $options = array(
                'http' => array(
                    'timeout' => $flag['timeout'],
                    'user_agent' => $flag['agent'],
                    'proxy' => $flag['proxy'],
                    'request_fulluri' => $flag['ppx'],
                    'max_redirects' => $flag['maxrds'],
                    'method' => $flag['method'],
                    'header' => $flag['head'].$rangz,
                    'content' => $flag['data']
                )
            );
            $fp = fopen($url, "rb",false,stream_context_create($options));
        }else{
            $fp = fopen($url, "rb");
            fseek($fp, $startPos);
        }
        while ($bytesSent < $contentLength && !feof($fp) && connection_status() == 0 )
        {
            if ($speedLimit != 0)
            {
                list($usec, $sec) = explode(" ", microtime());
                $outputTimeStart = ((float)$usec + (float)$sec);
            }

            $readBufferSize = $contentLength - $bytesSent < $bufferSize ? $contentLength - $bytesSent : $bufferSize;
            $buffer = fread($fp, $readBufferSize);

            echo $buffer;

            ob_flush();
            flush();

            $bytesSent += $readBufferSize;

            if ($speedLimit != 0)
            {
                list($usec, $sec) = explode(" ", microtime());
                $outputTimeEnd = ((float)$usec + (float)$sec);

                $useTime = ((float) $outputTimeEnd - (float) $outputTimeStart) * 1000000;
                $sleepTime = round($packetTime - $useTime);
                if ($sleepTime > 0)
                {
                    usleep($sleepTime);
                }
            }
        }
        return true;
    }
}







//global $cache,$kzm,$ajax_get_url,$ajax_get_el,$method,$encode,$match,$type,$op,$contents,$path;
$cache=$_REQUEST['cache'];
$kzm=$_REQUEST['kzm'];
$ajax_get_url=base64decode($_REQUEST['ajax_get_url']);
$ajax_get_el=base64decode($_REQUEST['ajax_get_el']);
$method=base64decode($_REQUEST['method']);
$encode=base64decode($_REQUEST['encode']);
$match=base64decode($_REQUEST['match']);
$type=base64decode($_REQUEST['type']);
$adv=$_REQUEST['adv'];
$op=$_REQUEST['op'];
$contents=codeconvert(base64decode($_REQUEST['contents']),$encode);
$path=base64decode($_REQUEST['path']);
function base64decode($base64){
    return base64_decode(str_replace(" ","+",$base64));
}
function verify($var,$md5){
//die(md5(xsencode($var))." ".$md5);
    $i=md5(xsencode($var))==$md5?true:false;
    if(!$i){
        die(header("HTTP/1.1 403 Forbidden "));
    }
}
//die(var_dump(verify($contents,$_REQUEST["verify"])));
function ajax($url, $data = null, $cookie = null, $referer = null, $proxy = null, $agent = null, $head = null) {
    $ch = curl_init($url);
    if ($agent) {
        //curl_setopt($ch, CURLOPT_USERAGENT,"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31");
        curl_setopt($ch, CURLOPT_USERAGENT, $agent);
    }

    if ($head) {
        /*
        $header = array(
        'X-Requested-With:XMLHttpRequest'
        ); */
        if($head=='1'||$head=='2'){
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_NOBODY, true);
        }else{
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $head);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        }
    }
    if ($proxy) {
        curl_setopt($ch, CURLOPT_PROXY, $proxy);
    }
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
    if (!empty($referer)) {
        curl_setopt($ch, CURLOPT_REFERER, $referer);
    }
    if (!empty($cookie)) {
        curl_setopt($ch, CURLOPT_COOKIE, $cookie);
    }
    if (is_null($data)) {
        // GET

    } else /*if (is_string($data)) */{

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        // POST

    } /*else if (is_array($data)) {
        // POST
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    }*/
    $str = curl_exec($ch);

    if($head=='2'){$str=curl_getinfo($ch,CURLINFO_HTTP_CODE);}else{
        if(base64decode($head)){

            $str=getdomvalue($str,base64decode($head));
        }
    }
    curl_close($ch);
    return $str;
}

function getheader($url,$type){
    $gh=(get_headers(url,1));
    return $gh[$type];
}
/*****
 *@dir - Directory to destroy
 *@virtual[optional]- whether a virtual directory
 */
function destroyDir($dir, $virtual = false) {
    $ds = DIRECTORY_SEPARATOR;
    $dir = $virtual ? realpath($dir) : $dir;
    $dir = substr($dir, -1) == $ds ? substr($dir, 0, -1) : $dir;
    if (is_dir($dir) && $handle = opendir($dir)) {
        while ($file = readdir($handle)) {
            if ($file == '.' || $file == '..') {
                continue;
            }
            elseif(is_dir($dir.$ds.$file)) {
                destroyDir($dir.$ds.$file);
            }
            else {
                unlink($dir.$ds.$file);
            }
        }
        closedir($handle);
        rmdir($dir);
        return true;
    }
    else {
        return false;
    }
}
/*function arrIconv($arr, $fromCharset, $toCharset){
    if(is_array($arr)){
        $arr1 = array();
        foreach($arr as $key => $value){
            $key = iconv($fromCharset, $toCharset, $key);
            $arr1[$key] = arrIconv($value, $fromCharset, $toCharset);
        }
    }else{
        $arr1 = iconv($fromCharset, $toCharset, $arr);
    }
    return $arr1;
}
//die(preg_replace("#\\\u([0-9a-f]{4})#ie", "iconv('UCS-2BE', 'UTF-8', pack('H4', '\\1'))", $results));
*/
function post_file($remote_server,$uri,$file,$filetype,$postdata){
    //$remote_server = "webinno.cn";
    $boundary = "---------------------".substr(md5(rand(0,32000)),0,10);
    // Build the header
    $header = "POST $uri HTTP/1.0\r\n";
    $header .= "Host: {$remote_server}\r\n";
    $header .= "Content-type: multipart/form-data, boundary=$boundary\r\n";
    /*
    // attach post vars
    foreach($postdata AS $index => $value){
        $data .="--$boundary\r\n";
        $data .= "Content-Disposition: form-data; name=\"".$index."\"\r\n";
        $data .= "\r\n".$value."\r\n";
        $data .="--$boundary\r\n";
    }
    */
    $file_name = $file;
    $content_type = $filetype;
    $data = '';
    // and attach the file
    $data .= "--$boundary\r\n";
    $content_file = file_get_contents($file);
    $data .="Content-Disposition: form-data; name=\"userfile\"; filename=\"$file_name\"\r\n";
    $data .= "Content-Type: $content_type\r\n\r\n";
    $data .= "".$content_file."\r\n";
    $data .="--$boundary--\r\n";
    $header .= "Content-length: " . strlen($data) . "\r\n\r\n";
    // Open the connection
    $fp = fsockopen($remote_server, 80);
    // then just
    fputs($fp, $header.$data);
    // reader
    while (!feof($fp)) {
        echo fgets($fp, 128);
    }
    fclose($fp);
}
function getdomvalue($code,$rule){//getdomvalue(file_get_contents("http://www.baidu.com/"),"/html/body//a//@href")

    $results=array();
    $dom = new DOMDocument();
    @$dom->loadHTML($code);
    $dom->normalize();
    $xpath = new DOMXPath($dom);
    $hrefs = $xpath->evaluate($rule);
    for ($i = 0; $i < $hrefs->length; $i++) {
        $href = $hrefs->item($i);
        $linktext = $href->nodeValue;
        $results[count($results)]= $linktext;
    }

    return json_encode($results);

}
function codeconvert($str,$encode){
    if($encode){
        $encode=explode('|',$encode);
        if (function_exists("mb_convert_encoding")) {
            $str = mb_convert_encoding($str, $encode[1], $encode[0]);
        } else {
            $str=iconv($encode[0],$encode[1]."//IGNORE",$str);}
    }
    return $str;
}
function xcache($u = null,$content = null,$ispost=null) {
    global $cache,$kzm;
    try{
        if($cache){
            //$u = $ajax_get_url.$ajax_get_el.$method.$encode.$match;//$_SERVER['QUERY_STRING'];
            $z = 'cache/'.md5($u).'.'.(($kzm)?($kzm):($ispost?'txt':'js'));

            //die($z);
            if ($u) {
                if (!$content) {
                    if (file_exists($z)&&(filemtime($z)+(int)$cache>time())) {
                        if($ispost){
                            return file_get_contents($z);
                        }else{
                            header("Location:$z");
                            return true;
                        }
                    }
                } else {

                    if (time() - date(filemtime('cache')) > constant("CACHE_TIME")) {
                        destroyDir('cache');
                    }
                    if (!is_dir('cache')) {
                        mkdir('cache');
                    }
                    if ((strlen($content) > constant("CACHE_MIN"))&&(strlen($content) < constant("CACHE_MAX"))) {
                        file_put_contents($z, $content);
                        if(!$ispost){
                            header("Location:$z");
                        }
                        return true;

                    }else{return false;}
                }
            }
        }
    }catch(Exception $e){return false;}
}

function preajax($ajax_get_url,$ispost=0){
    verify($ajax_get_url,$_REQUEST["verify"]);
    global $ajax_get_el,$method,$encode,$match,$adv,$type;
    $u = $ispost.$ajax_get_url.$ajax_get_el.$method.$encode.$match;
    $c=xcache($u,null,$ispost);
    if($c){return $c;}
    $ax = $method;
    $ax0 = json_decode($ax, true);
    $url =$ajax_get_url;
    if (strtolower($ax0[0]) == 'post') {
        $data = $ax0[1];
        $adata=@json_decode($data,1);
        $data=$adata?$adata:$data;
    } else {
        $data = null;
    }
    if($adv){
        $cookie = $ax0[2];$referer = $ax0[3];$proxy = $ax0[4];$agent = $ax0[5];$head = $ax0[6];
        $dlx=new Downloader();
        $dlx->downFile($ajax_get_url, '',1,$flag=array(
            'timeout'=>120,
            'agent'=>$agent?$agent:"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",
            'proxy'=>$proxy?$proxy:"",
            'ppx'=>$proxy?true:false,
            'maxrds'=>3,
            'method'=>$data?"POST":"GET",
            'head'=>($cookie?"Cookie:".$cookie.PHP_EOL:"").($referer?"Referer:".$referer.PHP_EOL:"").($head?$head:""),
            'data'=>$data?$data:""
        ),$type, $type?false:true, 0 ,0);//$url, $data = null, $cookie = null, $referer = null, $proxy = null, $agent = null, $head = null
        die();
    }
    $r = ajax($url, $data, $ax0[2], $ax0[3], $ax0[4], $ax0[5], $ax0[6]);
    $r = codeconvert($r,$encode);
    if($match){$match=explode('|',$match);
        preg_match_all(base64decode($match[0]), $r, $result);
        $m=explode('|',base64decode($match[0]));
        if($match[1]==2){$result=preg_replace(json_decode(base64decode($m[0])),json_decode(base64decode($m[1])),$r);
            $r=$result;
        }else{
            if(isset($match[1])){
                if($match[1]==0){$result=$result[0];}
                if($match[1]==1){$result=$result[1];}
            }
            $r=json_encode($result);
        }
    }
    if($ispost){
        if(strlen($r)>0){
            if(xcache($u,$r,$ispost)){return($r);}else{return false;}
        }
    }
    if($ajax_get_el){
        $el = $ajax_get_el;
        header("Content-type: text/javascript");
        $op=('var ' . $el . '="";' . $el . '="' . base64_encode($r) . '";');
        if(strlen($r)>0){
            if(!xcache($u,$op)){die($op);}
        }else{
            die($op);
        }
    }else{
        if($type=='download'){
            Header("Content-type: application/octet-stream");
            header("Content-Disposition: attachment; filename=".basename($url));
        }else{
            if($type){
                header('Content-Type: '.$type);
            }
        }
        if(strlen($r)>0){
            if(!xcache($u,$r)){die($r);}
        }else{
            die($r);
        }
    }
    return false;
}
if ($ajax_get_url) {
    preajax($ajax_get_url,0);

}else{
    if($op){
        switch ($op)
        {
            case "code":
                verify($contents,$_REQUEST["verify"]);
                if($_REQUEST["worker"]){
                    header("Access-Control-Allow-Origin:*");
                    header('Content-Type: application/javascript');
                    die(eval($contents));
                }				
                if($_REQUEST["event"]){
                    header("Access-Control-Allow-Origin:*");
                    header('Content-Type: text/event-stream');
                    header('Cache-Control: no-cache');//flush();
                    die(eval($contents));
                }
                $r=$contents?eval($contents):"";
                $r = codeconvert($r,$encode);
                if($r){
                    if($ajax_get_el){
                        $el = $ajax_get_el;
                        header("Content-type: text/javascript");
                        $op=('var ' . $el . '="";' . $el . '="' . base64_encode($r) . '";');
                        die($op);
                    }else{

                        if($_POST["cors"]){
                            die($r);
                        }else{
                            die("<script> window.parent.postMessage('".base64_encode($r)."','*');</script>");
                        }

                    }
                }
                //$r = codeconvert($r,$encode);
                /*if($r){
                $u = $op.$contents;
                if(xcache($u)){return false;}
                      if(strlen($r)>0){
                    if(!xcache($u,$r)){die($r);
                    }
                    }else{
                    die($r);
                    }

                }*/
                // code to be executed if expression = label1;
                break;
            case "shell":
                verify($contents,$_REQUEST["verify"]);
                $c=$contents;
                $r=$c?shell_exec($c):"";
//die($encode);
                $r = codeconvert($r,$encode);

                if($r){
                    if($ajax_get_el){
                        $el = $ajax_get_el;
                        header("Content-type: text/javascript");
                        $op=('var ' . $el . '="";' . $el . '="' . base64_encode($r) . '";');
                        die($op);
                    }else{
                        if($_POST["cors"]){
                            die($r);
                        }else{
                            die("<script> window.parent.postMessage('".base64_encode($r)."','*');</script>");
                        }
                    }
                }
                break;
            case "readfile":
                verify($path,$_REQUEST["verify"]);
                if(!file_exists("cache")){mkdir("cache");}
                $p="cache/".$path;
                if($p){

                    try{

                        $r= file_get_contents($p);
                        $r = codeconvert($r,$encode);
                    }catch(Exception $e){
                        $r=$e;
                    }
                    if($ajax_get_el){
                        $el = $ajax_get_el;
                        header("Content-type: text/javascript");
                        $op=('var ' . $el . '="";' . $el . '="' . base64_encode($r) . '";');
                        die($op);
                    }else{
                        if($_POST["cors"]){
                            die($r);
                        }else{
                            die("<script> window.parent.postMessage('".base64_encode($r)."','*');</script>");
                        }
                    }
                }
                break;
            case "savefile":
                verify($path,$_REQUEST["verify"]);
                if(!file_exists("cache")){mkdir("cache");}
                $p="cache/".$path;
                $c=$contents;
                //$c = codeconvert($c,$encode);

                if($p){
                    try{
                        if(strlen($c)){
                            if(file_put_contents($p,$c)){
                                $r=realpath($p);
                            }else{
                                $r="0";
                            }
                        }else{
                            $r="0";
                        }
                    }catch(Exception $e){
                        $r=$e;
                    }
                    if($ajax_get_el){
                        $el = $ajax_get_el;
                        header("Content-type: text/javascript");
                        $op=('var ' . $el . '="";' . $el . '="' . base64_encode($r) . '";');
                        die($op);
                    }else{
                        if($_POST["cors"]){
                            die($r);
                        }else{
                            die("<script> window.parent.postMessage('".base64_encode($r)."','*');</script>");
                        }
                    }
                }
                break;
            case "delfile":
                verify($path,$_REQUEST["verify"]);
                if(!file_exists("cache")){mkdir("cache");}
                $p="cache/".$path;
                if($p){


                    try{
                        if(unlink($p)){
                            $r="1";
                        }else{
                            $r="0";
                        }
                    }catch(Exception $e){
                        $r=$e;
                    }
                    if($ajax_get_el){
                        $el = $ajax_get_el;
                        header("Content-type: text/javascript");
                        $op=('var ' . $el . '="";' . $el . '="' . base64_encode($r) . '";');
                        die($op);
                    }else{
                        if($_POST["cors"]){
                            die($r);
                        }else{
                            die("<script> window.parent.postMessage('".base64_encode($r)."','*');</script>");
                        }
                    }

                }
                break;
            case "checkfile":
                verify($path,$_REQUEST["verify"]);
                if(!file_exists("cache")){mkdir("cache");}
                $p="cache/".$path;
                if($p){


                    try{
                        $r=json_encode(stat($p));
                    }catch(Exception $e){
                        $r=$e;
                    }
                    if($ajax_get_el){
                        $el = $ajax_get_el;
                        header("Content-type: text/javascript");
                        $op=('var ' . $el . '="";' . $el . '="' . base64_encode($r) . '";');
                        die($op);
                    }else{
                        if($_POST["cors"]){
                            die($r);
                        }else{
                            die("<script> window.parent.postMessage('".base64_encode($r)."','*');</script>");
                        }
                    }

                }
                break;
            case "postcallback":
//$_POST["content"];
                die("<script> window.parent.postMessage('".base64_encode(preajax($_POST["url"],1))."','*');</script>");
//die("<iframe src=\"".$_POST["page"]."#!ajax_md5=".$_POST["md5"]."\"></iframe>");
                break;
            case "clearall":
                verify($op,$_REQUEST["verify"]);
                try{
                    if(destroyDir("cache")){
                        if(!file_exists("cache")){mkdir("cache");}
                        $r="1";
                    }else{
                        $r="0";
                    }

                }catch(Exception $e){
                    $r=$e;
                }
                if($ajax_get_el){
                    $el = $ajax_get_el;
                    header("Content-type: text/javascript");
                    $op=('var ' . $el . '="";' . $el . '="' . base64_encode($r) . '";');
                    die($op);
                }else{
                    die($r);
                }

                break;
            default:
                // code to be executed
                return false;
                break;
        }
    }
}
function xsdecode($str){
    $i=0;
    $s="";
    while($i<strlen($str)){
        $s=$s."%".substr($str,$i,2);
        $i+=2;
    }
    return urldecode($s);
}

function xsencode($text) {
    $retval = ''; for($i = 0; $i < strlen($text); ++$i) { $s=dechex(ord($text[$i]));$retval .= ''.strlen($s)==1?"0".$s:$s; } return strtoupper($retval);
}
function urlencodeall($text) { $retval = ''; for($i = 0; $i < strlen($text); ++$i) { $s=dechex(ord($text[$i]));$retval .= '%'.strlen($s)==1?"0".$s:$s; } return strtoupper($retval); }
/*
  var ms = new Array();
  ms[0]="post";//method
  ms[1]={"test":1,"start":"@C:\Users\Gentle\Desktop\wbs.txt"};//postdata
  ms[2]="PHPSESSID=TestAjax";//cookie
  ms[3]="http://www.baidu.com/";//referer
  ms[4]=0;//proxy
  ms[5]="Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31";//agent
  var mshead = new Array();
  mshead[0]='X-Requested-With:XMLHttpRequest';
  ms[6]=mshead;//head:"1"-getHead|"2"-getHTTP_CODE|b.encode("/html/body//a//@href")-"getdomvalue"
  CrossScript('http://www.baidu.com/',ms,'ajax_ds','alert(ajax_ds);','GB2312|UTF-8', -1);
--------------------------------<
  getfile('http://www.baidu.com/img/baidu_jgylogo3.gif', 'http://www.baidu.com/', 'image/png',ms,4,'png');
--------------------------------<  
  var mats=new Array();
  mats[0]="/<h>(.*?)<\\/h>/";
  mats[1]="/<z>(.*?)<\\/z>/";
  var reps=new Array();
  reps[0]="123";
  reps[1]="456";
  getmatchtext('http://202.112.118.66/bar/list/Total.xml',mats,reps,'ajax_xk','alert(ajax_xk)','GB2312|UTF-8',0,'');
--------------------------------<   
  getmatcharray('http://202.112.118.66/bar/list/Total.xml',"/<h>(.*?)<\/h>/",0,'ajax_xk','alert(ajax_xk[0][0])','GB2312|UTF-8',0,'');
--------------------------------<
  jspost(ajaxurl, {op:'code',cache:'3600',kzm:'js',contents:b.encode(data)}, "_blank");  
--------------------------------<
  readfile("111.txt","ajax_test","alert(ajax_test)");
--------------------------------<  
  savefile("111.txt","你好Fuck","ajax_test","alert(ajax_test)", 'UTF-8|GBK');
--------------------------------<    
  delfile("111.txt","ajax_test","alert(ajax_test)");
--------------------------------<      
  shell("dir","ajax_test","alert(ajax_test)",'GBK|UTF-8');
--------------------------------<        
  checkfile("111.txt","ajax_test","alert(ajax_test)");
--------------------------------< 
  clearall("ajax_test","alert(ajax_test)"); 
--------------------------------<   
  loadXMLDoc("data/database3.lib","GET","","alert(xmlhttp.response)","gb2312");
*/
?>
/*<script>window.location.href="/";</script>*/
<?PHP
if(Extension_Loaded('zlib')) Ob_End_Flush();
?>