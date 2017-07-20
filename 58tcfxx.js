var i=0,
arr = [],
search = window.location.search;

//如果是列表页
if( $('#infolist').size() > 0 ){
	
	var s = getCookie('prostr');
	if( s == null ){
		var p = window.prompt();
		if(p == '')
			return;
			
		setCookie('prostr', p, 36000);
	}
	
	$('#infolist tr').each(function(){
		var _this = $(this);
		if( !_this.hasClass('none') && _this.find('.item-desc') ){
			var url = _this.find('a:eq(1)').attr('href');
			if( /http/.test(url) ){
				arr.push(url);
				i++;
			}
			
		}
	});
	
	var t = setInterval(function(){
		
		if( typeof o != 'function' ){
			o = openDetail(arr);
		}
		o();
		
	}, 18000);
	
}

//如果是详情页
if( /psid/g.test(search) ){
	
	var t = setInterval(function(){
		
		if( $('.im-chat').size() > 0 ){
			
			clearInterval(t);
			
			document.querySelector('.im-chat').click();
			
			setTimeout(function(){
				
				if( $('.im-msg-main', window.frames['webim'].document).size() > 0 ){
					console.log('已发送过，关闭页面');
					return setTimeout(function(){
						window.close();
					}, 2000);
				}
				
				setTimeout(function(){
					window.close();
				}, 2000);
				
				var str = getCookie('prostr');
				window.frames['webim'].document.querySelector('.im-input-richtext').innerHTML = str;
				
				window.frames['webim'].document.querySelector('.im-send').click();
				
			}, 2000);
			
		}
		
	}, 300);
	
}

//打开详情页
function openDetail(arry){
	var j = 0;
	var arr = arry;
	function b(){
		var url = arr.shift();
		if( url == undefined ){
			console.log('正在前往下一页');
			return document.querySelector('.next').click();
		}
		window.open(url);
		j++;
	}
	
	return b;
}

function setCookie(name,value,time){
	var minutes = arguments[2] ? arguments[2] : 48*60;
	var exp = new Date();
	exp.setTime(exp.getTime() + minutes * 60 * 1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/" + ";domain="+window.location.hostname;
}

function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	 if(arr != null) return unescape(arr[2]); return null;
}