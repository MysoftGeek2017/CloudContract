(function() {
    "use strict";

    // 每次加载新页面时均必须运行初始化函数
    Office.initialize = function(reason) {
        $(document).ready(function() {
            app.initialize();
            
            $("#btn-save").click(saveTemplate);
        });
    };

    function saveTemplate() {
        var name = $("#name").val();

        if (name === "") {
            app.showNotification("模板名称不能为空");
            return;
        }

        $.post("/template-save.aspx", { Name: name })
            .done(function() {
                app.showNotification("保存成功！");
            })
            .error(function(error) {
                app.showNotification("Error:", JSON.stringify(error));
            });
    }
})();