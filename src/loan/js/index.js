$(function () {
    $(".flex button").on("click", function () {
        // $(this).siblings("button").removeClass("on");
        // $(this).removeClass("on").addClass("on");
    });
    var code = getParameter("code");
    var state = getParameter("state");
    // 判断请求是否是从公众号跳转过来
    if (code != null && state == "beadwalletloanapp" && isWeixin()) {
        getOpenIdIndex(code);
    }
	// 判断是否为微信浏览器
	if (isWeixin()) {
		share();
	}
	getChannel();
	getLocation();
    
    var bwId = getUUID();
    var loginToken = getLoginToken();
    if (isExistLogin()) {
        // 成功登录
        $.ajax({// 最近一期工单查询 (过滤掉了1 草稿状态工单)
            type: "post",
            url: "/beadwalletloanapp/app/my/appCheckLogin/findBwOrderByBwId.do",
            dataType: "json",
            data: {
                "bwId": bwId,
                "loginToken": loginToken
            },
            success: function (data) {
                if (data.result != null) {// ****************************有工单信息
                    var statusId = data.result.statusId;// 工单状态
                    var orderId = data.result.id;// 工单ID	
                    var creditLimit=data.result.creditLimit;//借款额度
                    $("#orderId").val(orderId);
                    // -------------------------------------
                    if (statusId == '2'||statusId == '3' ) {// 初审  终审
                    	$("#creditLimit").html("0.0");// 借款额度
                        $("#index2").show();
                    }
                    //---------------------------------------
                    if (statusId == '4') {// 签约
                    	
                    	if (creditLimit == null) {
                            $("#creditLimit").html("0.0");
                        } else {
                            $("#creditLimit").html(creditLimit);// 额度
                        }
                    	
                    	 $("#borrowAmount").val(data.result.borrowAmount);// 借款金额
//                        repayTerm = data.result.repayTerm;// 借款期限
//                        repayType = data.result.repayType;// 还款方式
                        // （1:先息后本
                        // 2:等额本息）
                    	// ////////////
                         $.ajax({
                             type: "post",
                             url: "/beadwalletloanapp/app/my/appCheckLogin/checkBankCardSignByBwId.do",
                             dataType: "json",
                             data: {
                                 "loginToken": loginToken,
                                 "bwId": bwId
                             },
                             success: function (data) {
                                 if (data.code == '000') {
                                   var  signStatus = data.result.signStatus;// 签约状态
                                     $("#sign_status").val(signStatus);//隐藏域 
                                     // 0
                                     // 未签约
                                     // 1已签约
                                     if (signStatus == '0') {
                                         $("#signStatus").html('去签约');
                                     } else {
                                         $("#signStatus").html('确认');
                                     }
                                 }
                             }
                         });
                         // ////////////	          
                        $("#index3").show();

                    }
                    if (statusId == '5' || statusId == '11' || statusId == '12' || statusId == '14') {// 待放款
                        
                    	if (creditLimit == null) {
                            $("#creditLimit").html("0.0");
                        } else {
                            $("#creditLimit").html(creditLimit);// 额度
                        }
                    	
                        var borrowAmount = data.result.borrowAmount;
                        var repayTerm = data.result.repayTerm;
                        var repayType = data.result.repayType;

                        // 填充页面
                        $("#borrowAmount6").html(borrowAmount);
                        $("#repayTerm6").html(repayTerm+'个月');
                        if (repayType == '1') {
                            $("#repayType6").html("先息后本");
                        } else {
                            $("#repayType6").html("等额本息");
                        }

                        // //////////////////
                        // 显示待放款页面
                        $("#index6").show();
                    }
                    if (statusId == '6') {// 结束
                    	$("#creditLimit").html("0.0");
                        $("#index1").show();
                    }
                    if (statusId == '7') {// 拒绝(审核未通过)
                    	 $("#creditLimit").html("0.0");
                        // ////////////
                        $.ajax({
                            type: "post",
                            url: "/beadwalletloanapp/app/reject/record/findBwRejectRecord.do",
                            dataType: "json",
                            data: {
                                "orderId": orderId
                            },
                            success: function (data) {
                                if (data != null) {
                                    // var
                                    // rejectInfo=data.result.rejectInfo;//被拒信息
                                    var rejectType = data.result.rejectType;// 被拒类型
                                    // 0.永久被拒
                                    // 1.非永久被拒
                                    var createTime = data.result.createTime-24*60*60*1000;// 再次申请借款的限制时间(文档以createTime为准)
                                    // 填充页面
                                    var date =new Date(createTime);
                                    if (rejectType == '0') {
                                        $("#rejectInfo").html("系统评分不足");
                                    } else {
                                        $("#rejectInfo").html("系统评分不足,请于"+ dateAdd("m", 3, date).format("yyyy-MM-dd")+ "后再次申请");
                                    }
                                }
                            }
                        });
                        // ////////////
                        // 2显示审核未通过页面
                        $("#index4").show();
                    }
                    if (statusId == '8') {// 撤回
                    	
                    	$("#creditLimit").html("0.0");
                        $("#index1").show();
                    }
                    if (statusId == '9') {// 还款中
                    	
                    	if (creditLimit == null) {
                            $("#creditLimit").html("0.0");
                        } else {
                            $("#creditLimit").html(creditLimit);// 额度
                        }
                        // ////////////
                        $.ajax({
                            type: "post",
                            url: "/beadwalletloanapp/app/my/appCheckLogin/findBwRepaymentPlanByOrderId.do",
                            dataType: "json",
                            data: {
                                "orderId": orderId,
                                "loginToken": loginToken
                            },
                            success: function (data) {
                                if (data != null) {
								    var repayTime = data.result.repay_time;// 下一个还款日
                                    var repayMoney = data.result.repay_money;// 还款金额
                                    // 填充页面
                                    $("#repayTime7").html( longToDate(repayTime, 'yyyy-MM-dd'));
                                    $("#repayMoney7").html(repayMoney+"元");
                                }

                            }
                        });
						 // ////////////			
						//$("#borrowAmount7").html(data.result.borrowAmount);// 借款金额
                        $("#repayTerm7").html(data.result.repayTerm+"个月");// 借款期限
                         if (data.result.repayType == '1') {// 还款方式（1：先息后本 2：等额本息）
                             $("#repayType7").html("先息后本");
                         } else {
                             $("#repayType7").html("等额本息");
                         }
						
                        // 显示还款中界面
                        $("#index7").show();
                    }

                    if (statusId == '13') {// 逾期
                    	
                    	if (creditLimit == null) {
                            $("#creditLimit").html("0.0");
                        } else {
                            $("#creditLimit").html(creditLimit);// 额度
                        }
                        // ////////////
                        $.ajax({
                            type: "post",
                            url: "/beadwalletloanapp/app/repay/appCheckLogin/queryOverdueRecord.do",
                            dataType: "json",
                            data: {
                                "orderId": orderId,
                                "loginToken": loginToken
                            },
                            success: function (data) {
                                if (data != null) {

                                    var overdueDay = data.result.overdueDay;// 逾期时间
                                    var overdueAccrualMoney = data.result.overdueAccrualMoney;// 罚息
                                    var repayMoney = data.result.repayMoney;// 正常还款金额
                                    var borrowAmonunt = data.result.borrowAmonunt;// 逾期金额
                                    var totalMoney = repayMoney+ overdueAccrualMoney;// 还款总额
                                    // 填充页面
                                    $("#overdueDay5").html(overdueDay + "天");// 逾期时间
                                    $("#overdueAccrualMoney5").html(overdueAccrualMoney);// 罚息
                                    $("#borrowAmonunt5").html(borrowAmonunt);// 逾期金额
                                    $("#totalMoney5").html(totalMoney);// 还款总额
                                }
                            }
                        });
                        // ////////////
                        // 显示逾期界面
                        $("#index5").show();
                    }
                    // ////////////////////////////
                } else {// 无工单信息
                    $("#creditLimit").html("0.0");
                    $("#index1").show();
                }

            }
        });
    } else {
        // 失败
        $("#creditLimit").html("0.0");
        $("#index1").show();
    }

});

