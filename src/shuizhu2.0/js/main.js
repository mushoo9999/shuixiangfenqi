"use strict"
function page_switch(config) {
        var li,num;
        var ob = $(config.ob),
            page_all = Number(config.page_all),
            turn=config.turn,
            start_page=Number(config.start_page) || 1,
            fn = config.fn,
            dialog=config.dialog,
            str = $(' <div class="page_switch" onselectstart="return false"><div class="page_wrap">' +
                '<span class="prev">上一页</span><ul class="">' +
                '</ul><span class="next">下一页</span><i class="page_all">共 '+page_all+' 页</i></div></div>'),
            str1 = $('<div class="page_change">' +
                '<div class="goPageBox"><i>转到　</i>' +
                '<input  class="page_switch_btn_go_input" />' +
                '<i>　页</i></div><button class="queding">确定</button></div>');
        if (ob && page_all) {
            for (var i = 1; i < page_all + 1; i++) {
                if (i < 10) {
                    str.find("ul").append('<li data-index=' + i + '>' + i + '</li>');
                } else {
                    str.find("ul li").last().text("...").attr("data-index", "").addClass("page_no");
                    break
                }
            };
            if(turn){str.append(str1)}
            ob.append(str);
                if(page_all==1){
                    str.find("span").addClass("disabled")
                }

            li = ob.find("li");
               function go(num) {
                var num = num;page_all=page_all,str=ob.find(".page_switch");
                if(page_all!==1){
                         str.find("span").removeClass("disabled");
                    if(num==1){
                         str.find('span.prev').addClass("disabled");
                    }else if(num==page_all){
                        str.find('span.next').addClass("disabled");
                    }
                }
                    if (page_all > 9) {
                        str.find("li").each(function(i, n) {
                            var start;
                            if (num > 5 && i == 0) {
                                $(n).text("...").attr("data-index", "").addClass("page_no");
                            } else if (num < page_all - 4 && i == li.length - 1) {
                                $(n).text("...").attr("data-index", "").addClass("page_no");
                            } else {
                                if (num > 4 && num < page_all - 4) {
                                    start = num + i - 4;
                                } else if (num <= 4) {
                                    start = i + 1;
                                } else if (num >= page_all - 4) {
                                    start = page_all - 8 + i;
                                }
                                $(n).text(start).attr("data-index", start).removeClass("page_no");
                            }
                        });
                    };
                    ob.find("li[data-index=" + num + "]").addClass("on").siblings().removeClass("on");
                     if (fn) {
                    fn(num);
                }
               }
                 if(!isNaN(start_page)){//初始页面
                    num=start_page;
                    go(start_page);
                }
            li.click(function() {//点击index
                if($(this).attr("data-index")==""){return false}
             num = Number($(this).attr("data-index"));
                go(num);              
            });
            ob.find(".page_wrap span").click(function(){//上一页下一页
                 if(num==undefined || $(this).hasClass("disabled")){return false}

                if($(this).text()=="上一页"){
                    num = Number(ob.find("li.on").attr("data-index"))-1;
                }else{
                    num = Number(ob.find("li.on").attr("data-index"))+1;
                }
                     go(num); 
            });
                ob.find(".goPageBox input").focus(function() {
                    ob.find(".queding").animate({"left":"100%"},300); 
                })
                .keydown(function(e) {
                    var key =e.keyCode;
                    console.log(key)
                   if(key==13){ob.find(".queding").click();
                   $(this).blur();
               }else if((!((47<key && key<58) || (95<key && key<106)|| key==8))){return false};
                })
                .blur(function(){
                    ob.find(".queding").animate({"left":"50%"},300);
                }); 
                ob.find(".queding").click(function(){
                        num =Number(ob.find(".goPageBox input").val());
                        if(num==0||num>page_all){
                            if(dialog){
                                dialog(num);
                            }
                            ob.find(".goPageBox input").val("");
                                return false
                        };
                        go(num);
                });

        }
    }