(function() {
    'use strict';

    angular.module('app', ['ui.router','app.home','app.matrix','app.directive'])
        .config(MatrixConfig);
    MatrixConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function MatrixConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            })
            .state('matrix', {
                url: '/matrix',
                templateUrl: 'matrixchart.html',
                controller: 'MatrixController',
                controllerAs: 'vm'
            });
    }

})();