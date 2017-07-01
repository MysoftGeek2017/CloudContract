(function () {
	"use strict";

	$(function () {
		$("#btn-save").click(save);
		$("#btn-return").click(function () {
			app.setContent('');
			window.location.href = "/index.aspx";
		})
	});

	// 每次加载新页面时均必须运行初始化函数
	Office.initialize = function (reason) {
		$(document).ready(function () {
			app.initialize();

			if (window._contractGuid == '00000000-0000-0000-0000-000000000000') {
				// 新增模式
				loadTemplate();
			}
			else {
				// 编辑模式
				loadContract();
			}
		});
	};

	// 读取模板内容
	function loadTemplate() {
		var templateGuid = window._templateGuid;
		$.post('/template/get-template.aspx',
			{ templateGuid: templateGuid })
			.then(function (data) {
				app.setContent(data.TemplateContent);
			})
			.fail(function (error) {
				var message = error.responseText;

				if (message.indexOf("<title>") > -1) {
					message = message.split("<title>")[1];
				}

				if (message.indexOf("</title>") > -1) {
					message = message.split("</title>")[0];
				}

				app.showNotification("错误:", message);
			});
	}


	// 读取合同内容
	function loadContract() {
		var contractGuid = window._contractGuid;
		$.post('/template/get-template.aspx',
			{ templateGuid: templateGuid })
			.then(function (data) {
				app.setContent(data.TemplateContent);
			})
			.fail(function (error) {
				var message = error.responseText;

				if (message.indexOf("<title>") > -1) {
					message = message.split("<title>")[1];
				}

				if (message.indexOf("</title>") > -1) {
					message = message.split("</title>")[0];
				}

				app.showNotification("错误:", message);
			});
	}

	// 从内容中读取到全部的占位符的值
	function getData(callback) {
		var value = {};
		Word.run(function (context) {
			var body = context.document.body;
			var allContentControl = body.contentControls;
			allContentControl.load('text,tag');

			return context.sync().then(function () {

				$.each(allContentControl.items, function (i, item) {
					var tag = item.tag;
					var text = item.text;
					value[tag] = text;
				});

				if (typeof callback === 'function')
					callback(value);
			});
		}).catch(function (error) {
			app.showNotification("Error:", JSON.stringify(error));
		});
	}

	function save() {
		getData(function (data) {
			data.ContractGUID = window._contractGuid;


			var contractGuid = window.QueryString.GetValue('ContractGuid');
			Word.run(function (context) {
				var body = context.document.body;
				var bodyXml = body.getOoxml();

				data.Content = bodyXml;

				return context.sync().then(function () {
					$.post("/contract/save.aspx", data)
					.done(function () {
						app.showNotification("保存成功！");
					})
					.error(function (error) {
						var message = error.responseText;

						if (message.indexOf("<title>") > -1) {
							message = message.split("<title>")[1];
						}

						if (message.indexOf("</title>") > -1) {
							message = message.split("</title>")[0];
						}

						app.showNotification("错误:", message);
					});
				})
			}).catch(function (error) {
				app.showNotification("Error:", JSON.stringify(error));
			});
		})
	}
}())