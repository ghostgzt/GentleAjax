<?php
$maxwidth=320;
$maxheight=320;
$quality=50;
$type=null;
$outfile=null;
if(@$_REQUEST['f']&&@$_REQUEST['c']){
	$ff=str_replace("~25","%25",str_replace(" ","%2B",@$_REQUEST['f']));
	$cc=@$_REQUEST['c'];
	$url="http://lh$cc.googleusercontent.com/$ff";
	$preinfo=@get_headers($url, 1);	
	if(($preinfo["Content-Length"]>3*1024*1024)||($preinfo["Content-Type"]=="image/gif")){
		//die($rootUrl."slh"."$cc/$ff");
		header("Location: ".$rootUrl."slh"."$cc/$ff");
		exit();
	}
	$filename=tempnam(sys_get_temp_dir(), 'Pic');
	copy($url,$filename);
	if(!$maxwidth&&!$maxheight){$maxwidth=200;$maxheight=200;}			
	$r=picresize($filename,$maxwidth,$maxheight,$quality,$type,$outfile);
	if(!$r){
		header('Content-Type: image/png');
		die(base64_decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABGdBTUEAALGPC/xhBQAAAANQTFRF////p8QbyAAAAApJREFUeNpjYAAAAAIAAeUn3vwAAAAASUVORK5CYII="));
	}		
	@unlink($filename);			
}
function picresize($filename,$maxwidth,$maxheight,$quality=70,$type=null,$outfile=null,$imgstring=null){
	ini_set('gd.jpeg_ignore_warning', 1);
	if(!$filename){return false;}
	if(!$maxwidth&&!$maxheight){return false;}
	$imginfo= @getimagesize($filename); 
	if(!$type){
		$type= @basename(@end($imginfo)); 
		!$type&&$type=@end(@explode(".",$filename));
	}
	// Set a maximum height and width
	$width = $maxwidth;
	$height = $maxheight;
	// Get new dimensions
	list($width_orig, $height_orig) = $imginfo;
	if(!$width_orig||!$height_orig){
		readfile($filename);
		return false;
	}
	$ratio_orig = $width_orig/$height_orig;
	if(!$width||!$height){
		!$width&&$width = $height*$ratio_orig;
		!$height&&$height = $width/$ratio_orig;
	}else{
		if(($width>$width_orig)&&($height>$height_orig)){
			$width=$width_orig;
			$height=$height_orig;
		}else{
			if ($width/$height > $ratio_orig) {
			   $width = $height*$ratio_orig;
			} else {
			   $height = $width/$ratio_orig;
			}			
		}

	}
	//die($width."*".$height);
	// Resample
	$image_p = @imagecreatetruecolor($width, $height);
	switch(strtolower($type)){ 
		case "gif": 
			$image = @imagecreatefromgif($filename); 
			return false;
		break; 
		default:		
		case "jpeg" : 		
		case "jpg" : 
			$image = @imagecreatefromjpeg($filename); 
		break; 
		case "png" : 
			imagealphablending($image_p,false);
			imagesavealpha($image_p,true);				
			$image = @imagecreatefrompng($filename); 
			imagesavealpha($image,true);		
		break; 
		case "bmp" : 
			$image = @imagecreatefromwbmp($filename); 
		break; 
		case "webp":
			$image = @imagecreatefromwebp($filename);
		break;
	}
	if(!$image){return false;}
	@imagecopyresized($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
	$imgstring&&imagestring($image_p, @$imgstring["fontsize"]?@$imgstring["fontsize"]:20, @$imgstring["x"]?@$imgstring["x"]:0, @$imgstring["y"]?@$imgstring["y"]:0, @$imgstring["content"]?@$imgstring["content"]:"", @$imgstring["color"]?@$imgstring["color"]:0xFFFFFF);
	// Output
	!$outfile&&header('Content-Type: image/'.$type);
	ob_start(); // start a new output buffer
        $r=@imagejpeg($image_p, $outfile, $quality);
        $ImageData = ob_get_contents();
        $ImageDataLength = ob_get_length();
    ob_end_clean(); // stop this output buffer
    header("Content-type: image/jpeg") ;
	if($ImageData){
		header("Content-Length: ".$ImageDataLength);
		echo $ImageData;				
	}else{
		readfile($filename);
	}
	
	@imagedestroy($image_p) ;	
	return $r;
}