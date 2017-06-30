/// <reference path="../App.js" />

(function () {
	"use strict";

	// 每次加载新页面时均必须运行初始化函数
	Office.initialize = function (reason) {
		$(document).ready(function () {
			app.initialize();

			$('#btn-return').click(function () {
				document.location.href = "/index.aspx";
			});

			$(".template-item").click(openTemplate);
		});
	};

	function openTemplate(event) {
		var target = event.target;
		var name = $(target).text();
		
		$.post('/get-template-content.aspx', { name: name })
		.then(function (xml) {
			Word.run(function (context) {
				var body = context.document.body;
				body.clear();
				body.insertOoxml(xml, 'Start');
				return context.sync().then(function () {

				});
			})
			.catch(function (error) {
				app.showNotification("读取模板错误:", JSON.stringify(error));
			})
		})
		.fail(function (error) {
			app.showNotification("读取模板错误:", JSON.stringify(error));
		});
	}

})();