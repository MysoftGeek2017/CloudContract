(function () {
	"use strict";

	$(function () {
		$("#btn-save").click(save);
		$("#btn-return").click(function () {
			app.setContent('');
			window.location.href = "/index.aspx";
		});
		$("#btn-refresh").click(function () {
			loadTerms();
		})
		//loadTermDefine().then(loadTerms);

		$("#term-list").on('click', '.list-group-item', function (event) {
			gotoTermPosition($(event.target).attr('data-field'));
		})
	});

	// 每次加载新页面时均必须运行初始化函数
	Office.initialize = function (reason) {
		$(document).ready(function () {
			app.initialize();

			if (window._contractGuid == '00000000-0000-0000-0000-000000000000') {
				// 新增模式
				loadTemplate();
				$("#contract-terms").hide();
			}
			else {
				// 编辑模式
				loadContract();

			}
		});
	};

	// 跳转到文档条款位置
	function gotoTermPosition(field) {
		//app.showNotification(field);
		Word.run(function (context) {
			var body = context.document.body;
			var allContentControl = body.contentControls;
			var contentControl = allContentControl.getByTag('terms.' + field);
			context.load(contentControl, 'items');

			return context.sync().then(function () {
				contentControl.items[0].select();
			})
		}).catch(function (error) {
			app.showNotification("Error:", JSON.stringify(error));
		});
	}

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
				window._templateGuid = data.ContractTemplateGUID;
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

		loadTermDefine().then(loadTerms);
	}

	function loadTermDefine() {
		return $.post('/template/get-itemfields.aspx')
			.then(function (data) {
				window._termFields = data;
			})
	}

	function loadTerms() {


		var contractGuid = window._contractGuid;
		$.post('/contract/get-terms.aspx',
			{ contractGuid: contractGuid })
			.then(function (data) {
				showTerms(data, "term-list");
				window._terms = data;
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

					if (tag.indexOf('terms.') == 0) {
						var term = {
							TermToField: tag.substr(6),
							TermContent: text
						};
						term = setTermInfo(term);
						terms.push(term);
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

	function setTermInfo(term) {
		if (window._terms == undefined)
			return term;

		var found = undefined;
		$.each(window._terms, function (i, item) {
			if (item.TermToField == term.TermToField) {
				item.TermContent = term.TermContent;
				found = item;
			}
		});

		return found || term;
	}

	function save() {
		getData(function (data, terms) {
			data.ContractGUID = window._contractGuid;
			data.ContractTemplateGUID = window._templateGuid;

			var contractGuid = window.QueryString.GetValue('ContractGuid');
			Word.run(function (context) {
				var body = context.document.body;
				var bodyXml = body.getOoxml();


				return context.sync().then(function () {
					data.ContractContent = bodyXml.value;

					$.post("/contract/save.aspx",
						{
							data: JSON.stringify({
								contract: data,
								terms: terms
							})
						})
					.done(function (id) {
						app.showNotification("保存成功！");

						window.location.href = '/contract/edit.aspx?contractGuid=' + id;
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
			}).catch(function (error) {
				app.showNotification("Error:", JSON.stringify(error));
			});
		});
	}

	function getTermText(field) {
		var found;
		$.each(window._termFields, function (i, item) {
			var itemfield = item.Field.substr(6);
			if (itemfield == field) {
				found = item;
			}
		})
		
		if (found)
			return found.Text;
		return '';
	}

	// 显示合同条款
	function showTerms(fieldList, divid) {
		var ul = $("#" + divid);
		ul.empty();

		var isAllSuccess = true;

		$.each(fieldList, function (i, item) {

			var li = $("<li/>")
				.addClass('list-group-item')
				.attr('data-id', item.ContractTermGUID)
				.attr('data-field', item.TermToField)
				.attr('title', item.CheckContent);

			var span = $('<span class="label"></span>')
				.text(getTermText(item.TermToField))
				.appendTo(li);

			li.append(' ' + item.TermContent);

			if (item.ApproveStatus === '合规') {
				li.addClass('success');
				span.addClass('label-success');
			}
			else if (item.ApproveStatus === '违规') {
				li.addClass('warning');
				span.addClass('label-danger');
				isAllSuccess = false;
			}
			else {
				li.addClass('default');
				span.addClass('label-default');
				isAllSuccess = false;
			}

			//var a = $("<a/>")
			//	.attr("href", "javascript:void 0")
			//	.text(item)
			//	.appendTo(li);

			ul.append(li);
		});

		//if (isAllSuccess) {
		//	$("#btn-save").hide();
		//}
	}
}())