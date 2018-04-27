/*global angular window*/

(function (angular) {
  'use strict';

  var app = angular.module('720kb', [
    'ngRoute',
    '720kb.datepicker'
  ])
  .controller('TestController', ['$scope', '$interval', function TestController($scope, $interval) {
    var that = this;

    that.visibility = true;

    $scope.date1 = null;
    $scope.projectStartDate = new Date('2017/08/15');

    $scope.$watch('date1', function(newValue, oldValue){
      if (oldValue !== undefined) {
        console.log('date1 changed old date was', oldValue ? oldValue.constructor.name : 'n/a', oldValue)
      }

      if (newValue !== undefined) {
          console.log('date1 changed new date is', newValue ? newValue.constructor.name : 'n/a', newValue);
      }
    });

    $scope.$watch('date2', function(newvalue) {
        $scope.date1 = newvalue;
    });

    $scope.invalidate = function(date) {
      console.log('shall I destroy', date);
      $scope[date] = new Date('2019/02/35');
    };

    $interval(function setInterval() {
      //toggle manually everytime
      that.visibility = !that.visibility;
      //window.console.info('Toggling datepicker with interval of 3.5 seconds');
    }, 3500);
  }]);
}(angular));
