
'use strict';
function js (){
    var a = document.createElement("script");
    var  page_body = document.querySelector("body");
    a.src="js/jquery-1.11.3.min.js";
    a.type='text/javascript';
      page_body.appendChild(a);
}
//判断微信
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger" && /iphone|ipad|ipod/.test(ua)) {
        return true;
    } else {
        return false;
    }
}
//头部
function head_top() {
    var page_body = document.querySelector("body");
    var header = document.createElement('div');
    var title_ = document.querySelector("head title").innerHTML
    header.className = "head_top font-b";
    header.innerHTML = '<i onclick="history.go(-1)"></i>' + title_;
    if (title_ !== "易秒贷" && title_ !== "社保密码找回")
        page_body.insertBefore(header, page_body.childNodes[0]);
}


function tanchuang(url) {
    var url = url;
    var tan = document.createElement('div');
    tan.setAttribute("id", "tanchuang");
    tan.innerHTML = '<i></i><iframe src=' + url + '></iframe>';
    document.querySelector("body").appendChild(tan);
    document.querySelector("#tanchuang i").onclick = function(e) {
        e.stopPropagation();
        var _this = document.querySelector("#tanchuang");
        _this.parentNode.removeChild(_this);
    }
}

function loader(obj, url,fn) {
    $(obj).load(url, function() {
        if(fn){
        fn();
        }
    })
}
//ready
$(document).ready(function() {
    head_top();
    loader("#jiekuan", "index1.html",function(){
        loader("#huankuan", "repay.html");
    //  loader("#shangcheng", "help-content.html");
    loader("#geren", "account_info.html"); 
    });
   
    $(".nav li").on("touchend", function() {
        var i = $(this).index();
        if (!($(this).is(".active"))) {      
                $(this).siblings("li").removeClass("active").end().addClass("active");
                $("#context>div").eq(i).siblings("div").hide().end().show();
        }
    });
});
//load
window.onload = function() {
    var top_height = $('.head_top').height();
    var body_height = $('body').height();
    var rHeight = body_height - top_height;
    $('.reg-body').height(rHeight);
    $('.forget-body').height(rHeight);
    if (document.documentElement.offsetHeight < 500) {
        $(".swiper-slide").height((document.documentElement.offsetHeight - top_height - $(".nav").height()) * 0.8);
    }
};
