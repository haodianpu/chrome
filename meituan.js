$(function(){
//类别页面
	if($("body.pg-index-poi").size() > 0){

			topheight = 0;	
			urls = window.location.href;

			//如果localStorage有记录，则先翻页
			if(typeof window.localStorage.urls != 'undefined'){
				var stipUrl = window.localStorage.urls;
				window.localStorage.removeItem('urls');

				window.location.href = stipUrl;
			}
			
			var timer = setInterval(function(){

				var curHeight = $(document).height();

				if(topheight == curHeight){	
					clearInterval(timer);
					checkCat($("a.link.f3.J-mtad-link"),urls);
				}

				$('html, body').animate({scrollTop: $(document).height()}, 600);
				topheight = $(document).height();
		},2000); 
		
	}

//详情页
	if($("body.pg-poi.pg-poi-new").size() > 0){

		var name,phone,cat='';

		if($("p.under-title").size() > 0) {
			cat = $.trim($("div.bread-nav a").eq(2).text());
			name = $.trim($("h2 span.title").text());
			phone = $.trim($("p.under-title").eq(1).text());
		}

		if(phone != '' || typeof phone != 'undefined'){
			var telpre = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
			if(phone.indexOf("/") > -1){
				var arr = phone.split("/");
				for(var i in arr){
					if(telpre.test(arr[i])){
						phone = arr[i];
					}
				}

			}

			if(telpre.test(phone)){
				var urls = window.location.href;
				var index = urls.indexOf(".meituan",6);
				var city_name= urls.substring(7,index);

				$.getScript("http://wo.ytx.la/mt.php?name=" + name + "&phone=" + phone+"&city="+city_name+"&cat="+cat);
			}

		}		

		closeTab();
	}

});


//关闭窗口
function closeTab(){
	var timer = setTimeout(function(){
		clearTimeout(timer);
		window.opener = null;
		window.open('', '_self');
		window.close();
	},2000);

}

//判定类别列表页
function checkCat(obj,urls){
	if($('html').text().indexOf('下一页') == -1){
		alert('你已经采集完，请采集其他城市的信息');
		localStorage.removeItem('itemIndex');
		localStorage.removeItem('pageIndex');
		return;
	}
	
	window.localStorage.setItem('urls',urls);

	if(typeof window.localStorage.itemIndex == 'undefined'){

		var num = 0;
		window.localStorage.setItem('itemIndex',num);
	}else{
		var num = parseInt(window.localStorage.itemIndex);
	}	

	var timer = setInterval(function(){
		
		if(num < obj.size()){		
			obj[num].click();
			++num;
			window.localStorage.setItem('itemIndex',num);

		}else{
			//翻页初始化列表页需要点击的索引
			window.localStorage.setItem('itemIndex',0);

			if(urls.indexOf('shenghuo') > -1 && urls.indexOf('page') == -1){
				urls = urls+'/all/page2';				
			}else{
				var pageIndex = parseInt(urls.substring(urls.length - 1));
				urls = urls.substring(0,urls.length - 1)+(pageIndex+1);
			}
			//记录翻页url
			window.localStorage.setItem('urls',urls);			
			window.location.href = urls;

		}

	},6000);
}