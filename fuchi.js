$(document).ready(function(){
    var host = 'http://fuchi.ytx.la/';
    var href = window.location.href;

    //如果是搜索实况页
    if(/^http:\/\/fengchao\.baidu\.com\/nirvana\/main.html[\s\S]*~openTools=adpreview[\s\S]{0,}/.test(href)){
        console.log('start search.');

        var timestamp = new Date().getTime();
		//10秒检测1次timestamp
        setInterval(function(){
            if($('#ctrltextAdpreviewKeyword').size() > 0){
                if(timestamp < (new Date().getTime() - 300000)){
                    run();
                }
            }
        }, 15000);
		
		//10分钟点击1次重置按钮
		/*setInterval(function(){
			$('#Tools_adpreviewResetBtn').click();
		},600000);*/

        function run(){
			//点击重置
			$('#Tools_adpreviewResetBtn').click();

            $.get(host+'manage/screenshot/gettask', function(data){
				console.log('start get task.');
                if(data){
                    console.log(data);

                    //选择区域
                    $('#ctrlselectAdpreviewRegionSelectorcur').click();
                    var region=data.region;
                    var status=true;
                    console.log(region);
                    
                    $('#ctrlselectAdpreviewRegionSelectorlayer .ui_select_item').each(function(){
                            $(this).removeAttr('onmouseover');
                            $(this).removeAttr('onmouseout');
                            $(this).attr({'onClick':"ui.util.get('AdpreviewRegionSelector').itemOverHandler(this)"});
                            $(this).click();
							console.log('search region');
                            $('.fc-region-xlayer').removeClass('hide').show();
                            $('#ctrlselectAdpreviewRegionSelectorcur').click();
                            $('.fc-region-xlayer .region-list li').each(function(){
                                if($(this).html() == region){
									console.log('finded region');
                                    $(this).click();
                                    $('.fc-region-xlayer').addClass('hide');
                                    status=false;
                                }
                            });
                            if(status==false){
                                return false;
                            }
                    });

                    //填写关键词
                    $('#ctrltextAdpreviewKeyword').val(data.keyword);

                    //提交查询
                    $('#ctrlbuttonAdPreviewSearchBtn').click();
					
					//post数据
					$("#adpreview-frame-pc").load(function(){
						console.log('iframe loaded');
						var html = window.frames["adpreview-frame-pc"].document.getElementsByTagName("HTML")[0].innerHTML;
						
						$.post(host+'manage/screenshot/getdata', {'kid': data.id,'html': html,'tid':data.tid}, function(data){
							console.log('start post data.');
							if(data>0){
								timestamp = new Date().getTime();
								run();
							}
						});
					});
                }
            }, 'json');
            console.log(new Date(timestamp));
        }
    }
});