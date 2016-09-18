
var snapshot_host = 'http://haodaojia.net/';
var snapshot_href = window.location.href;
var snapshot_timestamp = new Date().getTime();

function snapshot_run(){
    if($('#ctrlselectAdpreviewRegionSelectorcur').size()<=0){
        console.log("Waiting ...");
        return setTimeout(snapshot_run, 3000);
    }
    
    $.get(snapshot_host+'manage/screenshot/gettask', function(data){
        
        console.log('Get task @ ', snapshot_timestamp);
        
        if( typeof data !== "object" )
            return console.log("-=> No task ");
            
        console.log("-=> ", data);

        // 选择区域
        $('#ctrlselectAdpreviewRegionSelectorcur').click();
        var region=data.region;
        var status=true;
        console.log("Region : ", region);
        $('#ctrlselectAdpreviewRegionSelectorlayer .ui_select_item').each(function(){
                $(this).click();
                console.log('search region');
                $('.fc-region-xlayer').removeClass('hide').show();
                $('#ctrlselectAdpreviewRegionSelectorcur').click();
                $('.fc-region-xlayer .region-list li').each(function(){
                    if($(this).html() == region){
                        console.log('Region finded');
                        $(this).click();
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
            console.log('Iframe loaded');
            var html = window.frames["adpreview-frame-pc"].document.getElementsByTagName("HTML")[0].innerHTML;
            
            $.post(snapshot_host+'manage/screenshot/getdata', {'kid': data.id,'html': html,'tid':data.tid}, function(data){
                console.log('Data posted');
                if(data>0){
                    snapshot_timestamp = new Date().getTime();                    
                    $('#Tools_adpreviewResetBtn').click();
                    console.log('Form reseted');
                    return snapshot_run();
                }
            });
        });
        
    }, 'json');
    
}



$(document).ready(function(){

    // 如果不是搜索实况页
    if(!/^http:\/\/fengchao\.baidu\.com\/nirvana\/main.html[\s\S]*~openTools=adpreview[\s\S]{0,}/.test(snapshot_href))
        return console.log('Url not match');
    
    // 10秒检测1次timestamp
    setInterval(function(){
        if($('#ctrltextAdpreviewKeyword').size() > 0){
            if(snapshot_timestamp < (new Date().getTime() - 180000)){
                snapshot_run();
            }
        }
    }, 15000);
    
    // 10分钟点击1次重置按钮
    /*setInterval(function(){
        $('#Tools_adpreviewResetBtn').click();
    },600000);*/
    
    // 绑定事件
    $("#Tools_adpreview").dblclick(snapshot_run);
    $(".tools_head_title").click(snapshot_run);

    // 首次执行
    snapshot_run();
    
    console.log('Start task ...'); 
});
