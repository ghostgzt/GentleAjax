<?php
/*=======picsizer========*/
$imgtruepic=0;
$imgmaxwidth=664;
$imgmaxheight=950;
$imgquality=70;
$imgproxy=array("125.39.66.67:80");//"221.176.14.72:80";
/*=======picsizer========*/
/*=======page========*/
$autonrefreshtime=30;
$autonextpagetime=60;
$forktime=240;
$actiontime=5;
/*=======page========*/
/*=======curl========*/
$agent="Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.66 Safari/537.36 LBBROWSER";
$proxy="";
$ref="http://exhentai.org/";
$cookie="__utma=185428086.2089509566.1408552175.1408552175.1411729638.2; __utmz=185428086.1411729638.2.2.utmcsr=hazelzhu.com|utmccn=(referral)|utmcmd=referral|utmcct=/archives/1544/comment-page-1; event=1411729643; ipb_member_id=1899593; ipb_pass_hash=7fc3c8879ae63a3060c8d99a3e6d799e; igneous=61edafe19427f6c655d13623ba30f038a40b7bd0b6bc01cd94d3904dcfd02fe25cd91e9e06ccc03ec8f900f94ea507af919c56f9b6c26a121bad42b2c9274660; uconfig=tl_m-uh_y-rc_0-cats_0-xns_0-ts_m-tr_2-prn_y-dm_l-ar_0-rx_0-ry_0-ms_n-mt_n-cs_a-to_a-sa_y-oi_n-qb_n-tf_n-hp_-hk_-xl_; lv=1411732271-1412182206";
$header="X-FORWARDED-FOR:127.0.0.1
CLIENT-IP:127.0.0.1
";
$timeout=120;
$data='';
/*=======curl========*/
/*=======style========*/
$style='<style>*{font-family: Microsoft YaHei;text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);}a{font-family : Microsoft YaHei;color: rgba(140, 70, 0, 1);text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);}hr{border: solid 1px #000000;}#main{overflow:hidden;padding:10px;word-break: break-all;}input{border: solid 1px #000000;}pre{font-family: Microsoft YaHei;padding-left:20px;}</style><style>.ipic,#ipic{max-width:200px;}.pic,#pic{max-width:220px;display:none;border:solid black 10px;position:absolute;opacity:0;-webkit-transition:opacity 0.5s,display 0.5s;}</style><div id="pic"class="pich" onmouseover="this.style.opacity=\'0\';this.style.display=\'none\';"><img id="ipic"></div><script>pics={over:function(ts){document.getElementById("ipic").src=ts.href;var sd=document.getElementById("pic");sd.style.marginLeft=(ts.offsetLeft-8);sd.style.marginTop=(ts.offsetTop+(((ts.offsetTop+sd.offsetHeight)>document.documentElement.clientHeight)?-(sd.offsetHeight+30):30));sd.style.display="block";sd.style.opacity="1";},out:function(ts){document.getElementById("pic").style.opacity="0";}}</script>';
/*=======style========*/