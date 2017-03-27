window.onload = function () {
	
	if(document.cookie.indexOf("times=") == -1 || getCookie("times") == ''){
		var date=new Date(); 
		date.setTime(date.getTime()+24*60*60*1000); 
		//document.cookie = "times=1; expires=" + date.toGMTString() + ";path=/" + ";domain=www.baidu.com";
		document.cookie = "times=1";
		//alert("初始化");
	}
	//alert("获取cookie："+getCookie('times'));
    if(parseInt(getCookie('times')) <= 9 ){
		if ($("#rs table th a").size() > 0) {
			var arr_wd = [];

			$("#rs table th a").each(function (index) {				
				var kname = $(this).text();				
				$.getScript("https://www.haodianpu.com/?http://www.haodianpu.net/web/chrome/baidu?kw=" + kname);
				arr_wd.push($(this).text());
			});
			var dates=new Date(); 
			dates.setTime(dates.getTime()+24*60*60*1000); 

			if(document.cookie.indexOf("arr_wd=") == -1 || getCookie("arr_wd") == ''){				
				//存入第一页的关键字
				//document.cookie = "arr_wd="+encodeURIComponent(arr_wd.join(','))+"; expires="+dates.toGMTString() + ";path=/" + ";domain=www.baidu.com";
				document.cookie = "arr_wd="+encodeURIComponent(arr_wd.join(','));
			}

			var times = parseInt(getCookie('times'))+1;
			//alert(times);			
			//document.cookie = "times=" + times + "; expires=" + dates.toGMTString() + ";path=/" + ";domain=www.baidu.com";
			document.cookie = "times=" + times ;
			//取出第一页的关键字
			var firstkw = decodeURIComponent(getCookie("arr_wd")).split(',');
			var ckw = firstkw.splice(0,1);			
			//document.cookie = "arr_wd=" + encodeURIComponent(firstkw.join(',')) + "; expires=" + dates.toGMTString() + ";path=/" + ";domain=www.baidu.com";
			document.cookie = "arr_wd=" + encodeURIComponent(firstkw.join(','));
			var timer = setTimeout(function(){
				clearTimeout(timer);
				window.open("https://www.baidu.com/s?wd="+ckw);
				
			},2000);

			var timer2 = setTimeout(function(){
				clearTimeout(timer2);
				closeTab();			
			},1000);

		}else{
			alert("没有相应的关键字，请输入其他的关键字");
		}

	}else{
		
		document.cookie = "times=";
		document.cookie = "arr_wd=";
		alert("采集完成");	
		closeTab();	
	}

}

//获取cookie
function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return arr[2];
	else
		return null;
}

//关闭窗口
function closeTab(){
	var timer = setTimeout(function(){
		clearTimeout(timer);
		window.opener = null;
		window.open('', '_self');
		window.close();
	},3000);

}




