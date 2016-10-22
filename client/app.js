var app = angular.module('Octofeels', ['ngRoute','ui.bootstrap'])

.config(function($routeProvider, $locationProvider) {

  $routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'pages/home.html',
			controller: 'feelCtrl'
		})

		.otherwise({templateUrl: 'pages/404.html'})

		// use the HTML5 History API to get the pretty urls without a weird /#/ between relevant info
        $locationProvider.html5Mode(true);
});