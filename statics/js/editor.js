angular.module('editor', []).controller('editor',function($scope,$http,$element){
  var projectId = $element.attr('data-id');
  $scope.project = {
    pages:[]
  };
  
  $scope.varibles = {
    selectedTab:0,
    selectedPage:0,
    selectedItem:0,
    newItemName:'未命名元素',
    newPageName:'未命名页面'
  };
  
  var getNewId = function(){
    return $scope.project.currentId++;
  };
  
  var correctData = function(){
    (!angular.isArray($scope.project.pages)) || ($scope.project.pages = []);
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
  
  /**
   * 新增页面
   */
  $scope.newPage = function(name){
    var page = {
      id:getNewId(),
      name:name,
      items:[]
    };
    $scope.project.pages.push(page);
  };
  /**
   * 删除页面
   */
  $scope.deletePage = function($index){
    $scope.project.pages.splice($index,1);
  };
  
  /**
   * 新增元素
   */
  $scope.newItem = function(name,page){
    var item = {
      name:name,
    };
    page.items.push(item);
  };
  /**
   * 删除元素
   */
  $scope.deleteItem = function($index,page){
    page.items.splice($index,1);
  };
});