// 获取openID并自动登录
function getOpenIdIndex(code) {
	$.ajax({
        url: "/beadwalletloanapp/weixin/getOpenIdIndex.do",
        type: "post",
        dataType: "json",
        async: false,
        data: {"code" : code},
        success: function () {
            $.ajax({url: "/beadwalletloanapp/app/borrower/weiXinIndex.do", type: "post", async: false});
        }
    });
	/*$.post("/beadwalletloanapp/weixin/getOpenIdIndex.do", {"code": code}, function(res){
		if (res.code == "000") {
			$.post("/beadwalletloanapp/app/borrower/weiXinIndex.do");
		}
	});*/
}

// 分享
function share() {
	var url = location.href;
	if (url.indexOf("#") != -1) {
		url = url.substring(0, url.indexOf("#"));
	}
	$.post(
		"/beadwalletloanapp/weixin/getJssdkSignature.do", 
		{"url": url}, 
		function(data) {
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.result.appId, // 必填，公众号的唯一标识
				timestamp: data.result.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.result.nonceStr, // 必填，生成签名的随机串
				signature: data.result.signature,// 必填，签名
				jsApiList: ["getLocation", "hideMenuItems", "onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
			});
			
			wx.ready(function(){
				/*var code = getParameter("code");
				var state = getParameter("state");
				// 判断请求是否是从公众号跳转过来
				if (code != null && state == "beadwalletloanapp") {
					// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
					wx.getLocation({
						type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						success: function (res) {
							var geocoder = new qq.maps.Geocoder(
									{
										complete: function (
												result) {
											var location = result.detail.addressComponents.province
													+ result.detail.addressComponents.city;
											$.post(
															"/beadwalletloanapp/weixin/getLocationIndex.do",
															{
																"location": location
															},
															function (
																	data) {
																if (data.code != "000") {
																	alert("定位失败");
																}
															},
															"json");
										}
									});
							var latLng = new qq.maps.LatLng(
									res.latitude,
									res.longitude);
							geocoder.getAddress(latLng);
						},
						fail: function (res) {
							alert("定位失败");
						},
						cancel: function (res) {
							alert("定位失败，请允许应用进行定位");
						}
					});
					
				} */
				// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				wx.hideMenuItems({
					// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
					menuList: ["menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:facebook", "menuItem:share:QZone",
								"menuItem:editTag", "menuItem:delete", "menuItem:copyUrl", "menuItem:originPage", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email", "menuItem:share:brand"]
				});
				
				wx.onMenuShareTimeline({
					title: '水象分期', // 分享标题
					link: 'https://www.beadwallet.com/loanpage/fenxiang.html', // 分享链接
					imgUrl: 'https://www.beadwallet.com/app/loanh5/images/fenqi_wxfx_logo.png' // 分享图标
				});
				
				wx.onMenuShareAppMessage({
					title: '水象分期', // 分享标题
					desc: '嗨翻双11，没钱怎么行？水象分期让您放肆买，轻松贷！马上申请!', // 分享描述
					link: 'https://www.beadwallet.com/loanpage/fenxiang.html', // 分享链接
					imgUrl: 'https://www.beadwallet.com/app/loanh5/images/fenqi_wxfx_logo.png', // 分享图标
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
				});
			});
		},
		"json"
	);
}

