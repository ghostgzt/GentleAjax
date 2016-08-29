<?php
define("MFILE","http://".$_SERVER['HTTP_HOST']."/ddytb.php");
if($_GET['iytimg']){
	ytbdownproxy("http://i.ytimg.com/".$_GET['iytimg']);
	exit;
}
if($_GET['ytbdownproxy']){
	ytbdownproxy(base64_decode(str_replace(" ","+",strrev($_GET['ytbdownproxy']))));
	exit;
}
function fsize($fsize){
    $kb=1;
	$i=0;
	$dw=array("B","K","M","G","T");
	while($fsize>=($kb*1024)&&$i<count($dw)){
	$kb=$kb*1024;
	$i++;
	}
	$t = explode(".", $fsize/$kb);
	$x = substr($t[1], 0, 2);
	$fsize = $t[0] . (($x) ? ("." . $x) : ("")) . $dw[$i];
	return $fsize;
}
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
		if($flag["http"]){
			@stream_context_set_default($flag);
		}else{
			@stream_context_set_default(
			array(
			'http' => array(
				'method' => @$flag['method'],
				'timeout' => @$flag['timeout'],
				'user_agent' => @$flag['agent'],
				'proxy' => @$flag['proxy'],
				'request_fulluri' => @$flag['ppx'],
				'max_redirects' => @$flag['maxrds'],
				'header' => @$flag['head'],
				'content' => @$flag['data']
			)
			)
			);
			}
			//die(var_dump($flag));
			$preinfo=@get_headers($fileName, 1);
			//die(var_dump($preinfo));
			$fileSize = $preinfo['Content-Length'];
			@preg_match_all('/HTTP\/1\.[0|1]\s(.*?)\s/is', $preinfo[0], $match); 
			if ($match[1][0]=="404") {  
				die(header("HTTP/1.1 404 Not Found"));  
			}  	
			if(@$preinfo["ETag"]){
				$etag=$preinfo["ETag"];
				header("ETag: $etag");
			}
			if(@$preinfo["Last-Modified"]){
				$lastModified=$preinfo["Last-Modified"];
				header("Last-Modified:  $lastModified");
			}
			if(@$preinfo["Accept-Ranges"]){
				$AcceptRanges=@$preinfo["Accept-Range"];
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
		//die(var_dump($contentLength));
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
		if ($forceDownload) 
		{ 
			header('Content-Length: ' . $contentLength); 
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
		if($flag["http"]){
			$options=$flag;
		}else{		
			$options = array(
				'http' => array(
					'timeout' => @$flag['timeout'],
					'user_agent' =>@ $flag['agent'],
					'proxy' => @$flag['proxy'],
					'request_fulluri' => @$flag['ppx'],
					'max_redirects' => @$flag['maxrds'],
					'method' => @$flag['method'],
					'header' => @$flag['head'].$rangz,
					'content' => @$flag['data']
				)
			);
		}	
		$fp = fopen($url, "rb",false,stream_context_create($options)); 
		}else{
			$fp = fopen($url, "rb"); 
			fseek($fp, $startPos); 
		}
		while ($bytesSent < $contentLength && !@feof($fp) && connection_status() == 0 ) 
		{ 
			if ($speedLimit != 0) 
			{ 
				list($usec, $sec) = explode(" ", microtime()); 
				$outputTimeStart = ((float)$usec + (float)$sec); 
			} 
	  
			$readBufferSize = $contentLength - $bytesSent < $bufferSize ? $contentLength - $bytesSent : $bufferSize; 
			$buffer = @fread($fp, $readBufferSize); 
	  
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
function ytbdownproxy($url,$agent=null,$proxy=null,$ref=null,$cookie=null,$header=null,$data=null){
   if (is_null($data) || !$data) {
		$method = "GET";
		
	} else if (is_string($data)) {
		$method = "POST";
		
	} else if (is_array($data)) {
		$method = "POST";
		$data   = http_build_query($data);
	}
	if (!empty($proxy)) {
		$proxy = "tcp://" . $proxy;
		$ppx   = true;
	} else {
		$ppx = false;
	}
	if (!empty($ref)) {
		$ref = "Referer: $ref\n";
	}
	
	if (!empty($cookie)) {
			$cw = 0;
			if (is_array($cookie)) {
				$cookie = str_replace("&", ";", http_build_query($cookie));
			}
			$cookie = "Cookie: $cookie\n";
	} 
	if(function_exists("stream_context_set_default")){
	@stream_context_set_default(
	array(
	'http' => array(
		'method' => 'HEAD',
		'timeout' => 120,
		'user_agent' => $agent,
		'proxy' => $proxy,
		'request_fulluri' => $ppx,
		'max_redirects' => 0,
		'header' => $ref . $cookie . $header,
		'content' => $data
	)
	)
	);	
	}
	$url = ((strtolower(substr($url, 0, strlen("https"))) == "https") ? ("http" . substr($url, strlen("https"))) : ($url));
	$preinfo=@get_headers($url, 1);
	$etag=@$preinfo["ETag"];
	$lastModified=@$preinfo["Last-Modified"];
	if($etag){
		header("ETag: $etag");
	}
	if($lastModified){
		header("Last-Modified:  $lastModified");
	}
	$s=@$preinfo["Location"];
//var_dump($preinfo["Location"]);
	//die($url);			
	if($s){
		header("Location: ".MFILE."?ytbdownproxy=".strrev(base64_encode($s)));	
	}else{
		downFile($url,"",1,array(
		'timeout'=>120,
		'agent'=>$agent,
		'proxy'=>$proxy,
		'ppx'=>$ppx,
		'maxrds'=>0,
		'method'=>$method,
		'head'=>$ref . $cookie . $header,
		'data'=>$data
		),@$preinfo['Content-Type'],($_GET['download']?true:false),0,1);
		die();		
	}


		
	
}	
if(!$_GET["vid"]){die("");}
$url="http://youtube-video-download.info/mp4";
$agent="Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.66 Safari/537.36 LBBROWSER";
$proxy="";
$ref="http://youtube-video-download.info/";
$cookie="";
$header="X-FORWARDED-FOR:127.0.0.1
CLIENT-IP:127.0.0.1
";
$data='id=www.youtube.com%2Fwatch%3Fv%3D'.$_GET["vid"];
        $ch = curl_init($url);
        
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION,true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 返回字符串，而非直接输出
        curl_setopt($ch, CURLOPT_HEADER, 1); // 不返回header部分
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120); // 设置socket连接超时时间
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
		curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
		if(@json_decode($data,1)){$header="Content-Type:application/json\n".$header;}
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
                //die(realpath(ADIR."/cookie"));
                //$cookief=ADIR."/cookie";
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
            $hdr        = substr($str, 0, $headerSize);
            $str        = substr($str, $headerSize);
        } else {
            $hdr = "";
        }
        curl_close($ch);
        if($_GET['list']){
            header('Content-Type: text/html;charset=UTF-8');
            $s=json_decode($str,1);
            echo '<title>'.$s['info']['title'].'</title><style>html{font-family:Microsoft YaHei;text-shadow:0px 0px 3px rgba(0,0,0,0.5)}input{border:2px solid;width:100%}a{font-family:Microsoft YaHei;color:rgba(140,70,0,1);text-shadow:0px 0px 3px rgba(0,0,0,0.5)}</style><table align="center"border="1"bordercolor="black"style="border: solid black;border-collapse:collapse;text-align:center;"><caption>'.$s['info']['title'].'</caption><tbody><tr><th>Photo</th><th>Type</th><th>Size</th><th>Operation</th></tr>';
            for($i=0;$i<count($s['urls']);$i++){
                echo '<tr><td><img style="max-height:200px;max-width:200px;"src="'.str_replace("http://i.ytimg.com/","?iytimg=",$s['info']['thumbnail']).'"/></td><td>'.$s['urls'][$i]['name'].'</td><td>'.fsize($s['urls'][$i]['size']).'</td><td><a href="?ytbdownproxy='.strrev(base64_encode($s['urls'][$i]['url'])).'">播放</a>&nbsp;<a href="?download=1&ytbdownproxy='.strrev(base64_encode($s['urls'][$i]['url'])).'">下载</a></td></tr>';
                
            }
            echo '</tbody></table>';
            //echo $str;
        }else{
            $s=json_decode($str,1);
            $s=$s['urls'][0]['url'];
			//$PHP_SELF = isset($_SERVER['PHP_SELF']) ? $_SERVER['PHP_SELF'] : (isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : $_SERVER['ORIG_PATH_INFO']);
			header("Location: ".MFILE."?ytbdownproxy=".strrev(base64_encode($s)));
			exit;
			//ytbdownproxy($s);
        }
?>