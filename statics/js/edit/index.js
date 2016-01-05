/**
 * @author: joshlin
 * 页面编辑器逻辑
 */
  
  var app = angular.module('animatetool', ['ngRoute','ngResource']);
  
  //routing
  app.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
    .when('/home/', {
      templateUrl: '/statics/js/edit/views/home.html',
      controller: 'homeCtrl'
    })
    .when('/animate/', {
        templateUrl: '/statics/js/edit/views/detail.html',
        controller: 'RouteDetailCtl'
    })
    .otherwise({
      redirectTo: '/home/'
    });
  }]);
  

  
  
  