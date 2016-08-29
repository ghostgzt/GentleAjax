function stringToHex(str){
var val="";
for(var i = 0; i < str.length; i++){
if(val == "")
val = "" +str.charCodeAt(i).toString(16);
else
val += "" + str.charCodeAt(i).toString(16);
}
return val;
}
function stringtolitehex(sss){
var ddd="";
var str = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*()_~!.'-";
for(var i=0;i<sss.length;i++){
if(str.indexOf(sss.substr(i,1))>=0){
ddd=ddd+""+stringToHex(sss.substr(i,1));
}else{
ddd+=sss.substr(i,1);
}

}
ddd=encodeURIComponent(ddd);
ddd=ddd.replace(/%/g,"");
return ddd.toUpperCase();
}
function litehextourl(str){
var ddd="";
if(parseInt(str.length/2)!=str.length/2){alert("Error");return false;}
var i=0;
while(i<str.length){
ddd=ddd+"%"+str.substr(i,2);
i+=2;
}
return ddd;
}


prompt("",stringtolitehex("你妹00ddrff呵呵"));
prompt("",decodeURIComponent (litehextourl("E4BDA0E5A6B930306464726666E591B5E591B5")));


/*
for(var i=0;i<str.length;i++){
//alert(str.substr(i,1));
ddd=sss.replace(eval("/"+str.substr(i,1)+"/g"),"%"+stringToHex(str.substr(i,1)));
}*/
//alert((ddd));