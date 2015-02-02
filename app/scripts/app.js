'use strict';

/**
 * @ngdoc overview
 * @name itemMirrorAngularDemoApp
 * @description
 * # itemMirrorAngularDemoApp
 *
 * Main module of the application.
 */
angular
  .module('itemMirrorAngularDemoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mgcrea.ngStrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
