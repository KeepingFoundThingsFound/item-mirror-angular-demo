'use strict';

/**
 * @ngdoc function
 * @name itemMirrorAngularDemoApp.controller:ExplorerCtrl
 * @description
 * # ExplorerCtrl
 * Controller of the itemMirrorAngularDemoApp
 */
angular.module('itemMirrorAngularDemoApp')
  .controller('ExplorerCtrl', function ($scope, itemMirror) {
  	// starts everything up after dropbox loads
  	var init = itemMirror.initialize;
  	init.then(function() {
      console.log('Everything has initilaized at this point');
      $scope.associations = itemMirror.associations;
      console.log( $scope.associations );
      $scope.mirror = itemMirror;
    });
  });
