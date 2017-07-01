/// <reference path="../App.js" />

(function () {
    "use strict";

    // 每次加载新页面时均必须运行初始化函数
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            $('#get-data-from-selection').click(getDataFromSelection);
            $('#get-all-data').click(getAllData);
            $('#get-all-data2').click(getOoXml);
            $('#set-data').click(setData);
        });
    };

    // 从当前选择的文档中读取数据并显示通知
    function getDataFromSelection() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    app.showNotification('选定的文本为:', '"' + result.value + '"');
                } else {
                    app.showNotification('错误:', result.error.message);
                }
            }
        );
    }

    function getAllData() {
    	Office.context.document.getFileAsync(Office.FileType.Compressed, { sliceSize: 65536 /*64 KB*/ },
			function (result) {
				if (result.status == "succeeded") {
					// If the getFileAsync call succeeded, then
					// result.value will return a valid File Object.
					var myFile = result.value;
					var sliceCount = myFile.sliceCount;
					var slicesReceived = 0, gotAllSlices = true, docdataSlices = [];
					app.showNotification("File size:" + myFile.size + " #Slices: " + sliceCount);

					// Get the file slices.
					getSliceAsync(myFile, 0, sliceCount, gotAllSlices, docdataSlices, slicesReceived);
					
				}
				else {
					app.showNotification("Error:", result.error.message);
				}
			});
    }



    function getSliceAsync(file, nextSlice, sliceCount, gotAllSlices, docdataSlices, slicesReceived) {
    	file.getSliceAsync(nextSlice, function (sliceResult) {
    		if (sliceResult.status == "succeeded") {
    			if (!gotAllSlices) { // Failed to get all slices, no need to continue.
    				return;
    			}

    			// Got one slice, store it in a temporary array.
    			// (Or you can do something else, such as
    			// send it to a third-party server.)
    			docdataSlices[sliceResult.value.index] = sliceResult.value.data;
    			if (++slicesReceived == sliceCount) {
    				// All slices have been received.
    				file.closeAsync();
    				onGotAllSlices(docdataSlices);
    			}
    			else {
    				getSliceAsync(file, ++nextSlice, sliceCount, gotAllSlices, docdataSlices, slicesReceived);
    			}
    		}
    		else {
    			gotAllSlices = false;
    			file.closeAsync();
    			app.showNotification("getSliceAsync Error:", sliceResult.error.message);
    		}
    	});
    }
    function onGotAllSlices(docdataSlices) {
    	var docdata = [];
    	for (var i = 0; i < docdataSlices.length; i++) {
    		docdata = docdata.concat(docdataSlices[i]);
    	}

    	var contentString = btoa(docdata);

    	//var fileContent = new String();
    	//for (var j = 0; j < docdata.length; j++) {
    	//	fileContent += String.fromCharCode(docdata[j]);
    	//}
		
    	app.showNotification("读取文件内容完成:" + contentString.length);
    	// Now all the file content is stored in 'fileContent' variable,
    	// you can do something with it, such as print, fax...

    	window._savedData = contentString;
    }

	function getOoXml() {

		Word.run(function (context) {
			var body = context.document.body;
			var bodyOOXML = body.getOoxml();
			return context.sync().then(function () {
				window._OoXml = bodyOOXML.value;

				app.showNotification("读取文件内容完成，长度:" + window._OoXml.length);
			});
		})
	}

    function setData() {
    	Word.run(function (context) {
    		var body = context.document.body;
    		body.insertOoxml(window._OoXml, "End");
    		return context.sync()
    			.catch(function (ex) {
    				app.showNotification("错误:" + ex);
    			});
    	})
    }
})();