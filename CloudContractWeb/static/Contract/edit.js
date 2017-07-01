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

			loadContent();
		});
	};

	// 读取模板内容
	function loadContent() {
		var templateGuid = window.QueryString.GetValue('templateGuid');
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
	function getData() {
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

				app.showNotification(JSON.stringify(value));
			});
		}).catch(function (error) {
			app.showNotification("Error:", JSON.stringify(error));
		});
	}

	function save() {
		getData();
		return;
		
		var contractGuid = window.QueryString.GetValue('ContractGuid');
		Word.run(function (context) {
			var body = context.document.body;
			var bodyXml = body.getOoxml();

			return context.sync().then(function () {
				$.post("/contract/save.aspx", {
					Content: bodyXml.value,
					ContractGuid: contractGuid
				})
				.done(function () {
					app.showNotification("保存成功！");
				})
				.error(function (error) {
					app.showNotification("Error:", JSON.stringify(error));
				});
			})
		}).catch(function (error) {
			app.showNotification("Error:", JSON.stringify(error));
		});
	}
}())