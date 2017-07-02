(function () {
	"use strict";

	$(function () {
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
		$.post('/contract/get-contract.aspx',
			{ contractGuid: contractGuid })
			.then(function (data) {
				app.setContent(data.ContractContent);
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

	    $.post('/contract/get-terms.aspx',
			{ contractGuid: contractGuid })
			.then(function (data) {
			    showTerms(data, "term-list");
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
		// 合同主要信息
		var value = {};
		// 合同条款
		var terms = [];
		Word.run(function (context) {
			var body = context.document.body;
			var allContentControl = body.contentControls;
			allContentControl.load('text,tag');

			return context.sync().then(function () {

				$.each(allContentControl.items, function (i, item) {
					var tag = item.tag;
					var text = item.text;

					if (tag.startsWith('terms.')) {
						terms.push({
							TermToField: tag.substr(6),
							TermContent: text
						});
					}
					else {
						value[tag] = text;
					}
				});

				if (typeof callback === 'function')
					callback(value, terms);
			});
		}).catch(function (error) {
			app.showNotification("Error:", JSON.stringify(error));
		});
	}

	function save() {
		getData(function (data, terms) {
			data.ContractGUID = window._contractGuid;


	        var contractGuid = window.QueryString.GetValue('ContractGuid');
	        Word.run(function(context) {
	            var body = context.document.body;
	            var bodyXml = body.getOoxml();


	            return context.sync().then(function() {
	                data.ContractContent = bodyXml.value;

					$.post("/contract/save.aspx",
						{
							data: JSON.stringify({
								contract: data,
								terms: terms
							})
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
	            });
	        }).catch(function(error) {
	            app.showNotification("Error:", JSON.stringify(error));
	        });
	    });
	}

    // 显示合同条款
	function showTerms(fieldList, divid) {
	    var ul = $("#" + divid);

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
}())