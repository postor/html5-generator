app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                if(changeEvent.target.files&&changeEvent.target.files.length){
                    var file = changeEvent.target.files[0];
                    if(file.size && file.size<1024){
                        useDataUri(file);
                    }else{
                        useUpload(file);
                    }
                }

                function useDataUri(f){
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    };
                    reader.readAsDataURL(f);
                }

                function useUpload(f){
                    var formData = new FormData();
                    formData.append('img', f); 
                    $.ajax({
                        url: '/upload',
                        data: formData,
                        type: 'POST',
                        // THIS MUST BE DONE FOR FILE UPLOADING
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        success: function(data){
                            if(data.err){
                                alert('上传失败:'+data.err)
                            }else{
                                scope.$apply(function () {
                                    scope.fileread = data.url;
                                });
                            }
                        },
                        error: function(xhr,status,err){
                            alert('上传失败:'+err)
                        }
                    })
                }
                
            });
        }
    };
}]);