(function() {
    "use strict";

    $(function() {
        $("#btn-save").click(saveTemplate);

        $("#btn-return").click(function () {
            window.location.href = "/index.aspx";
        });
    });

    // 每次加载新页面时均必须运行初始化函数
    Office.initialize = function(reason) {
        $(document).ready(function() {
            app.initialize();
            
            
        });
    };

    function saveTemplate() {
        $.post("/template-save.aspx", { Name: $("#name").val() })
            .done(function(oid) {
                app.showNotification("保存成功！");
                window.location = "/template/edit.aspx?templateGuid=" + oid;
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
    }
})();