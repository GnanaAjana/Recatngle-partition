(function() {
    'use strict';

    angular.module('app.matrix', [])
        .controller('MatrixController', MatrixController);

    MatrixController.$inject = ['$scope', '$window', '$state'];

    function MatrixController($scope, $window, $state) {
        $scope.values = [];
        var matrixdata = $window.localStorage.getItem('dataValue'),
            value = [];
        value = matrixdata.split(',')
        angular.forEach(value, function(val) {
            $scope.values.push(parseInt(val))
        });
    }

})();