// 获得渠道号
function getChannel() {
	var cid = getParameter("cid");
	if (cid != null) {
		$.post("/beadwalletloanapp/app/borrower/getChannel.do", {channelCode : cid});
	}
}

// 定位
function getLocation() {
	new qq.maps.Geolocation("QGUBZ-QLYKK-H6YJQ-A4ZK7-R2OC7-6EFUT", "H5").getLocation(function(pos) {
		var location = pos.province + "-" + pos.city;
		$.post("/beadwalletloanapp/weixin/getLocationIndex.do", {"location": location}, function(data) {
			if (data.code != "000") {
				//alert("定位失败");
			}
		},"json");
	},function(err){
		//alert("定位失败");
	});
}

// 是否存在登录
function isExistLogin() {
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

// 我要借款
function borrowMoney() {
    var bwId = getUUID();// 用户id
    var loginToken = getLoginToken();// 登录token
    if (isExistLogin()) {
    	//**********1登录成功************************************
    	/////////当前城市是否支持借款////////////
    	new qq.maps.Geolocation("QGUBZ-QLYKK-H6YJQ-A4ZK7-R2OC7-6EFUT", "H5").getLocation(function(pos) {
    		 $.ajax({
                 type: "post",
                 url: "/beadwalletloanapp/app/cityCheck/appCheckLogin/cityCheck.do",
                 dataType: "json",
                 data: {
                     "loginToken": loginToken,
                     "cityName": pos.city
                 },
                 success: function (data) {
                     if (data.code!= "000") {//不支持借款
                        alert(data.msg);
                     }else{//支持借款
                    	 //----------------------------
                    	 // //////////////////生成空白订单
                         $.ajax({
                             type: "post",
                             url: "/beadwalletloanapp/app/my/appCheckLogin/generateBwOrderForAuthThird.do",
                             dataType: "json",
                             data: {
                                 "loginToken": loginToken,
                                 "bwId": bwId,
                                 "channel": "4"
                             },
                             success: function (data) {
                                 if (data.code == "000") {
                                     var orderId = data.result.orderId;
                 					$.post("/beadwalletloanapp/app/my/appCheckLogin/findBwBorrowerByBwId.do",
                                         {
                                             "loginToken": loginToken,
                                             "bwId": bwId
                                         }, function (data) {
                 						    if(data.result){
                 								var authStep = data.result.authStep;
                 								if (authStep == '1') {// 个人认证
                 									location.href = "gerenxinxi.html?orderId="+ orderId;
                 								} else if (authStep == '2') {// 工作认证
                 									location.href = "gongzuoxinxi.html?orderId="+ orderId;
                 								} else if (authStep == '3') {// 运营商               
                 									location.href = "yunyingshang.html?orderId="+ orderId;
                 								} else if (authStep == '5') {// 社保            
                 									location.href = "renzheng.html?orderId="+ orderId;
                 								}
                 							 }	  
                 					}, "json");
                                 }
                             }
                         });
                    	 //----------------------------
                     }
                 }
             });	
    	},function(err){
    		alert("定位失败,请尝试开启应用定位权限并清理缓存后重新进入!");
    	});	
    //**********************************************
    } else {
        // 2未登录
        window.location.href = "login.html";
    }
}

// 签约
function sign() {
	 if(isExistLogin()){//登录成功
	     //是否勾选同意条款
	    var agree=$("input[type='checkbox']").is(':checked');
         if(!agree){
		   alert("请勾选借款协议");
          return false; 
         }
		 var orderId = $("#orderId").val();
		$.ajax({//修改还款方式和借款时间
			type: "post",
			url: "/beadwalletloanapp/app/my/appCheckLogin/updateBwOrderAttrByOrderId.do",
			dataType: "json",
			data: {
				"orderId":orderId,
				"loginToken": getLoginToken(),
				"orderTerm": "1",
				"repayType": "1"
			},
			success: function (data) {
				if (data.code == '000') {
				////////////////////////////////////////////
					var signStatus=$("#sign_status").val();//获取隐藏
					if (signStatus == '0') {//未签约
					// ////////////借款人基本信息
						$.ajax({
							type: "post",
							url: "/beadwalletloanapp/app/my/appCheckLogin/findBwBorrowerByBwId.do",
							dataType: "json",
							data: {
								"loginToken": getLoginToken(),
								"bwId": getUUID()
							},
							async: false,
							success: function (data) {
								if (data.code == '000') {
									var phone = data.result.phone;
									location.href = "sign_agreemment.html?orderId=" + orderId+ "&signStatus=0&phone=" + phone + "&borrowAmount="+  $("#borrowAmount").val() + "&repayTerm=1&repayType=1";
								}
							}
						});             
					} else {//已经签约
						alert("签约成功");
						location.href="index.html"
					}
					////////////////////////////////////////////
				}else{
					alert("系统异常")
				}
			}
		}); 
		   
		 
	 }else{// 2登录失败
	     window.location.href = "login.html"; 
	 }
    
}

// 立即还款
function nowPayMoney() {
    var orderId = $("#orderId").val();
     if(isExistLogin()){
    	 window.location.href = "repay_late.html?orderId=" + orderId; 
     }else{
    	 window.location.href = "login.html";  
     }
    
}

// 正常还款
function repayment() {
    var orderId = $("#orderId").val();
    if(isExistLogin()){
		window.location.href = "repayment.html?orderId=" + orderId;
    }else{
		window.location.href = "login.html";  
    }
   
}

// 提前还款
function repay_early() {
    var orderId = $("#orderId").val();
    if(isExistLogin()){
		window.location.href = "repay_early.html?orderId=" + orderId;
    }else{
		window.location.href = "login.html";  
    }
}

// 提示
function showMessage() {
    alert("3月借款正在逐步开放中,请保持关注哦~~");
}