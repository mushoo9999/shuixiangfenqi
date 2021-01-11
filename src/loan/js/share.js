$(function(){
	var url = location.href;
	if (url.indexOf("#") != -1) {
		url = url.substring(0, url.indexOf("#"));
	}
	$.post(
		"/beadwalletloanapp/weixin/getJssdkSignature.do", 
		{"url": url}, 
		function(data) {
			wx.config({
				debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.result.appId, // 必填，公众号的唯一标识
				timestamp: data.result.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.result.nonceStr, // 必填，生成签名的随机串
				signature: data.result.signature,// 必填，签名
				jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
			});
			
			wx.ready(function(){
				// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				wx.hideMenuItems({
					// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
					menuList: ["menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:facebook", "menuItem:share:QZone"
								"menuItem:editTag", "menuItem:delete", "menuItem:copyUrl", "menuItem:originPage", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email", "menuItem:share:brand"]
				});
				
				wx.onMenuShareTimeline({
					title: '水象分期', // 分享标题
					link: '', // 分享链接
					imgUrl: '' // 分享图标
				});
				
				wx.onMenuShareAppMessage({
					title: '水象分期', // 分享标题
					desc: '', // 分享描述
					link: '', // 分享链接
					imgUrl: '', // 分享图标
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
				});
			});
		},
		"json"
	);
});