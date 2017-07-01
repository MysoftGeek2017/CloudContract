/// <reference path="../App.js" />

(function () {
	"use strict";

	// 每次加载新页面时均必须运行初始化函数
	Office.initialize = function (reason) {
		$(document).ready(function () {
			app.initialize();

			$('.field-insert').click(insertField);
			$('#btn-save').click(save);
		});
	};

	function save() {
		Word.run(function (context) {
			var body = context.document.body;
			var bodyXml = body.getOoxml();

			return context.sync().then(function () {
				$.post("/save-template.aspx", {
					content: bodyXml.value,
					name: '测试模板'
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

	function insertField(event) {
		var target = event.target;
		var fieldname = $(target).text();

		var template = "{{$" + fieldname + "}}";

		Word.run(function (context) {
			var body = context.document.body;
			var range = context.document.getSelection();

			//range = range.insertText(template, 'start');

			//var xml = range.getHtml();
			//return context.sync().then(function () {
			//	console.log('插入字段' + fieldname);
			//	// app.showNotification(xml.value);
			//});
			var contentControl = range.insertContentControl();
			contentControl.placeholderText = "点击此处录入" + fieldname;
			contentControl.tag = fieldname;

			return context.sync().then(function () {
				console.log('插入字段' + fieldname);
				// app.showNotification("插入字段完成：" + fieldname);
			})

		}).catch(function (error) {
			app.showNotification("Error:", JSON.stringify(error));
		})
	}


})();