var ZHAO = (function(){
    var host = "zhaoqian.haodianpu.com";
    
    // 定位
    function fixed(obj)
    {
        // 窗口参数
        var sw = $(window).width();
        var sh = $(window).height();
        var sx = $(document).scrollLeft();
        var sy = $(document).scrollTop();
        
        var _w = parseInt($(obj).width()/2);
        var _h = $(obj).height();
        
        var _left = parseInt(sw/2-_w+sx);
        var _top = parseInt(sh+sy-_h-5);
        
        $(obj).css({position:"absolute", left: _left, top: _top});
    } 
    
    var M = {
        itemCheck: function(search) {
            if (search.indexOf("&sid=") == -1 || search.indexOf("&token=") == -1 || search.indexOf("&ll=") == -1) {
                // 缺少参数
                return;
            }
            
            var zhao_id = "zhaoqian";
            
            if ($(window).scrollTop() < $("#description").height()) {
                zhao_id = "zhaoqian_info";
                
                if ($(document.body).find("#zhaoqian_info").size() < 1) {
                    $(document.body).append("<div id='zhaoqian_info' style='border:1px solid #fc6d05; width:750px; height:50px; z-index:99999999;'><img src='http://img01.taobaocdn.com/imgextra/i1/62192401/T2YMTDXK4aXXXXXXXX-62192401.jpg'></div>");
                }
                
            } else {
                zhao_id = "zhaoqian";
                
                if ($(document.body).find("#zhaoqian_info").size() > 0) {
                    $("#zhaoqian_info").remove();
                }
                
                if ($(document.body).find("#zhaoqian").size() < 1) {
                    $(document.body).append("<iframe id='zhaoqian' src='http://"+host+"/present' style='border:none; frameborder=0; scrolling=0; width:780px; height:70px; z-index:99999999;'></iframe>");
                }
            }
            
            fixed($("#"+zhao_id));

            $(window).bind("scroll resize orientationchange", function(){
                fixed($("#"+zhao_id));
            });
        },
        tradeList: function() {
            // 交易页
            var d = new Date();

			chrome.cookies.get({'url':'http://zhaoqian.haodianpu.com','name':'zhao_uid'}, function(cookies) {
				console.log(cookies);
			});

            $("#J_BoughtTable tbody").each(function(i){
                // 过滤[机票/彩票|虚拟物品]
                /*if ($(this).hasClass('jipiao-order') || $(this).hasClass('lottery-order') || $(this).find(".order-hd .J_ShareSNS").size()<=0 || ($(this).find(".order-bd .amount .post-type").size()>0 && $(this).find(".order-bd .amount .post-type").html().search("虚拟物品")>-1)) {
                    return;
                }*/
                
                var oid = $(this).attr("data-orderid");
                
                if (typeof oid !== "undefined") {
                    var dt = $(this).find(".order-hd .dealtime").html();
                    
                    var today = d.format('y-m-d');
                    var buyerNick = $("#J_LoginInfo").find(".menu-hd a:first").html();
                    /*if ( today > dt ) {
                        return;
                    }*/
                    
                    var params = {
                        oid: oid,
                        nick: buyerNick,
                        status: $(this).attr("data-status"),
                        iid: $(this).find(".order-hd .J_ShareSNS").first().attr("data-param").match(/key":"([0-9]+)/)[1],
                        title: $(this).find(".order-bd .baobei-name").first().find("a:first").text(),
                        price: $(this).find(".order-bd .amount").first().find("p:first em").html(),
                        order_time: dt
                    };
                    
                    $.getScript("http://"+host+"/my/suborder?"+$.param(params)+"&rnd="+d.getTime()+"&callback=console.log");
                }
            });
        },
        tradeDetail: function(search) {
            // 检测订单交易状态
            var order = search.match(/(bizOrderId|biz_order_id)=[\d]+/);
            var oid = order[0].replace(order[1]+"=", "");
            
            // token
            if (search.search(/token=[\S]+/) === -1) {
                console.warn("不是从找钱网过来");
                return;
            }
            
            var token = search.match(/token=[^&]+/);
            token = token[0].replace("token=", "");
            
            var confirmTime = $(".misc-info").find("dl:last").find("dd:last").text();
            
            var status = 0;
            if($("td.status").size() > 0){
                $("td.status").each(function(i){
                    if ($(this).html().indexOf('已确认收货') > -1) {
                        status = 1;
                    }
                });
            }
            
            if($("td.header-status").size() > 0){
                $("td.header-status").each(function(){
                    if($(this).html().indexOf('交易成功') > -1){
                        confirmTime = $(".step-time-wraper").html();
                        status = 1;
                    }
                });
            }
            
            var params = {'oid':oid, 'status':status, 'confirmTime':confirmTime, 'token': token};
            $.getScript("http://"+host+"/trade/confirm?"+$.param(params)+"&rnd="+Math.random()+"&callback=console.log", function(){
                window.close();
            });
        }
    };
    
    return M;
}());

