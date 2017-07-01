(function () {
	"use strict";

	$(function () {
		loadFields();
		//loadContent();

		$("#field-list").on('click', '.list-group-item', insertPosition)
		$("#btn-save").click(save);
	    $("#btn-return").click(function() {
	        app.setContent('');
	        window.location.href = "/index.aspx";
	    });
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


	// 读取模板字段
	function loadFields() {
		$.post('/template/get-fields.aspx')
			.then(function (data) {
				showFields(data);
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

	// 显示模板字段
	function showFields(fieldList) {
		var ul = $("#field-list");

		$.each(fieldList, function (i, item) {

			var li = $("<li/>")
				.addClass('list-group-item')
				.attr('data-id', item.Field)
				//.attr('title', '插入文档占位符')
				.text(item.Text);

			//var a = $("<a/>")
			//	.attr("href", "javascript:void 0")
			//	.text(item)
			//	.appendTo(li);

			ul.append(li);
		});
	}

	// 插入占位符
	function insertPosition(event) {
		var target = event.target;
		var fieldname = $(target).closest('.list-group-item').attr('data-id');
		var fieldText = $(target).closest('.list-group-item').text();

		Word.run(function (context) {
			var body = context.document.body;
			var range = context.document.getSelection();

			var contentControl = range.insertContentControl();
			contentControl.placeholderText = "点击此处录入" + fieldText;
			contentControl.tag = fieldname;
			contentControl.title = fieldText;

			return context.sync().then(function () {
				console.log('插入字段' + fieldText);
			})
		}).catch(function (error) {
			app.showNotification("Error:", JSON.stringify(error));
		})
	}

	function save() {
		var templateGuid = window.QueryString.GetValue('templateGuid');
		Word.run(function (context) {
			var body = context.document.body;
			var bodyXml = body.getOoxml();

			return context.sync().then(function () {
				$.post("/template/update.aspx", {
					TemplateContent: bodyXml.value,
					ContractTemplateGUID: templateGuid
				})
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
	}
}())