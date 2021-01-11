// ajax全局设置
try {
	/* $.ajaxSetup({
		beforeSend : function() {
			showLoading();
		},
		complete : function() {
			hideLoading();
		}
	}); */
	$(document).ajaxStart(function() {
		showLoading();
	});
	$(document).ajaxStop(function() {
		hideLoading();
	});
} catch(err){}

// 显示加载遮罩
function showLoading(){
	// 判断页面是否加载完成
	if (document.getElementsByTagName('body')[0] != null) {
		// 判断加载遮罩是否已创建
		if (document.getElementById('loading') == null) {
			var body = document.getElementsByTagName('body')[0];
			var loading = document.createElement('div');
			loading.className = 'loading';
			loading.setAttribute('id','loading');
			var intro = document.createElement('p');
			intro.className = 'lintro';
			var intro_txt = document.createTextNode('正在加载中...');

			body.appendChild(loading);
			loading.appendChild(intro);
			intro.appendChild(intro_txt);
			
		} 
		document.getElementById('loading').style.display = 'block';
	}
}

// 隐藏加载遮罩
function hideLoading(){
	// 判断页面是否加载完成
	if (document.getElementById('loading') != null) {
		var loading = document.getElementById('loading');
		loading.style.display = 'none';
	}
}

//读取cookies 
function getCookie(name) { 
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]); 
	else 
		return null; 
}
// 获取用户uuid
function getUUID() {
	return getCookie("cookie_uuid");
}
// 获取用户logintoken
function getLoginToken() {
	return getCookie("cookie_token");
}

// 工单是否结束
function isEnd(id){
	 // 发送ajax
	$.ajax({
		url : "/beadwalletloanapp/app/my/appCheckLogin/findBwOrderByBwId.do",
		type : 'post',
		dataType : 'json',
		data : {'loginToken' : getLoginToken(),'bwId' : getUUID()},
		success : function(obj) {
			var status = obj.code;
			if (status == "000") {	
				var result = obj.result;
				if(!result || result.statusId == 6 || result.statusId == 8){
					$("#"+id).removeClass('disable');
					$("#"+id).removeAttr("disabled");
				}else{
					alert("您有一笔借款正在进行中，请不要重复提交信息。");
				}
			}
		}
	});
}

//根据id获取name
function getStatusName(statusId){
	if(statusId==1){
		return "草稿";
	}else if(statusId==2||statusId==3){
		return "审核中";
	}else if(statusId==4){
		return "签约";
	}else if(statusId==5||statusId==11||statusId==12||statusId==14){
		return "待放款";
	}else if(statusId==6){
		return "结束";
	}else if(statusId==7){
		return "审核未通过";
	}else if(statusId==8){
		return "撤回";
	}else if(statusId==9){
		return "还款中";
	}else if(statusId==10){
		return "";
	}else if(statusId==13){
		return "逾期";
	}
}

// 获取请求参数
function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return decodeURI(r[2]);
    }
    return null;
}
//金额
function toAmount(amount){
	if(amount==null||amount==''||amount==0){
		return "0.0";
	}
	return amount;
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function(fmt){ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
//时间long转Date
function longToDate(long,formatStr){
	if(long!=null && long!=''){
		return new Date(long).format(formatStr);
	}else{
		return "";
	}
}
//日期追加天数、月数、年数
function dateAdd(interval, number, date) {
	/*
	*   功能:实现VBScript的DateAdd功能.
	*   参数:interval,字符串表达式，表示要添加的时间间隔.
	*   参数:number,数值表达式，表示要添加的时间间隔的个数.
	*   参数:date,时间对象.
	*   返回:新的时间对象.
	*   var   now   =   new   Date();
	*   var   newDate   =   DateAdd("d",5,now);
	*---------------   DateAdd(interval,number,date)   -----------------
	*/
	switch (interval) {
		case"y":
			{
				date.setFullYear(date.getFullYear() + number);
				return date;
				break;
			}
		case"q":
			{
				date.setMonth(date.getMonth() + number * 3);
				return date;
				break;
			}
		case"m":
			{
				date.setMonth(date.getMonth() + number);
				return date;
				break;
			}
		case"w":
			{
				date.setDate(date.getDate() + number * 7);
				return date;
				break;
			}
		case"d":
			{
				date.setDate(date.getDate() + (number-1));
				return date;
				break;
			}
		case"h":
			{
				date.setHours(date.getHours() + number);
				return date;
				break;
			}
		case"m":
			{
				date.setMinutes(date.getMinutes() + number);
				return date;
				break;
			}
		case"s":
			{
				date.setSeconds(date.getSeconds() + number);
				return date;
				break;
			}
		default:
			{
				date.setDate(d.getDate() + number);
				return date;
				break;
			}
	}
}
// 常用验证
// val-要验证的值
// rule-验证规则，如果不支持当前规则，则返回失败。
function validate(val, rule) {
	var reg;
	if (rule == "digits") {// 数字
		reg = /^\d+$/;
	} else if (rule == "letters"){// 字母
		reg = /^[a-z]+$/i;
	} else if (rule == "date"){// 日期，格式:yyyy-mm-dd
		reg = /^\d{4}-\d{2}-\d{2}$/;
	} else if (rule == "time"){// 时间，00:00到23:59之间
		reg = /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/;
	} else if (rule == "email"){// 邮箱
		reg = /^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i;
	} else if (rule == "url"){// 网址
		reg = /^(https?|s?ftp):\/\/\S+$/i;
	} else if (rule == "qq"){// QQ号码
		reg = /^[1-9]\d{4,}$/;
	} else if (rule == "IDcard"){// 身份证号码
		reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
	} else if (rule == "tel"){// 电话号码
		reg = /^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/;
	} else if (rule == "mobile"){// 手机号
		reg = /^1[3-9]\d{9}$/;
	} else if (rule == "zipcode"){// 邮编
		reg = /^\d{6}$/;
	} else if (rule == "chinese"){// 汉字
		reg = /^[\u0391-\uFFE5]+$/;
	} else if (rule == "chineseName"){// 姓名
		reg = /^[\u0391-\uFFE5]{2,6}$/;
	} else if (rule == "password"){// 密码，6-16位字符，不能包含空格
		reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
	}else if (rule == "bankcard"){ //银行卡号
		reg = /^(\d{16}|\d{19})$/;	
	}else {
		return false;
	}
	return reg.test(val);
}
// 判断是否为微信浏览器
function isWeixin() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
}
// 判断是否为QQ浏览器
function isQQ() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/QQBrowser/i) == "qqbrowser") {
		return true;
	} else {
		return false;
	}
}
// String去除空格
String.prototype.trim = function(){   
	return this.replace(/(^\s*)|(\s*$)/g, "");   
}

// 是否存在登录
function isExistLoginRZ() {
    var loginToken = getLoginToken();
    if (loginToken == null || loginToken == "undefined" || loginToken == "") {
        return false;
    }

    var isExist = false;
    $.ajax({
        url: "/beadwalletloanapp/app/borrower/loginCheck.do",
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            'loginToken': loginToken
        },
        success: function (obj) {
            var status = obj.code;
            if (status = "000") {
                isExist = true;
            }
        }
    });
    return isExist;
}
