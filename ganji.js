$(function(){
	var urls = window.location.href;
/*
	if($(".category").size() > 0){
		var numbers = 0;
		if(numbers < $("a.mgr15").size() && $("a.mgr15").size() > 0){
			$("a.mgr15")[numbers].click();
			++numbers;
		}else if(numbers < $("s a").size() && $("s a").size() > 0){
			$("s a")[numbers].click();
			++numbers;
		}
	}
*/
	//租房
	if($("#f_mew_list").size() > 0){
		historyUrl(urls);
		checkCat($("a.js-title"),urls);
	}

	//商铺
	if($("body.b-list.housing-list").size() > 0){
		historyUrl(urls);
		checkCat($("a.list-info-title"),urls);
	}

	//车辆买卖
	if($("body.b-list.vehicle-list").size() > 0){
		historyUrl(urls);
		checkCat($("a.infor-title.pt_tit"),urls);
	}

	//本地生活服务
	if($("body.b-list.service-list").size() > 0){
		historyUrl(urls);
		checkCat($("a.f14.list-info-title"),urls);
	}

	//教育培训
	if($("body.header-fixed").size() > 0){
		historyUrl(urls);
		checkCat($("a.list-info-title"),urls);
	}

	//美容化妆
	if($("body.b-list.secondmarket-list.lg-screen").size() > 0){
		historyUrl(urls);
		checkCat($("a.t"),urls);
	}

	if(urls.indexOf('htm') >-1 || $("body.b-detail.service-detail").size() > 0){

		var index = urls.indexOf(".ganji",6);
		var city_name= urls.substring(7,index);
		var cat_arr = urls.split("/");
		var cat = cat_arr[3];
		var name,phone='';

		//租房
		if($("span.number-single").size() > 0) {
			name = $.trim($("p.name a").text());
			phone = $.trim($("span.number-single").text());
		}

		//商铺
		if(phone == '' && $("em.contact-mobile").size() > 0){
			name = $.trim($("i.fc-4b").text());
			phone = $.trim($("em.contact-mobile").text());
		}

		if(phone == '' && $("span.tel.phone.show_noauth_pop").size() > 0){
			if($(".displayphonenumber").size() > 0){
				name = $.trim($("h1.p1").text());
				var gjalog = $(".displayphonenumber").attr("gjalog");
				var garr = gjalog.split("phone=");
				phone = garr[1].substr(0,11);
				
			}			

		}

		//货车
		if(phone == '' && $("span.contact-col.phoneNum-style").size() > 0){
			name = $.trim($("i.fc-4b").text());
			phone = $.trim($("span.contact-col.phoneNum-style").text());
		}

		if(phone == '' && $("span.phoneNum-style").size() > 0){
			name = $.trim($("i.fc-4b").text());
			phone = $.trim($("span.phoneNum-style").text());

		}

		while (phone.indexOf(" ") != -1){
			phone = phone.replace(/\s/ig,'');
		}

		var telpre = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
		if(telpre.test(phone)){
			$.getScript("http://wo.ytx.la/gji.php?name=" + name + "&phone=" + phone+"&city="+city_name+"&cat="+cat);
		}

		closeTab();
	}
	//不是赶集网站内直接关掉
	if(urls.indexOf("ganji") == -1){
		closeTab();
	}	
	//400页面或者无法访问网站直接关掉
	if((urls.indexOf("ganji") > -1 && document.body.innerHTML.search('request header or cookie too large') > -1) || (urls.indexOf("ganji") > -1 && document.body.innerHTML.search("无法访问此网站") > -1)){
		closeTab();
	}

	document.cookie = '';

});

//记录链接
function historyUrl(urls){
	//如果localStorage有记录，则先翻页
	if((typeof window.localStorage.gjurls != 'undefined')){
		var hpage = window.localStorage.gjurls.split('/');
		var cpage = window.location.href.split('/');
		//localStorage记录的url不等于当前url就跳转
		if(hpage[4] != cpage[4]){
			var stipUrl = window.localStorage.gjurls;
			console.log(stipUrl+'123');
			window.localStorage.removeItem('gjurls');
			window.location.href = stipUrl;
		}

	}
	

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
//判定类别列表页
function checkCat(obj,urls){
	if($('html').text().indexOf('下一页') == -1){
		alert('你已经采集完，请采集其他城市或类别的信息');
		localStorage.removeItem('itemIndex');
		localStorage.removeItem('gjurls');
		return;
	}

	if(typeof window.localStorage.itemIndex == 'undefined'){
		var num = 0;
		window.localStorage.setItem('itemIndex',num);
	}else{
		var num = parseInt(window.localStorage.itemIndex);
	}	

	var str = urls.split("/");
	if(str[4] == 'undefined' || str[4] == ''){
		urls = urls+'o1/';
		str = urls.split("/");
	}
	var page = parseInt(str[4].substring(1));
	var index = str[4].length;

	var timer = setInterval(function(){
		if(num < obj.size()){		
			obj[num].click();
			++num;
			window.localStorage.setItem('itemIndex',num);
		}else{
			++page;	
			//翻页清空列表页需要点击的索引
			window.localStorage.setItem('itemIndex',0);
			urls = urls.slice(0,-index)+page+'/';
			//记录翻页url
			window.localStorage.setItem('gjurls',urls);	
			window.location.href = urls;
		}

	},10000);
}


