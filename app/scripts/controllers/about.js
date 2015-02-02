'use strict';

/**
 * @ngdoc function
 * @name itemMirrorAngularDemoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the itemMirrorAngularDemoApp
 */
angular.module('itemMirrorAngularDemoApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
