/*global angular window*/

(function (angular) {
  'use strict';

  var app = angular.module('720kb', [
    'ngRoute',
    '720kb.datepicker'
  ])

      .config(function(datepickerConfigProvider){
          datepickerConfigProvider.setDefaultDateFormat('dd.MM.yyyy');
          datepickerConfigProvider.useTyper(true);
          datepickerConfigProvider.setTimezoneWarning('<span translate><strong>Attention: </strong>Different date in project-timezone ({{timeshiftReference}}): {{ ngModel | date:\'mediumDate\':timeshiftReference }}</span>');
          //datepickerConfigProvider.setTimezoneReference('+0400');
      })
      /*.config(function($provide){
          $provide.decorator('datepickerTimeshiftReference', function($delegate) {
              console.log('decorating datepickerTimeshiftReference was', $delegate);
              return '+0230';
          });
      })*/
  .controller('TestController', ['$scope', '$interval', 'datepickerSettings', function TestController($scope, $interval, datepickerSettings) {
    var that = this;

    that.visibility = true;

    $scope.date1 = null;
    $scope.timeshift = '-1100';
    $scope.projectStartDate = new Date('2017/08/15');
    $scope.settings = datepickerSettings;
    $scope.settings.timeshiftReference = $scope.timeshift;

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


      $scope.$watch('timeshift', function(newvalue) {
          if ( newvalue.match(/^[\+-]([0-9]{4})$/) ) {
              console.log('set timeshift', newvalue);
              $scope.settings.timeshiftReference = newvalue;
          }
      });

      $scope.$watch('projectStartDate', function(newvalue) {
          if ( !Number.isNaN(Date.parse(newvalue)) ) {
              console.log('set start date', newvalue);
              $scope.settings.monthCountStart = newvalue;
          }
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
