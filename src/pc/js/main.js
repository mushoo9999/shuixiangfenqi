/**

@Author: Jean
@Version: 1.0.0
@Date: 2016-11-26

*/
"use strict";function page_switch(a){function b(a){var a=a;f=f,k=e.find(".page_switch"),1!==f&&(k.find("span").removeClass("disabled"),1==a?k.find("span.prev").addClass("disabled"):a==f&&k.find("span.next").addClass("disabled")),f>9&&k.find("li").each(function(b,d){var e;a>5&&0==b?$(d).text("...").attr("data-index","").addClass("page_no"):a<f-4&&b==c.length-1?$(d).text("...").attr("data-index","").addClass("page_no"):(a>4&&a<f-4?e=a+b-4:a<=4?e=b+1:a>=f-4&&(e=f-8+b),$(d).text(e).attr("data-index",e).removeClass("page_no"))}),e.find("li[data-index="+a+"]").addClass("on").siblings().removeClass("on"),i&&i(a)}var c,d,e=$(a.ob),f=Number(a.page_all),g=a.turn,h=Number(a.start_page)||1,i=a.fn,j=a.dialog,k=$(' <div class="page_switch"><div class="page_wrap"><span class="prev">上一页</span><ul class=""></ul><span class="next">下一页</span></div></div>'),l=$('<div class="page_change"><div class="goPageBox"><i>转到　</i><input  class="page_switch_btn_go_input" /><i>　页</i></div><button class="queding">确定</button></div>');if(e&&f){for(var m=1;m<f+1;m++){if(!(m<10)){k.find("ul li").last().text("...").attr("data-index","").addClass("page_no");break}k.find("ul").append("<li data-index="+m+">"+m+"</li>")}g&&k.append(l),e.append(k),1==f&&k.find("span").addClass("disabled"),c=e.find("li"),isNaN(h)||(d=h,b(h)),c.click(function(){return""!=$(this).attr("data-index")&&(d=Number($(this).attr("data-index")),void b(d))}),e.find(".page_wrap span").click(function(){return void 0!=d&&!$(this).hasClass("disabled")&&(d="上一页"==$(this).text()?Number(e.find("li.on").attr("data-index"))-1:Number(e.find("li.on").attr("data-index"))+1,void b(d))}),e.find(".goPageBox input").focus(function(){e.find(".queding").animate({left:"100%"},300)}).keydown(function(a){var b=a.keyCode;if(console.log(b),13==b)e.find(".queding").click(),$(this).blur();else if(!(47<b&&b<58||95<b&&b<106||8==b))return!1}).blur(function(){e.find(".queding").animate({left:"50%"},300)}),e.find(".queding").click(function(){return d=Number(e.find(".goPageBox input").val()),0==d||d>f?(j&&j(d),e.find(".goPageBox input").val(""),!1):void b(d)})}}