angular.module('editor', ['collpase']).controller('editor',function($scope,$http,$element){
  var projectId = $element.attr('data-id');
  $scope.project = {
    pages:[{index:0,items:[]}],
    pageCount: 1,
    currentPage: 0
  };
  var correctData = function(){
    $scope.project.pageCount = $scope.project.pageCount || 1;
    $scope.project.currentPage = $scope.project.currentPage || 0;
    if(!angular.isArray($scope.project.pages) || $scope.project.pages.length ===0){
      $scope.project.pages = [{index:0,items:[]}];
    }
  };
    
  
  $http({
    method: 'GET',
    url: "/json/"+ projectId
  }).success(function(result) {
    $scope.project = result.data;
    correctData();
  }).error(function(data, status) {
    console.log([data,status]);
    alert('数据获取失败！');
  });  
  
  $scope.save = function(){
    $http({
      method: 'POST',
      url: "/json/"+ projectId,
      data: $scope.project
    }).success(function(result) {
      alert('保存成功');
    }).error(function(data, status) {
      console.log([data,status]);
      alert('保存失败！');
    });
  };
  
  $scope.$watch('project.pageCount',function(newValue){
    if($scope.project.pages.length === newValue) return;
    for(var i=0;i<newValue;i++){
      $scope.project.pages[i] = $scope.project.pages[i] || {items:[]};
      $scope.project.pages[i].index = i;
    }
    if(newValue<$scope.project.currentPage){
      $scope.project.currentPage = 0;
    }
  });
});