'use strict';

/**
 * @ngdoc function
 * @name itemMirrorAngularDemoApp.controller:ExplorerCtrl
 * @description
 * # ExplorerCtrl
 * Controller of the itemMirrorAngularDemoApp
 */
angular.module('itemMirrorAngularDemoApp')
  .controller('ExplorerCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
