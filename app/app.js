'use strict';

angular.module('wayTracker', [
  'ngRoute',
  'wayTracker.map'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/map'});
}]);