(function(){
    Date.prototype.format = function(partten){
        if(partten ==null || partten==''){
            partten = 'y-m-d'    ;
        }
        var y = this.getFullYear();
        var m = this.getMonth()+1;
        var d = this.getDate();
        var r = partten.replace(/y+/gi,y);
        r = r.replace(/m+/gi,(m<10?"0":"")+m);
        r = r.replace(/d+/gi,(d<10?"0":"")+d);
        return r; 
    }
    // 隐藏extension安装提示
    if ($("#extension-wrap").size()>0) {
        $("#extension-wrap").hide();
    }
    
    function request(strParame) { 
        var args = new Object( ); 
        var query = location.search.substring(1); 

        var pairs = query.split("&"); 
        for(var i = 0; i < pairs.length; i++) { 
            var pos = pairs[i].indexOf('='); 
            if (pos == -1) continue; 
            var argname = pairs[i].substring(0,pos); 
            var value = pairs[i].substring(pos+1); 
            value = decodeURIComponent(value); 
            args[argname] = value; 
        } 
        return args[strParame]; 
    }
    
    var iid = request("id") != null ? request("id") : (request("itemid") != null ? request("itemid") : '');
    
    if (window.location.host.search(/(item|detail)\.(taobao|tmall)\.com$/) > -1) {
        //如果宝贝已下架
        if($(document.body).html().indexOf("已下架") > 0){
            $.getScript("http://zhaoqian.haodianpu.com/list/itemstock?iid="+ iid +"&callback=console.log");
            $.getScript("http://i.haodianpu.com/best/zjtg/itempause?iid="+ iid +"&callback=console.log");
            setTimeout(function(){
                window.location.href = "http://zhaoqian.haodianpu.com/goto.php?iid="+ iid;
            }, 1500);
            return;
        }
    }
    
    var timer = setInterval(function(){
        if ($("body").size() > 0) {
            
            var search = window.location.search;
            if (window.location.host.search(/(item|detail)\.(taobao|tmall)\.com$/) > -1) {
                if (search.indexOf("&sid=") == -1 || search.indexOf("&token=") == -1 || search.indexOf("&ll=") == -1) {
                    // 缺少参数
                    return;
                }
                
                //ZHAO.itemCheck(search);
                
                // 继续检查是否浏览宝贝完毕
                /*if ($(window).scrollTop() < $("#description").height()) {
                    return;
                }*/
            } else if (window.location.href.search(/trade\.taobao\.com\/trade\/itemlist/) > -1 && $("#J_BoughtTable").size() > 0) {
                ZHAO.tradeList();
            }
            else if ((window.location.href.search(/trade\.taobao\.com\/trade\/detail/) > -1 || window.location.href.search(/trade\.tmall\.com\/detail/) > -1) && window.location.href.search(/(bizOrderId|biz_order_id)=[\d]+/) > -1) {
                ZHAO.tradeDetail(search);
            }
            else if (window.location.href.search(/trade\.taobao\.com\/trade\/pay_success/) > -1) {
                // 交易成功跳转至已买到宝贝页
				window.location.href = 'http://unit.buyer.trade.taobao.com/trade/itemlist/list_bought_items.htm';
                //window.location.href = 'http://trade.taobao.com/trade/itemlist/list_bought_items.htm';
            }
            
            clearInterval(timer);
        }
    }, 100);
}());