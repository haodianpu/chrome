$(document).ready(function(){
    var host = 'http://app.jiazhen.com/';
    var href = window.location.href;
    //如果是首页
    if(/^https:\/\/tuiguang.baidu.com\/home\.html.*/.test(href)){
        setTimeout(function(){
            window.location.reload();
        },20000);
    }

    //如果是搜索实况页
    if(/^http:\/\/fengchao\.baidu\.com\/nirvana\/main.html[\s\S]*~openTools=adpreview[\s\S]{0,}/.test(href)){
        console.log('start');
        var timestamp = new Date().getTime();
        setInterval(function(){
            if($('#ctrltextAdpreviewKeyword').size() > 0){
                if(timestamp < new Date().getTime() - 30000){
                    run();
                }
            }
        }, 10000);

        function run(){
            $.get(host+'manage/screenshot/gettask', function(data){
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
                            $('.fc-region-xlayer').removeClass('hide').show();
                            $('#ctrlselectAdpreviewRegionSelectorcur').click();
                            $('.fc-region-xlayer .region-list li').each(function(){
                                if($(this).html() == region){
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

                    setTimeout(function(){
                        var html = window.frames["adpreview-frame-pc"].document.getElementsByTagName("HTML")[0].innerHTML;
                        $.post(host+'manage/screenshot/getdata', {'kid': data.id,'html': html,'tid':data.tid}, function(data){
                            if(data>0){
                                timestamp = new Date().getTime();
                                run();
                            }
                        });
                    }, 5000);
                }
            }, 'json');
            console.log(new Date(timestamp));
        }
    }
});