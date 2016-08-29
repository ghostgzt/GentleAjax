<?php
$cs=@json_decode(base64_decode(str_replace(" ","+",$_GET['cs'])),1);

if(@$_GET["path"]){
$file=urldecode(@$_GET["path"]);
/*if (pbxt() == "Windows") {
	$file = encode_iconv("UTF-8","gbk",  ($file));
}*/

$n0=@explode(".",$file);
unset($n0[count($n0)-1]);
$path=@join(".",$n0);

//die($path);
//$path="./gc/";

$rar_file = rar_open($file) or die("Can't open Rar archive"); 
/*example.rar换成其他档桉即可*/ 
$entries = rar_list($rar_file); 
@mkdir($path);
foreach ($entries as $entry) { 
$entry->extract($path); /*/dir/extract/to/换成其他路径即可*/ 
} 
rar_close($rar_file); 

/*
$s=(scandir("gc"));
$s=$s[2];
echo $s;
rename("gc/$s","gc/unpack");
*/
function destroyDir($dir, $virtual = false)
{
    $ds  = DIRECTORY_SEPARATOR;
    $dir = $virtual ? realpath($dir) : $dir;
    $dir = substr($dir, -1) == $ds ? substr($dir, 0, -1) : $dir;
    if (is_dir($dir) && $handle = opendir($dir)) {
        while ($file = readdir($handle)) {
            if ($file == '.' || $file == '..') {
                continue;
            } elseif (is_dir($dir . $ds . $file)) {
                destroyDir($dir . $ds . $file);
            } else {
                unlink($dir . $ds . $file);
            }
        }
        closedir($handle);
        rmdir($dir);
        return true;
    } else {
        return false;
    }
}
function folderToZip($folder, &$zipFile, $subfolder = null) {
    if ($zipFile == null) {
        // no resource given, exit
        return false;
    }
    // we check if $folder has a slash at its end, if not, we append one
    $folder .= end(str_split($folder)) == "/" ? "" : "/";
    $subfolder .= end(str_split($subfolder)) == "/" ? "" : "/";
    // we start by going through all files in $folder
    $handle = opendir($folder);
    while ($f = readdir($handle)) {
        if ($f != "." && $f != "..") {
            if (is_file($folder . $f)) {
                // if we find a file, store it
                // if we have a subfolder, store it there
                if ($subfolder != null)
                    $zipFile->addFile($folder . $f, $subfolder . $f);
                else
                    $zipFile->addFile($folder . $f);
            } elseif (is_dir($folder . $f)) {
                // if we find a folder, create a folder in the zip 
                $zipFile->addEmptyDir($f);
                // and call the function again
                folderToZip($folder . $f, $zipFile, $f);
            }
        }
    }
}
$z = new ZipArchive();
$z->open($path.".zip", ZIPARCHIVE::CREATE);
folderToZip($path, $z);
$z->close();
destroyDir($path);
die("ok!");

}else{
echo '<body><span style="font-family: Microsoft YaHei;text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);">RAR To ZIP</span><div style="font-family : Microsoft YaHei;text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);display: block; border: 2px solid; padding: 10px;" align="center"><label>RAR Path</label>&nbsp;&nbsp;<input id="path" type="text" style=" border: 2px solid;width: 450px;" value="'.((pbxt() == "Windows")?encode_iconv("UTF-8","gbk",  $cs['name']):$cs['name']).'">&nbsp;&nbsp;<a style="font-family : Microsoft YaHei;color: rgba(140, 70, 0, 1);text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);" href="javascript:void(0);" onclick="window.open(\''.$GLOBALS['adminfile'].'?op=cjx&name=rar&path=\'+encodeURIComponent(document.getElementById(\'path\').value));">转为ZIP</a></div></body>';
}
