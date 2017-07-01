function saveTemplate() {
    var name = $("#name").getValue();

    if (!name) {
        alert("模板名称不能为空");
    }

    $.post("/template-save.aspx", { Name: name, Content: {} }, function () {
        alert("保存模板成功");
    });
}