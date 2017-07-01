/* 通用应用程序功能 */

var app = (function () {
	"use strict";

	var app = {};

	// 通用初始化函数(每页上都要调用)
	app.initialize = function () {
		$('body').append(
            '<div id="notification-message">' +
                '<div class="padding">' +
                    '<div id="notification-message-close"></div>' +
                    '<div id="notification-message-header"></div>' +
                    '<div id="notification-message-body"></div>' +
                '</div>' +
            '</div>');

		$('#notification-message-close').click(function () {
			$('#notification-message').hide();
		});


		// 初始化后，请公开通用通知函数
		app.showNotification = function (header, text) {
			$('#notification-message-header').text(header);
			$('#notification-message-body').text(text || '');
			$('#notification-message').slideDown('fast');
		};

		// 设置内容
		app.setContent = function (content) {
			Word.run(function (context) {
				var body = context.document.body;
				body.clear();

				if (content && content.length > 0) {
					body.insertOoxml(content, 'Start');
				}

				return context.sync().then(function () {

				});
			}).catch(function (error) {
				app.showNotification("读取模板错误:", JSON.stringify(error));
			});
		}
	};

	return app;
})();

window.QueryString = {
	data: {},
	Initial: function () {
		var aPairs, aTmp;
		var queryString = new String(window.location.search);
		queryString = queryString.substr(1, queryString.length); //remove   "?"     
		aPairs = queryString.split("&");
		for (var i = 0; i < aPairs.length; i++) {
			aTmp = aPairs[i].split("=");
			this.data[aTmp[0]] = aTmp[1];
		}
	},
	GetValue: function (key) {
		return this.data[key];
	}
};
window.QueryString.Initial();


$(function () {
	if ($("#content-footer>.padding").children().length == 0) {
		$("#content-footer").hide();
		$("#content-main").css('bottom', 0);
	}
})