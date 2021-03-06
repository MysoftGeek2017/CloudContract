﻿/// <reference path="../App.js" />

(function () {
	"use strict";

	$(function () {
	    loadTemplates();

	    loadContracts();

		$('#template-list').on('click', '.edit-button', editTemplate);
		$('#template-list').on('click', '.create-contract', createContract);
		$('#contract-list').on('click', '.edit-contract', editContract);
	})

	// 每次加载新页面时均必须运行初始化函数
	Office.initialize = function (reason) {
		$(document).ready(function () {
			app.initialize();


		});
	};

	// 编辑模板
	function editTemplate(event) {
		var target = event.target;
		var templateName = $(target).closest('li').attr('data-id');

		document.location.href = "/template/edit.aspx?templateGuid=" + encodeURI(templateName);
	}

	// 根据模板创建合同
	function createContract(event) {
		var target = event.target;
		var templateName = $(target).closest('li').attr('data-id');

		document.location.href = "/contract/create.aspx?templateGuid=" + encodeURI(templateName);
	}

	// 编辑合同
	function editContract(event) {
		var target = event.target;
		var contractGuid = $(target).closest('li').attr('data-id');

		document.location.href = "/contract/edit.aspx?contractGuid=" + encodeURI(contractGuid);
	}
	
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
		var li = $("<li/>")
			.addClass('list-group-item')
			.attr('data-id', item.ContractTemplateGUID);

		var a = $("<span/>")
			// .attr("href", "javascript:void 0")
			.text(item.TemplateName);
		
		var toolbar = $("<span class='list-item-toolbar'/>");

		var a2 = $("<a/>")
			.addClass('button edit-button')
			.attr("href", "javascript:void 0")
			.text('编辑模板');

		var a3 = $("<a/>")
			.addClass('button create-contract')
			.attr("href", "javascript:void 0")
			.text('新增合同');

		toolbar.append(a2).append(a3);
		li.append(a).append(toolbar);
		return li;
	}

	function loadContracts() {
	    $.post('/contract/get-contracts.aspx')
			.then(function (data) {
			    var ul = $('#contract-list');
			    $.each(data, function (i, item) {
			        ul.append(createContractItem(item));
			    });
			});
	}

	function createContractItem(item) {
	    var li = $("<li/>")
			.addClass('list-group-item')
			.attr('data-id', item.ContractGUID);

	    var a = $("<span/>")
			// .attr("href", "javascript:void 0")
			.text(item.ContractName);

	    var toolbar = $("<span class='list-item-toolbar'/>");

	    var a2 = $("<a/>")
			.addClass('button edit-contract')
			.attr("href", "javascript:void 0")
			.text('加载合同');

	    toolbar.append(a2);
	    li.append(a).append(toolbar);
	    return li;
	}


})();