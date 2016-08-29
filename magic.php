<?php
namespace Ajax\Magic;
//use Ajax\Magic;
class magic{
	function __construct(){
		return "__construct";
	}
	function  __destruct(){
	//析构函数会在到某个对象的所有引用都被删除或者当对象被显式销毁时执行。
		return "__destruct";
	}
	public function __call ( string $name , array $arguments ){
	/*
	在对象中调用一个不可访问方法时，__call() 会被调用。
	$name 参数是要调用的方法名称。$arguments 参数是一个枚举数组，包含着要传递给方法 $name 的参数。	
	*/
		return "__call";
	}
	public static function __callStatic ( string $name , array $arguments ){
	//用静态方式中调用一个不可访问方法时，__callStatic() 会被调用。
		return "__callStatic";
	}
	public function __get ( string $name ){
	//读取不可访问属性的值时，__get() 会被调用。
		return "__get";
	}
	public function __set ( string $name , mixed $value ){
	//在给不可访问属性赋值时，__set() 会被调用。
	//参数 $name 是指要操作的变量名称。__set() 方法的 $value 参数指定了 $name 变量的值。
		return "__set";
	}
	public function __isset ( string $name ){
		return "__isset";
	}
	public function __unset ( string $name ){
	//当对不可访问属性调用 unset() 时，__unset() 会被调用。
		return "__unset";
	}
	public function __sleep ( ){
	//__sleep() 方法常用于提交未提交的数据，或类似的清理操作。同时，如果有一些很大的对象，但不需要全部保存，这个功能就很好用。serialize()
		return "__sleep";
	}
	public function __wakeup ( ){
	//__wakeup() 经常用在反序列化操作中，例如重新建立数据库连接，或执行其它初始化操作。unserialize()
		return "__wakeup";
	}
	public function __toString ( ){
	//__toString() 方法用于一个类被当成字符串时应怎样回应。例如 echo $obj; 应该显示些什么。此方法必须返回一个字符串，否则将发出一条 E_RECOVERABLE_ERROR 级别的致命错误。
		return "__toString";
	}
	public function __invoke($arguments){
	//当尝试以调用函数的方式调用一个对象时，__invoke() 方法会被自动调用。
		return "__invoke";
	}
	public static function  __set_state($properties){
	//起当调用 var_export() 导出类时，此静态 方法会被调用。
		return "__set_state";
	}
	public function __clone(){
	//当复制完成时，如果定义了 __clone() 方法，则新创建的对象（复制生成的对象）中的 __clone() 方法会被调用，可用于修改属性的值（如果有必要的话）$obj2 = clone $obj;
		return "__clone";
	}	
	public function __debugInfo(){
		return "__debugInfo";
	}	
}
class supermagic extends magic {
	public static $main="supermagic";
}
interface fairy{
	function __construct();
}
class bettermagic implements fairy{
	private $name="bettermagic\n";
	function __construct(){
		  echo $this->name;
	}
	function bettermagic(){
	  return $this->name;
	}	
}
class bestmagic extends magic implements fairy{
	private $name="bestmagic\n";
	function __construct(){
		  echo $this->name;
	}
	function bestmagic(){
	  return $this->name;
	}	
}
function __autoload($classname) {
//__autoload — Attempt to load undefined class
//new ClassNot
    $filename = "./". $classname .".php";
    include_once($filename);
}
$bettermagic=new bettermagic();
echo $bettermagic->bettermagic();
$bestmagic=new bestmagic();
echo $bestmagic->bestmagic();
var_export($bestmagic);
echo supermagic::$main;