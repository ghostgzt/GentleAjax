<?php
/*创建 读取 写入 删除 检查
数据库 表 键值*/
$SQL_HOST="127.0.0.1:3306";
$SQL_USER="root";
$SQL_PASSWD="root";
$SQL_DB="kktest";
$SQL_TABLE="k0";
$INDEXS='{"uid":15,"sid":256,"type":256,"ints":256,"page":256,"pic":256}';
$PARAMS='{"uid":1,"sid":"test1","type":"ff","ints":256,"page":"ss","pic":"none"}';
$FINDKEY="uid=1";
$SETKEY="pic='nn'";
function createDB($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB){
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){

$s=mysql_select_db($SQL_DB, $link);
if($s){
mysql_close($link);
return true;
}else{
$r=@mysql_query("CREATE DATABASE ".$SQL_DB,$link);
mysql_close($link);
return $r;
}
}
}

function checkDB($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB){
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){

$s=mysql_select_db($SQL_DB, $link);
mysql_close($link);
if($s){
return true;
}else{
return false;
}
}
}


function delDB($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB){
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){

$s=mysql_select_db($SQL_DB, $link);
if($s){
$r=@mysql_query("DROP DATABASE ".$SQL_DB,$link);
mysql_close($link);
return $r;
}else{
return false;
}
}
}

//var_dump(createTable($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$INDEXS));
function createTable($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$INDEXS){
//$INDEXS='{"uid":15,"sid":256,"type":256,"ints":256,"page":256,"pic":256}';
$INDEXS=@json_decode($INDEXS,1);
if(!$INDEXS){return false;}
foreach ($INDEXS as $key => $value){
$mainkey=$key;
break;
}
$hs="PRIMARY KEY(".$mainkey.")";
foreach ($INDEXS as $key => $value){
$hs.=",".$key." varchar(".$value.")";
}
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){
try{
$s=mysql_select_db($SQL_DB, $link);
if(!$s){
@mysql_query("CREATE DATABASE ".$SQL_DB,$link);
mysql_select_db($SQL_DB, $link);
}


$sql = "CREATE TABLE IF NOT EXISTS ".$SQL_TABLE."(".$hs.")";
$r= mysql_query($sql,$link);
  mysql_close($link);
return $r;
  } catch (Exception $e) {
 mysql_close($link);
  return false;
  }
  }else{
    mysql_close($link);
return false;
  }
  } 

//var_dump(readTable($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE));
function readTable($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$SQL_FN="*"){

$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){
try{
@mysql_select_db($SQL_DB, $link);
$result = @mysql_query("SELECT ".$SQL_FN." FROM ".$SQL_TABLE."");
$axx=array();
$i=0;
while($row = @mysql_fetch_array($result))
  {
  $axx[$i]=$row;
  $i++;
  }
  //var_dump($axx);
  mysql_close($link);
  return $axx;
   } catch (Exception $e) {
 mysql_close($link);
  return false;
  }
  }else{
    mysql_close($link);
return false;
  }

}
//var_dump(delTable($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE));
function delTable($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE){
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){
try{
mysql_select_db($SQL_DB, $link);
$r=@mysql_query("DROP TABLE ".$SQL_TABLE,$link);
mysql_close($link);
return $r;
 } catch (Exception $e) {
 mysql_close($link);
  return false;
  }
  }else{
    mysql_close($link);
return false;
  }

}

//var_dump(writeValue($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$PARAMS));
function writeValue($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$PARAMS){
//$PARAMS='{"uid":15,"sid":"test1","type":"ff","ints":256,"page":"ss","pic":"none"}';
$PARAMS=@json_decode($PARAMS,1);
$keys=array();
$values=array();
foreach ($PARAMS as $key => $value){
$keys[]=$key;
$values[]="'".$value."'";
}
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){
try{
mysql_select_db($SQL_DB, $link);
$sql = "INSERT INTO ".$SQL_TABLE." (".join(",",$keys).") VALUES (".join(",",$values).")";
//die($sql);
//echo $sql;
$result = mysql_query($sql,$link);
    //  mysql_close($link);
      if($result){
    return true;
   }else{
   return false;
	}
	 } catch (Exception $e) {
 mysql_close($link);
  return false;
  }
}else{
     mysql_close($link);
return false;
  }
}
//var_dump(updateValue($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$FINDKEY,$SETKEY));
function updateValue($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$FINDKEY,$SETKEY){
//$FINDKEY="uid='123'";
//$SETKEY="value='456'";
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){
try{
mysql_select_db($SQL_DB, $link);
$rtt = mysql_query("SELECT * from ".$SQL_TABLE." WHERE ".$FINDKEY,$link);
//var_dump(mysql_fetch_array($rtt));
if (!mysql_fetch_array($rtt)){
return false;
}
//die(str_replace("int=","ints=",$params['data']));
$sql="update ".$SQL_TABLE." set ".$SETKEY." where ".$FINDKEY;
   $result=mysql_query($sql);
   //mysql_close($link);
   if($result){
    return true;
   }else{
   return false;
	}
	 } catch (Exception $e) {
 mysql_close($link);
  return false;
  }
  }else{
     mysql_close($link);
return false;
  }
}
//var_dump(readValue($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$FINDKEY));
function readValue($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$SQL_FN="*",$FINDKEY){
//$FINDKEY="uid='123'";
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){
try{
mysql_select_db($SQL_DB, $link);
$result = mysql_query("SELECT ".$SQL_FN." from ".$SQL_TABLE." WHERE ".$FINDKEY,$link);
$axx=array();
$i=0;
while($row = mysql_fetch_array($result))
  {
  $axx[$i]=$row;
  $i++;
  }
  //var_dump($axx);
  mysql_close($link);
  return $axx?$axx:$result;
 } catch (Exception $e) {
 mysql_close($link);
  return false;
  }
  }else{
     mysql_close($link);
return false;
  }

}
//var_dump(delValue($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$FINDKEY));
function delValue($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$FINDKEY){
//$FINDKEY="uid='123'";
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){
try{
mysql_select_db($SQL_DB, $link);
$r= mysql_query("DELETE from ".$SQL_TABLE." WHERE ".$FINDKEY,$link);

  mysql_close($link);
return $r;
	 } catch (Exception $e) {
 mysql_close($link);
  return false;
  }
  }else{
    mysql_close($link);
return false;
  }

}
function query($SQL_HOST, $SQL_USER, $SQL_PASSWD,$SQL_DB,$SQL_TABLE,$COMMAND){
$link=mysql_connect($SQL_HOST, $SQL_USER, $SQL_PASSWD); 
if($link){
try{
	mysql_select_db($SQL_DB, $link);
	$rtt= mysql_query($COMMAND,$link);
	$r=@mysql_fetch_array($rtt);
	mysql_close($link);
return $r?$r:$rtt;
	 } catch (Exception $e) {
 mysql_close($link);
  return false;
  }
  }else{
    mysql_close($link);
return false;
  }


}
