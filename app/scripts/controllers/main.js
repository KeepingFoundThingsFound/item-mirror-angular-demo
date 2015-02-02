'use strict';

/**
 * @ngdoc function
 * @name itemMirrorAngularDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the itemMirrorAngularDemoApp
 */
angular.module('itemMirrorAngularDemoApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
