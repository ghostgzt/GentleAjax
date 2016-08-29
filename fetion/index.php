<?php
error_reporting(0);
require_once("sendsms.php");
$l2="请根据提示填上以下内容后点发送";
$l1=null;
$l1=sendsms();
if ($l1){
$l2=$l1;
}
?>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="shortcut icon" href="./feition.gif" />
<title>飞信免费信息</title>
<script type="text/javascript"> 
<!-- 
document.oncontextmenu=function(e){return false;} 
//--> 
</script> 
<style> 
body { 
-moz-user-select:none; 
} 
</style> 
<body oncontextmenu=self.event.returnValue=false onselectstart="return false"> 
<div id="main" align="center">
<div class="box05"><form action="" method="post" name="form">
  <table width="613" border="10" cellspacing="0" cellpadding="0">
     <tbody><tr>
    <td height="19" colspan="3" align="left"><img src="./feition.gif" />处理时间：<?php echo date("Y-m-d H:i:s",time()).' '.$l2;?></td>
    </tr>    
    <tr>
      <td width="134" height="40" align="right">手机号：</td>
      <td colspan="2"><input type="text" name="phone" id="phone" value="<?php if($_POST['phone']){echo $_POST['phone'];}else{echo $_GET['phone'];} ?>" class="choice">免费注册飞信:发送KTFX至10086自动注册 </td>
      </tr>
    <tr>
      <td height="35" align="right">飞信密码：</td>
      <td colspan="2" align="left"><input type="password" name="pwd" id="pwd" value="<?php if($_POST['pwd']){echo $_POST['pwd'];}else{echo $_GET['pwd'];} ?>" class="choice">忘记飞信密码:发送P到12520生成随机密码</td>
      </tr>
    <tr>
      <td height="43" align="right">发送到：</td>
      <td colspan="2"><table width="479" border="0" cellspacing="0" cellpadding="0">
        <tbody><tr>
          <td width="160"><input type="text" name="to" id="to" value="<?php if($_POST['to']){echo $_POST['to'];}else{echo $_GET['to'];} ?>" class="choice"></td>
          <td width="309" valign="middle"><span class="STYLE1">*请输入好友手机号或飞信账号<span class="STYLE2"></span></span></td>
        </tr>
      </tbody></table></td>
      </tr>
    <tr>
      <td height="27" align="right">发送内容：</td>
      <td colspan="2"><textarea name="msg" cols="50" rows="2" id="msg"><?php if($_POST['msg']){echo $_POST['msg'];}else{echo $_GET['msg'];} ?></textarea></td>
      </tr>
    <tr>
      <td height="35" align="right"><input type="submit" name="submit" id="submit" value=" " style="background:url(./sent.jpg) no-repeat; width:64px;height:29px; border:0px;"></td>
      <td colspan="2" align="left"><input type="radio" name="type" id="type" value="0" checked="checked">发送短信<!--input type="radio" name="type" id="type" value="1">检查好友--><input type="radio" name="type" id="type" value="2">添加好友<!--input type="radio" name="type" id="type" value="3">查看好友信息--></td>
      </tr>
  </tbody></table></form>
</div>
</div>
</body>
</html>