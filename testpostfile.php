<?php
    include "SingleFileSender.php";
    
    $fileName="C:\Users\Gentle\Desktop\gopikachu.txt";
    $handle = @fopen($fileName, "r");
    $file=fread($handle,filesize($fileName));
    fclose($handle);

    $sfs=new SingleFileSender("http://127.0.0.1/post.php");    
	$sfs->setHeader("Cookie","abc=123");
    
    echo $sfs->post(array(
            array(
                  "postName"=>"pic",
                  "fileName"=>$fileName,
                  "file"=>$file,
                  "type"=>"image/pjpeg"
                  ),
              array(
                  "name"=>"value1",
                  "value"=>"123456"
                  ),
              array(
                 "name"=>"value2",
                 "value"=>"abcdef")
          ));
?>