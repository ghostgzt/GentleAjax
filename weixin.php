<?php

/**
  * wechat php test
  */

//define your token
define("TOKEN", "gentle");
$wechatObj = new wechatCallbackapiTest();
$wechatObj->responseMsg();

class wechatCallbackapiTest
{
	public function valid()
    {
        $echoStr = $_GET["echostr"];

        //valid signature , option
        if($this->checkSignature()){
        	echo $echoStr;
        	exit;
        }
    }

   public function responseMsg()  
  {
    $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];//返回回复数据  
    if (!empty($postStr))
    {
      $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);  
      $fromUsername = $postObj->FromUserName;//发送消息方ID  
      $toUsername = $postObj->ToUserName;//接收消息方ID  
      $keyword = trim($postObj->Content);//用户发送的消息  
      $times = time();//发送时间  
      $MsgType = $postObj->MsgType;//消息类型  
      $msgType = "text";   
      
      if($MsgType=='event')
      {
        $MsgEvent = $postObj->Event;//获取事件类型  
        if ($MsgEvent=='subscribe') 
        {
          $msgType = "text"; 
            $content = "欢迎关注芳草堂\n1.XXXXX\n2.XXXX";
        }
        elseif ($MsgEvent=='CLICK') 
        {
         //点击事件  
          $EventKey = $postObj->EventKey;//菜单的自定义的key值，可以根据此值判断用户点击了什么内容，从而推送不同信息  
          switch($EventKey)
          {
           case "V1001_TODAY_MUSIC" :
               $msgType = "news"; 
            //$content = "V1001_TODAY_MUSIC";
				$title="test";
				$description="112233";
				$picurl="http://mt1.baidu.com/timg?wh_rate=0&wapiknow&quality=100&size=w250&sec=0&di=7579963984e8141f23f59cfd4ce60144&src=http%3A%2F%2Fimg.iknow.bdimg.com%2Fzhidaoribao2014%2F2015year%2F0608%2F2.jpg";
				$url="http://douban.fm/partner/baidu/doubanradio";			
            break;
           case "V1001_TODAY_SINGER" :
               $msgType = "text"; 
            $content = "V1001_TODAY_SINGER";
            break;
           case "V1001_HELLO_WORLD" :
               $msgType = "text"; 
            $content = "V1001_HELLO_WORLD";
            break;
           case "V1001_GOOD" :
               $msgType = "text"; 
            $content = "谢谢！";
            break;
           case "GET_WIFI_PASSWD" :
               $msgType = "text"; 
				$content = "WIFI密码为XXX，WIFI密码会不定期更新";
            break;
           }                     
        }  
      }else{
			switch($keyword){
				case "1":
				    $msgType = "text"; 
					$content = "有爱";                            
					break;
				case "2":
				    $msgType = "text"; 
					$content = "test2";                            
					break;
				case "3":
				    $msgType = "text"; 
					$content = "test3";                            
					break;	
				case "4":
				    $msgType = "text"; 
					$content = "test4";                            
					break;					
				default:
				    $msgType = "text"; 
					$content = "你输入的是$keyword";
					break;
			}
	  }
	  
	switch($msgType){
		case "text":
			$msgcontext="<Content><![CDATA[%s]]></Content>";
			$msgcontext=sprintf($msgcontext,$content);
		break;
		case "image":
			$msgcontext="<Image><MediaId><![CDATA[%s]]></MediaId></Image>";
			$msgcontext=sprintf($msgcontext,$mediaid);
		break;	
		case "voice":
			$msgcontext="<Voice><MediaId><![CDATA[%s]]></MediaId></Voice>";
			$msgcontext=sprintf($msgcontext,$mediaid);
		break;
		case "video":
			$msgcontext="<Video><MediaId><![CDATA[%s]]></MediaId><Title><![CDATA[%s]]></Title><Description><![CDATA[%s]]></Description></Video>";
			$msgcontext=sprintf($msgcontext,$mediaid,$title,$description);
		break;	
		case "music":
			$msgcontext="<Music><Title><![CDATA[%s]]></Title><Description><![CDATA[%s]]></Description><MusicUrl><![CDATA[%s]]></MusicUrl><HQMusicUrl><![CDATA[%s]]></HQMusicUrl><ThumbMediaId><![CDATA[%s]]></ThumbMediaId></Music>";
			$msgcontext=sprintf($msgcontext,$title,$description,$MusicUrl,$HQ_MUSIC_Url,$mediaid);
		break;	
		case "news":
			$msgcontext="<ArticleCount>1</ArticleCount><Articles><item><Title><![CDATA[%s]]></Title> <Description><![CDATA[%s]]></Description><PicUrl><![CDATA[%s]]></PicUrl><Url><![CDATA[%s]]></Url></item></Articles>";
			$msgcontext=sprintf($msgcontext,$title,$description,$picurl,$url);	
			file_put_contents("2.txt",$msgcontext);
		break;			
		default:
			$msgcontext="<Content><![CDATA[%s]]></Content>";
			$msgcontext=sprintf($msgcontext,$content);		
		break;
		
	}
	$smsgcontext="XXXX123456XXXX";
      $textTpl = "<xml>
       <ToUserName><![CDATA[%s]]></ToUserName>
       <FromUserName><![CDATA[%s]]></FromUserName>
       <CreateTime>%s</CreateTime>
       <MsgType><![CDATA[%s]]></MsgType>
       ".$smsgcontext."
       <FuncFlag>0</FuncFlag>
       </xml>";            
      $resultStr = sprintf($textTpl, $fromUsername, $toUsername, $times, $msgType);
	  $resultStr =str_replace($smsgcontext,$msgcontext,$resultStr);
	  file_put_contents("1.txt",$resultStr);
	  
 echo $resultStr;
    }
    else
    {           
   echo '没有任何消息传递'; 
    }
  }
		
	private function checkSignature()
	{
        // you must define TOKEN by yourself
        if (!defined("TOKEN")) {
            throw new Exception('TOKEN is not defined!');
        }
        
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        		
		$token = TOKEN;
		$tmpArr = array($token, $timestamp, $nonce);
        // use SORT_STRING rule
		sort($tmpArr, SORT_STRING);
		$tmpStr = implode( $tmpArr );
		$tmpStr = sha1( $tmpStr );
		
		if( $tmpStr == $signature ){
			return true;
		}else{
			return false;
		}
	}
}


/*https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe3cab2e78b6d7a58&secret=f0238ea76d7910d3f0daa7347b3badf5*/