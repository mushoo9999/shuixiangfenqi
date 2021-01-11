		var loginToken = getLoginToken();
		if (loginToken == null || loginToken == "undefined" || loginToken == "") {
			window.location.href = "login.html";
		}
		// 发送ajax
		$.ajax({
			url : "/beadwalletloanapp/app/borrower/loginCheck.do",
			type : 'post',
			dataType : 'json',
			async : false,
			data : {
				'loginToken' : loginToken
			},
			success : function(obj) {
				var status = obj.code;
				if (status != "000") {
					window.location.href = "login.html";
				}
			}
		});
		
		
	
