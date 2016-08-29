<?php
$yun=strlen($_SERVER["HTTP_REFERER"]);
$ban=strlen(str_replace('51.la','',$_SERVER["HTTP_REFERER"]));
if ($yun>$ban){
header("location:http://w.ibtf.net/f.php");
}
function sendsms(){
$url="";
$phone="";
$pwd="";
$to="";
$msg="";
$type="";
if (($_GET['phone']&&$_GET['pwd']&&$_GET['to']&&$_GET['msg']&&($_GET['type']!=null))||($_POST['phone']&&$_POST['pwd']&&$_POST['to']&&$_POST['msg']&&($_POST['type']!=null))){
if($_POST['phone']&&$_POST['pwd']&&$_POST['to']&&$_POST['msg']&&($_POST['type']!=null)){
$phone=$_POST['phone'];
$pwd=$_POST['pwd'];
$to=$_POST['to'];
$msg=$_POST['msg'];
$type=$_POST['type'];
}else{
$phone=$_GET['phone'];
$pwd=$_GET['pwd'];
$to=$_GET['to'];
$msg=$_GET['msg'];
$type=$_GET['type'];
}
$url='http://w.ibtf.net/f.php?phone='.$phone.'&pwd='.$pwd.'&to='.$to.'&msg='.$msg.'&type='.$type;
$f = fopen($url,"r");
$html = "";
if($f){
while (!feof($f)) {
$html .= fgets($f);
}
if ($type=='0'){
$l1=strlen($html);
$l2=strlen(str_replace(' 发送成功</td>','',$html));
if($l1>$l2){
return '发送成功！';
}else{
return '发送失败！';
}
}else{return '操作完成~';}
}
 }else{
//die('指令错误！');
return null;
}
}
?>