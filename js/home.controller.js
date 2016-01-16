(function() {
    'use strict';

    angular.module('app.home', [])
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$window', '$state'];

    function HomeController($scope, $window, $state) {
        $window.localStorage.removeItem('dataValue');
        $scope.addData = function() {
            $scope.total = 0;
            $scope.viewChart = false;
            // add value to weightage
            if ($scope.percentageData) {
                $scope.values.push($scope.percentageData);
                $scope.percentageData = 0;
            }
            $scope.total = Total($scope.values); //summation of array 
            $scope.totalStatus = true;
            if ($scope.total == 100) {
                $scope.totalStatus = false;
                $scope.viewChart = true;
                $window.localStorage.setItem('dataValue', $scope.values);
            }
        };
        $scope.removeData = function(index) {
            $scope.values.splice(index, 1);
        };

        $scope.checkTotal = function(index, value) {
            $scope.total = 0;
            $scope.totalStatus = true;
            $scope.viewChart = false;
            // update value to weightage
            if (value) {
                $scope.values[index] = value;
            }
            $scope.total = Total($scope.values);
            if ($scope.total == 100) {
                $scope.totalStatus = false;
                $scope.viewChart = true;
                $window.localStorage.setItem('dataValue', $scope.values);
            }

        }
    }

    // calculates summation of given weightage
    function Total(data) {
        var total = 0
        angular.forEach(data, function(value) {
            total += value;
        })
        return total;
    }

})();