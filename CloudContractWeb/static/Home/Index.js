/// <reference path="../App.js" />

(function () {
	"use strict";

	$(function () {
		loadTemplates();
	})

	// 每次加载新页面时均必须运行初始化函数
	Office.initialize = function (reason) {
		$(document).ready(function () {
			app.initialize();


		});
	};
	
	function loadTemplates() {
		$.post('/template/get-templates.aspx')
			.then(function (data) {
				var ul = $('#template-list');
				$.each(data, function (i, item) {
					ul.append(createTemplateItem(item));
				});
			});
	}

	function createTemplateItem(item) {
		var li = $("<li/>");

		li.append($("<a/>")
			.attr("href", "javascript:void 0")
			.text(item.TemplateName));

		return li;
	}
})();