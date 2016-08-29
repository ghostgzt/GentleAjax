<?php
ignore_user_abort(true);
define (ENG_DIC,'4eng.lxz');
define (ENG_COUNT,'count.ini');

function sendmx($str){
require '../lib/PHPFetion.php';
$fetion = new PHPFetion('13XXXXXXXXX', 'XXXXXX');	// 手机号、飞信密码
$result= $fetion->send('13XXXXXXXXX', $str);	// 接收人手机号、飞信内容
if(strstr($result,'发送成功')){
return '{"result":1,"message":"\u53d1\u9001\u6210\u529f"}';
}else{
return '{"result":0,"message":"\u53d1\u9001\u5931\u8d25"}';
}
}

function b2h($str){
$s=$str;
$s=str_replace('tʃ','去',$s);
$s=str_replace('dʒ','姬',$s);
$s=str_replace('ɔI','哦-喂',$s);
$s=str_replace('əu','呕',$s);
$s=str_replace('Iə','衣-饿',$s);
$s=str_replace('ɛə','哎-饿',$s);
$s=str_replace('uə','乌-饿',$s);
$s=str_replace('ɡ','哥',$s);
$s=str_replace('æ','@',$s); 
$s=str_replace('ʊ','u',$s);
$s=str_replace('ə','额',$s);
$s=str_replace('ɑ','阿',$s);
$s=str_replace('ʌ','阿',$s);
$s=str_replace('ɔ','哦',$s);
$s=str_replace('θ','呼',$s);
$s=str_replace('ð','呼',$s);
$s=str_replace('ʃ','取',$s);
$s=str_replace('ʒ','衣',$s);
$s=str_replace('ɪ','衣',$s);
$s=str_replace('ŋ','哼',$s);
return $s;
}

function geteng($n,$s){
$ss=json_decode(base64_decode(file_get_contents(ENG_DIC)),true);
$sx=count($ss['dic']);
for($i=$n;$i<$n+$s;$i++){
$sd.='
'.(str_replace(') ','] ',str_replace(' (',' [',trim(b2h($ss['dic'][$i])))));
}
if($n+$s+1<$sx){$sdx=$n+$s+1;}else{$sdx=0;}
file_put_contents(ENG_COUNT,$sdx);
return $sd;
}

if (file_exists(ENG_COUNT)){$ddx=intval(file_get_contents(ENG_COUNT));}else{$ddx=0;}
//echo send(geteng($ddx,10));
die (sendmx(geteng($ddx,5)));
?>