/*global angular document navigator*/
(function withAngular(angular, navigator) {

  'use strict';

  var A_DAY_IN_MILLISECONDS = 86400000
    , isMobile = (function isMobile() {

      if (navigator.userAgent &&
        (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i))) {

        return true;
      }
    }())
    , generateMonthAndYearHeader = function generateMonthAndYearHeader(prevButton, nextButton, preventMobile) {

      if (preventMobile) {

        isMobile = false;
      }

      if (isMobile) {

        return [
          '<div class="_720kb-datepicker-calendar-header">',
            '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-mobile-item _720kb-datepicker-calendar-month">',
              '<select ng-model="month" title="{{ dateMonthTitle }}" ng-change="selectedMonthHandle(month)">',
                '<option ng-repeat="item in months" ng-selected="item === month" ng-disabled=\'!isSelectableMaxDate(item + " " + day + ", " + year) || !isSelectableMinDate(item + " " + day + ", " + year)\' ng-value="$index + 1" value="$index + 1">',
                  '{{ item }}',
                '</option>',
              '</select>',
            '</div>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header">',
            '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-mobile-item _720kb-datepicker-calendar-month">',
              '<select ng-model="mobileYear" title="{{ dateYearTitle }}" ng-change="setNewYear(mobileYear)">',
                '<option ng-repeat="item in paginationYears track by $index" ng-selected="year === item" ng-disabled="!isSelectableMinYear(item) || !isSelectableMaxYear(item)" ng-value="item" value="item">',
                  '{{ item }}',
                '</option>',
              '</select>',
            '</div>',
          '</div>'
        ];
      }

      return [
        '<div class="_720kb-datepicker-calendar-header">',
          '<div class="_720kb-datepicker-calendar-header-left">',
            '<a class="_720kb-datepicker-calendar-month-button" href="javascript:void(0)" ng-class="{\'_720kb-datepicker-item-hidden\': !willPrevMonthBeSelectable()}" ng-click="prevMonth()" title="{{ buttonPrevTitle }}">',
              prevButton,
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header-middle-left _720kb-datepicker-calendar-month">',
            '<a href="javascript:void(0)" ng-click="paginateMonths(year); showYearsPagination = false; showMonthsPagination = !showMonthsPagination;">',
              '<span>',
                '{{month}}  {{ getProjectMonth(year + \'/\' + monthNumber + \'/\' + 1) > 0 ? "(M" + getProjectMonth(year + \'/\' + monthNumber + \'/\' + 1) + ")" : "" }}&nbsp;',
                '<i ng-class="{\'_720kb-datepicker-calendar-header-closed-pagination\': !showMonthsPagination, \'_720kb-datepicker-calendar-header-opened-pagination\': showMonthsPagination}"></i>',
              '</span>',
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header-middle-right _720kb-datepicker-calendar-month">',
            '<a href="javascript:void(0)" ng-click="paginateYears(year); showMonthsPagination = false; showYearsPagination = !showYearsPagination;">',
              '<span>',
                '{{year}}',
                '<i ng-class="{\'_720kb-datepicker-calendar-header-closed-pagination\': !showYearsPagination, \'_720kb-datepicker-calendar-header-opened-pagination\': showYearsPagination}"></i>',
              '</span>',
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header-right">',
          '<a class="_720kb-datepicker-calendar-month-button" ng-class="{\'_720kb-datepicker-item-hidden\': !willNextMonthBeSelectable()}" href="javascript:void(0)" ng-click="nextMonth()" title="{{ buttonNextTitle }}">',
            nextButton,
          '</a>',
          '</div>',
        '</div>'
      ];
    }

    , generateMonthsPaginationHeader = function generateMonthsPaginationHeader() {

      return [
        '<div class="_720kb-datepicker-calendar-header grey" ng-show="showMonthsPagination">',
          '<div class="_720kb-datepicker-calendar-years-pagination">',
            '<a ng-class="{\'_720kb-datepicker-active\': m.number === monthNumber, \'_720kb-datepicker-disabled\': !isSelectableMaxMonth(m.number, year) || !isSelectableMinMonth(m.number, year)}" href="javascript:void(0)" ng-click="setNewMonth(m.number, year)" ng-repeat="m in paginationMonths track by $index">',
              '{{m.name}}',
            '</a>',
          '</div>',
        '</div>'
      ];
    }
    , generateYearsPaginationHeader = function generateYearsPaginationHeader(prevButton, nextButton) {

      return [
        '<div class="_720kb-datepicker-calendar-header grey" ng-show="showYearsPagination">',
          '<div class="_720kb-datepicker-calendar-years-pagination">',
            '<a ng-class="{\'_720kb-datepicker-active\': y === year, \'_720kb-datepicker-disabled\': !isSelectableMaxYear(y) || !isSelectableMinYear(y)}" href="javascript:void(0)" ng-click="setNewYear(y)" ng-repeat="y in paginationYears track by $index">',
              '{{y}}',
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-years-pagination-pages">',
            '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[0])" ng-class="{\'_720kb-datepicker-item-hidden\': paginationYearsPrevDisabled}">',
              prevButton,
            '</a>',
            '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[paginationYears.length -1 ])" ng-class="{\'_720kb-datepicker-item-hidden\': paginationYearsNextDisabled}">',
              nextButton,
            '</a>',
          '</div>',
        '</div>'
      ];
    }
    , generateDaysColumns = function generateDaysColumns() {

      return [
      '<div class="_720kb-datepicker-calendar-days-header">',
        '<div ng-repeat="d in daysInString">',
          '{{d}}',
        '</div>',
      '</div>'
      ];
    }
    , generateDays = function generateDays() {

      return [
        '<div class="_720kb-datepicker-calendar-body">',
          '<a href="javascript:void(0)" ng-repeat="px in prevMonthDays" ng-class="{\'new-month-container\': isNewProjectmonth(getPrevDate(year,monthNumber,px))}" class="_720kb-datepicker-calendar-day _720kb-datepicker-disabled">',
            '<div class="new-month disabled">M{{ getProjectMonth(getPrevDate(year,monthNumber,px)) }}</div><div class="arrow-right disabled"></div>',
            '{{px}}',
          '</a>',
          '<a href="javascript:void(0)" ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'new-month-container\': isNewProjectmonth(year + \'/\' + monthNumber + \'/\' + item),\'_720kb-datepicker-active\': selectedDay === item && selectedMonth === monthNumber && selectedYear === year, \'_720kb-datepicker-disabled\': !isSelectableMinDate(year + \'/\' + monthNumber + \'/\' + item ) || !isSelectableMaxDate(year + \'/\' + monthNumber + \'/\' + item) || !isSelectableDate(monthNumber, year, item) || !isSelectableDay(monthNumber, year, item),\'_720kb-datepicker-today\': item === today.getDate() && monthNumber === (today.getMonth() + 1) && year === today.getFullYear() && !selectedDay}" class="_720kb-datepicker-calendar-day">',
            '<div class="new-month">M{{ getProjectMonth(year + \'/\' + monthNumber + \'/\' + item) }}</div><div class="arrow-right"></div>',
            '{{item}}',
          '</a>',
          '<a href="javascript:void(0)" ng-repeat="nx in nextMonthDays" ng-class="{\'new-month-container\': isNewProjectmonth(getNextDate(year,monthNumber,nx))}" class="_720kb-datepicker-calendar-day _720kb-datepicker-disabled">',
            '<div class="new-month disabled">M{{ getProjectMonth(getNextDate(year,monthNumber,nx)) }}</div><div class="arrow-right disabled"></div>',
            '{{nx}}',
          '</a>',
        '</div>'
      ];
    }
    , generateHtmlTemplate = function generateHtmlTemplate(prevButton, nextButton, preventMobile) {

      var toReturn = [
        '<div class="_720kb-datepicker-calendar {{datepickerClass}} {{datepickerID}}" ng-class="{\'_720kb-datepicker-forced-to-open\': checkVisibility()}" ng-blur="hideCalendar()">',
        '</div>'
      ]
      , monthAndYearHeader = generateMonthAndYearHeader(prevButton, nextButton, preventMobile)
      , monthsPaginationHeader = generateMonthsPaginationHeader()
      , yearsPaginationHeader = generateYearsPaginationHeader(prevButton, nextButton)
      , daysColumns = generateDaysColumns()
      , days = generateDays()
      , iterator = function iterator(aRow) {

        toReturn.splice(toReturn.length - 1, 0, aRow);
      };

      monthAndYearHeader.forEach(iterator);
      monthsPaginationHeader.forEach(iterator);
      yearsPaginationHeader.forEach(iterator);
      daysColumns.forEach(iterator);
      days.forEach(iterator);

      return toReturn.join('');
    }
    , datepickerDirective = function datepickerDirective($window, $compile, $locale, $filter, $interpolate, $timeout) {

      var linkingFunction = function linkingFunction($scope, element, attr) {

        //get child input
        var selector = attr.selector
          , thisInput = angular.element(selector ? element[0].querySelector('.' + selector) : element[0].children[0])
          , theCalendar
          , defaultPrevButton = '<b class="_720kb-datepicker-default-button">&lang;</b>'
          , defaultNextButton = '<b class="_720kb-datepicker-default-button">&rang;</b>'
          , prevButton = attr.buttonPrev || defaultPrevButton
          , nextButton = attr.buttonNext || defaultNextButton
          , dateFormat = attr.dateFormat
          //, dateMinLimit
          //, dateMaxLimit
          , dateDisabledDates = $scope.$eval($scope.dateDisabledDates)
          , dateEnabledDates = $scope.$eval($scope.dateEnabledDates)
          , dateDisabledWeekdays = $scope.$eval($scope.dateDisabledWeekdays)
          , date = new Date()
          , isMouseOn = false
          , isMouseOnInput = false
          , preventMobile = typeof attr.datepickerMobile !== 'undefined' && attr.datepickerMobile !== 'false'
          , datetime = $locale.DATETIME_FORMATS
          , pageDatepickers
          , hours24h = 86400000
          , htmlTemplate = generateHtmlTemplate(prevButton, nextButton, preventMobile)
          , n
          , onClickOnWindow = function onClickOnWindow() {

            if (!isMouseOn &&
              !isMouseOnInput && theCalendar) {

              $scope.hideCalendar();
            }
          }
          , setDaysInMonth = function setDaysInMonth(month, year) {

            var i
              , limitDate = new Date(year, month, 0).getDate()
              , firstDayMonthNumber = new Date(year + '/' + month + '/' + 1).getDay()
              , lastDayMonthNumber = new Date(year + '/' + month + '/' + limitDate).getDay()
              , prevMonthDays = []
              , nextMonthDays = []
              , howManyNextDays
              , howManyPreviousDays
              , monthAlias
              , dateWeekEndDay;

            $scope.days = [];
            $scope.dateWeekStartDay = $scope.validateWeekDay($scope.dateWeekStartDay);
            dateWeekEndDay = ($scope.dateWeekStartDay + 6) % 7;

            for (i = 1; i <= limitDate; i += 1) {

              $scope.days.push(i);
            }

            //get previous month days if first day in month is not first day in week
            if (firstDayMonthNumber === $scope.dateWeekStartDay) {

              //no need for it
              $scope.prevMonthDays = [];
            } else {

              howManyPreviousDays = firstDayMonthNumber - $scope.dateWeekStartDay;

              if (firstDayMonthNumber < $scope.dateWeekStartDay) {

                howManyPreviousDays += 7;
              }

              //get previous month
              if (Number(month) === 1) {

                monthAlias = 12;
              } else {

                monthAlias = month - 1;
              }
              //return previous month days
              for (i = 1; i <= new Date(year, monthAlias, 0).getDate(); i += 1) {

                prevMonthDays.push(i);
              }
              //attach previous month days
              $scope.prevMonthDays = prevMonthDays.slice(-howManyPreviousDays);
            }

            //get next month days if last day in month is not last day in week
            if (lastDayMonthNumber === dateWeekEndDay) {
              //no need for it
              $scope.nextMonthDays = [];
            } else {
              howManyNextDays = 6 - lastDayMonthNumber + $scope.dateWeekStartDay;

              if (lastDayMonthNumber < $scope.dateWeekStartDay) {

                howManyNextDays -= 7;
              }
              //get previous month

              //return next month days
              for (i = 1; i <= howManyNextDays; i += 1) {

                nextMonthDays.push(i);
              }
              //attach previous month days
              $scope.nextMonthDays = nextMonthDays;
            }
          }
          , resetToMinDate = function resetToMinDate() {

            $scope.month = $filter('date')(new Date($scope.dateMinLimit), 'MMMM');
            $scope.monthNumber = Number($filter('date')(new Date($scope.dateMinLimit), 'MM'));
            $scope.day = Number($filter('date')(new Date($scope.dateMinLimit), 'dd'));
            $scope.year = Number($filter('date')(new Date($scope.dateMinLimit), 'yyyy'));

            setDaysInMonth($scope.monthNumber, $scope.year);
          }
          , resetToMaxDate = function resetToMaxDate() {

            $scope.month = $filter('date')(new Date($scope.dateMaxLimit), 'MMMM');
            $scope.monthNumber = Number($filter('date')(new Date($scope.dateMaxLimit), 'MM'));
            $scope.day = Number($filter('date')(new Date($scope.dateMaxLimit), 'dd'));
            $scope.year = Number($filter('date')(new Date($scope.dateMaxLimit), 'yyyy'));

            setDaysInMonth($scope.monthNumber, $scope.year);
          }
          , prevYear = function prevYear() {

            $scope.year = Number($scope.year) - 1;
          }
          , nextYear = function nextYear() {

            $scope.year = Number($scope.year) + 1;
          }
          , localDateTimestamp = function localDateTimestamp(rawDate, dateFormatDefinition) {
            
            var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|MMMM|MMM|MM|M|dd?d?|yy?yy?y?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g
            ,formatDate,dateSplit, m, d, y, index, el, longName, shortName;

            for (index = 0; index < datetime.MONTH.length; index += 1) {
              longName = datetime.MONTH[index];
              shortName = datetime.SHORTMONTH[index];

              if (rawDate.indexOf(longName) !== -1) {
                rawDate = rawDate.replace(longName, index + 1);
                break;
              }

              if (rawDate.indexOf(shortName) !== -1) {
                rawDate = rawDate.replace(shortName, index + 1);
                break;
              }              
            }

            dateSplit = rawDate
              .split(/\D/)
              .filter(function dateSplitFilter(item) {
                return item.length > 0;
              });

            formatDate = dateFormatDefinition
              .match(formattingTokens)
              .filter(function fromatDateFilter(item) {
                return item.match(/^[a-zA-Z]+$/i) !== null;
              });

            for (index = 0; index < formatDate.length; index += 1) {
              el = formatDate[index];

              switch (true) {
                case el.indexOf('d') !== -1: {
                  d = dateSplit[index - (formatDate.length - dateSplit.length)];
                  break;
                }
                case el.indexOf('M') !== -1: {
                  m = dateSplit[index - (formatDate.length - dateSplit.length)];
                  break;
                }
                case el.indexOf('y') !== -1: {
                  y = dateSplit[index - (formatDate.length - dateSplit.length)];
                  break; 
                }
                default: {
                  break;  
                }                                 
              }
            }

            if(y < 100){
              y = '20' + y;
            }

            return new Date(y + '/' + m + '/' + d);
          }
          , setInputValue = function setInputValue() {

            if ($scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day) &&
                $scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

              var modelDate = new Date($scope.year + '/' + $scope.monthNumber + '/' + $scope.day);

              if (attr.dateFormat) {

                thisInput.val($filter('date')(modelDate, dateFormat));
              } else {

                thisInput.val(modelDate);
              }

              thisInput.triggerHandler('input');
              thisInput.triggerHandler('change');//just to be sure;
            } else {

              return false;
            }
          }
          , classHelper = {
            'add': function add(ele, klass) {
              var classes;

              if (ele.className.indexOf(klass) > -1) {

                return;
              }

              classes = ele.className.split(' ');
              classes.push(klass);
              ele.className = classes.join(' ');
            },
            'remove': function remove(ele, klass) {
              var i
                , classes;

              if (ele.className.indexOf(klass) === -1) {

                return;
              }

              classes = ele.className.split(' ');
              for (i = 0; i < classes.length; i += 1) {

                if (classes[i] === klass) {

                  classes = classes.slice(0, i).concat(classes.slice(i + 1));
                  break;
                }
              }
              ele.className = classes.join(' ');
            }
          }
          , showCalendar = function showCalendar() {
            //lets hide all the latest instances of datepicker
            pageDatepickers = $window.document.getElementsByClassName('_720kb-datepicker-calendar');

            angular.forEach(pageDatepickers, function forEachDatepickerPages(value, key) {
              if (pageDatepickers[key].classList) {

                pageDatepickers[key].classList.remove('_720kb-datepicker-open');
              } else {

                classHelper.remove(pageDatepickers[key], '_720kb-datepicker-open');
              }
            });

            if (theCalendar.classList) {

              theCalendar.classList.add('_720kb-datepicker-open');
              if (dateFormat) {
                date = localDateTimestamp(thisInput[0].value.toString(), dateFormat);
              } else {
                date = new Date(thisInput[0].value.toString());
              }
              $scope.selectedMonth = Number($filter('date')(date, 'MM'));
              $scope.selectedDay = Number($filter('date')(date, 'dd'));
              $scope.selectedYear = Number($filter('date')(date, 'yyyy'));
            } else {

              classHelper.add(theCalendar, '_720kb-datepicker-open');
            }
            $scope.today = new Date();
            $timeout(function timeoutForYears() {
              if ($scope.selectedDay) {
                $scope.year = $scope.selectedYear;
                $scope.monthNumber = $scope.selectedMonth;
              } else {
                $scope.year = $scope.today.getFullYear();
                $scope.monthNumber = $scope.today.getMonth() + 1;
              }
              $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
              setDaysInMonth($scope.monthNumber, $scope.year);
            }, 0);
          }
          , checkToggle = function checkToggle() {
            if (!$scope.datepickerToggle) {

              return true;
            }

            return $scope.$eval($scope.datepickerToggle);
          }
          , checkVisibility = function checkVisibility() {
            if (!$scope.datepickerShow) {

              return false;
            }
            if (dateFormat) {
              date = localDateTimestamp(thisInput[0].value.toString(), dateFormat);
            } else {
              date = new Date(thisInput[0].value.toString());
            }
            $scope.selectedMonth = Number($filter('date')(date, 'MM'));
            $scope.selectedDay = Number($filter('date')(date, 'dd'));
            $scope.selectedYear = Number($filter('date')(date, 'yyyy'));
            return $scope.$eval($scope.datepickerShow);
          }
          , unregisterDataSetWatcher = $scope.$watch('dateSet', function dateSetWatcher(newValue) {

            if (newValue && !isNaN(Date.parse(newValue))) {

              date = new Date(newValue);

              $scope.month = $filter('date')(date, 'MMMM');//december-November like
              $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
              $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
              $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like

              setDaysInMonth($scope.monthNumber, $scope.year);
              $scope.paginateMonths($scope.year);

              if ($scope.dateSetHidden !== 'true') {

                setInputValue();
              }
            }
          })
          , unregisterDateMinLimitWatcher = $scope.$watch('dateMinLimit', function dateMinLimitWatcher(newValue) {
            if (newValue) {
              resetToMinDate();
            }
          })
          , unregisterDateMaxLimitWatcher = $scope.$watch('dateMaxLimit', function dateMaxLimitWatcher(newValue) {
            if (newValue) {
              resetToMaxDate();
            }
          })
          , unregisterDateFormatWatcher = $scope.$watch('dateFormat', function dateFormatWatcher(newValue) {
            if (newValue) {
              setInputValue();
            }
          })
          , unregisterDateDisabledDatesWatcher = $scope.$watch('dateDisabledDates', function dateDisabledDatesWatcher(newValue) {
            if (newValue) {
              dateDisabledDates = $scope.$eval(newValue);

              if (!$scope.isSelectableDate($scope.monthNumber, $scope.year, $scope.day)) {
                thisInput.val('');
                thisInput.triggerHandler('input');
                thisInput.triggerHandler('change');//just to be sure;
              }
            }
          })
          , unregisterDateEnabledDatesWatcher = $scope.$watch('dateEnabledDates', function dateEnabledDatesWatcher(newValue) {
            if (newValue) {
              dateEnabledDates = $scope.$eval(newValue);

              if (!$scope.isSelectableDate($scope.monthNumber, $scope.year, $scope.day)) {
                thisInput.val('');
                thisInput.triggerHandler('input');
                thisInput.triggerHandler('change');//just to be sure;
              }
            }
          });

        $scope.nextMonth = function nextMonth() {

          if ($scope.monthNumber === 12) {

            $scope.monthNumber = 1;
            //its happy new year
            nextYear();
          } else {

            $scope.monthNumber += 1;
          }

          //check if max date is ok
          if ($scope.dateMaxLimit) {

            if (!$scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.days[0])) {

              resetToMaxDate();
            }
          }

          //set next month
          $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
          //reinit days
          setDaysInMonth($scope.monthNumber, $scope.year);
          //deactivate selected day
          $scope.day = undefined;

          $scope.paginateMonths($scope.year);
        };

        $scope.willPrevMonthBeSelectable = function willPrevMonthBeSelectable() {
          var monthNumber = $scope.monthNumber
            , year = $scope.year
            , prevDay = $filter('date')(new Date(new Date(year + '/' + monthNumber + '/01').getTime() - hours24h), 'dd'); //get last day in previous month

          if (monthNumber === 1) {

            monthNumber = 12;
            year = year - 1;
          } else {

            monthNumber -= 1;
          }

          if ($scope.dateMinLimit) {
            if (!$scope.isSelectableMinDate(year + '/' + monthNumber + '/' + prevDay)) {

              return false;
            }
          }

          return true;
        };

        $scope.willNextMonthBeSelectable = function willNextMonthBeSelectable() {
          var monthNumber = $scope.monthNumber
            , year = $scope.year;

          if (monthNumber === 12) {

            monthNumber = 1;
            year += 1;
          } else {

            monthNumber += 1;
          }

          if ($scope.dateMaxLimit) {
            if (!$scope.isSelectableMaxDate(year + '/' + monthNumber + '/01')) {

              return false;
            }
          }

          return true;
        };

        $scope.prevMonth = function managePrevMonth() {

          if ($scope.monthNumber === 1) {

            $scope.monthNumber = 12;
            //its happy new year
            prevYear();
          } else {

            $scope.monthNumber -= 1;
          }
          //check if min date is ok
          if ($scope.dateMinLimit) {

            if (!$scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.days[$scope.days.length - 1])) {

              resetToMinDate();
            }
          }
          //set next month
          $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
          //reinit days
          setDaysInMonth($scope.monthNumber, $scope.year);
          //deactivate selected day
          $scope.day = undefined;

          $scope.paginateMonths($scope.year);
        };

        $scope.selectedMonthHandle = function manageSelectedMonthHandle(selectedMonthNumber) {

          $scope.monthNumber = Number($filter('date')(new Date(selectedMonthNumber + '/01/2000'), 'MM'));
          setDaysInMonth($scope.monthNumber, $scope.year);
          setInputValue();
        };

        $scope.setNewMonth = function setNewMonth(month, year) {
          //deactivate selected day
          $scope.day = undefined;

          if ($scope.dateMaxLimit &&
              ($scope.month < Number(month))) {

              if (!$scope.isSelectableMaxMonth(month, year)) {

                  return;
              }
          } else if ($scope.dateMinLimit &&
              $scope.month > Number(month)) {

              if (!$scope.isSelectableMinMonth(month, year)) {

                  return;
              }
          }

          $scope.showMonthsPagination = false;
          $scope.showYearsPagination = false;

          $timeout(function timeoutForMonths() {
              var dateMonth = new Date(year + "/" + month + "/01 12:00:00");
              $scope.month = $filter('date')(dateMonth, 'MMMM');
              $scope.monthNumber = month;
              setDaysInMonth(month, $scope.year);
          }, 0);
        };

        $scope.setNewYear = function setNewYear(year) {

          //deactivate selected day
          if (!isMobile) {
            $scope.day = undefined;
          }

          if ($scope.dateMaxLimit &&
            $scope.year < Number(year)) {

            if (!$scope.isSelectableMaxYear(year)) {

              return;
            }
          } else if ($scope.dateMinLimit &&
            $scope.year > Number(year)) {

            if (!$scope.isSelectableMinYear(year)) {

              return;
            }
          }

          $scope.showMonthsPagination = false;

          $scope.paginateYears(year);
          $scope.paginateMonths(year);
          $scope.showYearsPagination = false;
          $timeout(function timeoutForYears() {
            $scope.year = Number(year);
            setDaysInMonth($scope.monthNumber, $scope.year);
          }, 0);
        };

        $scope.hideCalendar = function hideCalendar() {
          if (theCalendar.classList) {
            theCalendar.classList.remove('_720kb-datepicker-open');
          } else {

            classHelper.remove(theCalendar, '_720kb-datepicker-open');
          }
        };

        $scope.setDatepickerDay = function setDatepickerDay(day) {

          if ($scope.isSelectableDay($scope.monthNumber, $scope.year, day) &&
              $scope.isSelectableDate($scope.monthNumber, $scope.year, day) &&
              $scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + day) &&
              $scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + day)) {

            $scope.day = Number(day);
            $scope.selectedDay = $scope.day;
            $scope.selectedMonth = $scope.monthNumber;
            $scope.selectedYear = $scope.year;

            setInputValue();

            if (attr.hasOwnProperty('dateRefocus')) {
              thisInput[0].focus();
            }

            $scope.hideCalendar();
          }
        };

        $scope.paginateMonths = function paginateMonths(year){
          $scope.paginationMonths = [];

          for(var m=1;m<=12;m++){
            var dateMonth = new Date(year + '/' + m + '/1 12:00:00')

            var name = $filter('date')(dateMonth, 'MMM');
            var pm = $filter('projectMonth')(dateMonth, true);

            if(pm > 0){
              name += ' (M' + pm + ')';
            }
            $scope.paginationMonths.push(
              {
                number: m,
                name: name
              }
            )
          }
        }

        $scope.paginateYears = function paginateYears(startingYear) {
          var i
           , theNewYears = []
           , daysToPrepend = 10
           , daysToAppend = 10;

          $scope.paginationYears = [];
          if (isMobile) {

            daysToPrepend = 50;
            daysToAppend = 50;
            if ( $scope.dateMinLimit && $scope.dateMaxLimit) {

              startingYear = new Date($scope.dateMaxLimit).getFullYear();
              daysToPrepend = startingYear - new Date($scope.dateMinLimit).getFullYear();
              daysToAppend = 1;
            }
          }

          for (i = daysToPrepend; i > 0; i -= 1) {

            theNewYears.push(Number(startingYear) - i);
          }

          for (i = 0; i < daysToAppend; i += 1) {

            theNewYears.push(Number(startingYear) + i);
          }
          //date typing in input date-typer
          if ($scope.dateTyper === 'true') {

            thisInput.on('keyup blur', function onTyping() {

              if (thisInput[0].value &&
                thisInput[0].value.length &&
                thisInput[0].value.length > 0) {

                try {
                  if (dateFormat) {
                    date = localDateTimestamp(thisInput[0].value.toString(), dateFormat);
                  } else {
                    date = new Date(thisInput[0].value.toString());
                  }

                  if (date.getFullYear() &&
                   !isNaN(date.getDay()) &&
                   !isNaN(date.getMonth()) &&
                   $scope.isSelectableDay(date.getMonth(), date.getFullYear(), date.getDay()) &&
                   $scope.isSelectableDate(date.getMonth(), date.getFullYear(), date.getDay()) &&
                   $scope.isSelectableMaxDate(date) &&
                   $scope.isSelectableMinDate(date)) {

                    $scope.$apply(function applyTyping() {

                      $scope.month = $filter('date')(date, 'MMMM');//december-November like
                      $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
                      $scope.day = Number($filter('date')(date, 'dd')); //01-31 like

                      if (date.getFullYear().toString().length === 4) {
                        $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like
                      }
                      setDaysInMonth($scope.monthNumber, $scope.year);
                    });
                  }
                } catch (e) {

                  return e;
                }
              }
            });
          }
          //check range dates
          if ($scope.dateMaxLimit &&
            theNewYears &&
            theNewYears.length &&
            !$scope.isSelectableMaxYear(Number(theNewYears[theNewYears.length - 1]) + 1)) {

            $scope.paginationYearsNextDisabled = true;
          } else {

            $scope.paginationYearsNextDisabled = false;
          }

          if ($scope.dateMinLimit &&
            theNewYears &&
            theNewYears.length &&
            !$scope.isSelectableMinYear(Number(theNewYears[0]) - 1)) {

            $scope.paginationYearsPrevDisabled = true;
          } else {

            $scope.paginationYearsPrevDisabled = false;
          }

          $scope.paginationYears = theNewYears;
        };

        $scope.isSelectableDay = function isSelectableDay(monthNumber, year, day) {
          var i = 0;

          if (dateDisabledWeekdays && dateDisabledWeekdays.length > 0) {
            for (i; i <= dateDisabledWeekdays.length; i += 1) {
              if (dateDisabledWeekdays[i] === new Date(monthNumber + '/' + day + '/' + year).getDay()) {
                return false;
              }
            }
          }

          return true;
        };

        $scope.isSelectableDate = function isSelectableDate(monthNumber, year, day) {
          var i = 0;

          if (dateDisabledDates &&
            dateDisabledDates.length > 0) {

            for (i; i <= dateDisabledDates.length; i += 1) {

              if (new Date(dateDisabledDates[i]).getTime() === new Date(monthNumber + '/' + day + '/' + year).getTime()) {

                return false;
              }
            }
          }

          if (dateEnabledDates) {

            for (i; i <= dateEnabledDates.length; i += 1) {

              if (new Date(dateEnabledDates[i]).getTime() === new Date(monthNumber + '/' + day + '/' + year).getTime()) {

                return true;
              }
            }

            return false;
          }

          return true;
        };

        $scope.isNewProjectmonth = function isNewProjectmonth(aDate) {
          var date = new Date(aDate);
          date.setHours(12);
          date.setMinutes(0);
          date.setSeconds(0);

          var datePrev = new Date(aDate);
          datePrev.setHours(12);
          datePrev.setMinutes(0);
          datePrev.setSeconds(0);
          datePrev.setDate(datePrev.getDate() - 1);

          var m1 = $filter('projectMonth')(date, true);
          var m2 = $filter('projectMonth')(datePrev, true);

          if(m1 != m2){
            return true;
          }

          return false;
        };

        $scope.getProjectMonth = function getProjectMonth(aDate){
          var date = new Date(aDate);
          date.setHours(12);
          date.setMinutes(0);
          date.setSeconds(0);

          return $filter('projectMonth')(date, true);
        }

        $scope.getPrevDate = function getPrevDate(year, month, day){
          if(month == 1){
            month = 12;
            year--;
          } else{
            month--;
          }

          return year + '/' + month + '/' + day;
        }


        $scope.getNextDate = function getNextDate(year, month, day){
            if(month == 12){
                month = 1;
                year++;
            } else{
                month++;
            }

            return year + '/' + month + '/' + day;
        }

        $scope.isSelectableMinDate = function isSelectableMinDate(aDate) {
          //if current date
          if (!!$scope.dateMinLimit &&
             !!new Date($scope.dateMinLimit) &&
             new Date(aDate).getTime() < new Date($scope.dateMinLimit).getTime()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxDate = function isSelectableMaxDate(aDate) {
          //if current date
          if (!!$scope.dateMaxLimit &&
             !!new Date($scope.dateMaxLimit) &&
             new Date(aDate).getTime() > new Date($scope.dateMaxLimit).getTime()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxMonth = function isSelectableMaxMonth(month, year) {
          if ($scope.dateMaxLimit) {
              if (!$scope.isSelectableMaxDate(year + '/' + month + '/1')) {

                  return false;
              }
          }

          return true;
        };

        $scope.isSelectableMinMonth = function isSelectableMinMonth(month, year) {
          var maxDayDate = new Date(year, month, 0);
          var maxDay = maxDayDate.getDate();
          if ($scope.dateMinLimit) {
              if (!$scope.isSelectableMinDate(year + '/' + month + '/' + maxDay)) {

                  return false;
              }
          }

          return true;
        };

        $scope.isSelectableMaxYear = function isSelectableMaxYear(year) {
          if (!!$scope.dateMaxLimit &&
            year > new Date($scope.dateMaxLimit).getFullYear()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMinYear = function isSelectableMinYear(year) {
          if (!!$scope.dateMinLimit &&
            year < new Date($scope.dateMinLimit).getFullYear()) {

            return false;
          }

          return true;
        };

        $scope.validateWeekDay = function isValidWeekDay(weekDay) {
          var validWeekDay = Number(weekDay, 10);
          // making sure that the given option is valid
          if (!validWeekDay || validWeekDay < 0 || validWeekDay > 6) {

            validWeekDay = 0;
          }
          return validWeekDay;
        };

        // respect previously configured interpolation symbols.
        htmlTemplate = htmlTemplate.replace(/{{/g, $interpolate.startSymbol()).replace(/}}/g, $interpolate.endSymbol());
        $scope.dateMonthTitle = $scope.dateMonthTitle || 'Select month';
        $scope.dateYearTitle = $scope.dateYearTitle || 'Select year';
        $scope.buttonNextTitle = $scope.buttonNextTitle || 'Next';
        $scope.buttonPrevTitle = $scope.buttonPrevTitle || 'Prev';
        $scope.month = $filter('date')(date, 'MMMM');//december-November like
        $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
        $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
        $scope.dateWeekStartDay = $scope.validateWeekDay($scope.dateWeekStartDay);

        if ($scope.dateMaxLimit) {

          $scope.year = Number($filter('date')(new Date($scope.dateMaxLimit), 'yyyy'));//2014 like
        } else {

          $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like
        }
        $scope.months = datetime.MONTH;

        $scope.daysInString = [];
        for (n = $scope.dateWeekStartDay; n <= $scope.dateWeekStartDay + 6; n += 1) {

          $scope.daysInString.push(n % 7);
        }
        $scope.daysInString = $scope.daysInString.map(function mappingFunc(el) {

          return $filter('date')(new Date(new Date('06/08/2014').valueOf() + A_DAY_IN_MILLISECONDS * el), 'EEE');
        });

        //create the calendar holder and append where needed
        if ($scope.datepickerAppendTo &&
          $scope.datepickerAppendTo.indexOf('.') !== -1) {

          $scope.datepickerID = 'datepicker-id-' + new Date().getTime() + (Math.floor(Math.random() * 6) + 8);
          angular.element(document.getElementsByClassName($scope.datepickerAppendTo.replace('.', ''))[0]).append($compile(angular.element(htmlTemplate))($scope, function afterCompile(el) {

            theCalendar = angular.element(el)[0];
          }));
        } else if ($scope.datepickerAppendTo &&
          $scope.datepickerAppendTo.indexOf('#') !== -1) {

          $scope.datepickerID = 'datepicker-id-' + new Date().getTime() + (Math.floor(Math.random() * 6) + 8);
          angular.element(document.getElementById($scope.datepickerAppendTo.replace('#', ''))).append($compile(angular.element(htmlTemplate))($scope, function afterCompile(el) {

            theCalendar = angular.element(el)[0];
          }));
        } else if ($scope.datepickerAppendTo &&
          $scope.datepickerAppendTo === 'body') {
          $scope.datepickerID = 'datepicker-id-' + (new Date().getTime() + (Math.floor(Math.random() * 6) + 8));
          angular.element(document).find('body').append($compile(angular.element(htmlTemplate))($scope, function afterCompile(el) {

            theCalendar = angular.element(el)[0];
          }));
        } else {

          thisInput.after($compile(angular.element(htmlTemplate))($scope));
          //get the calendar as element
          theCalendar = element[0].querySelector('._720kb-datepicker-calendar');
        }
        //if datepicker-toggle="" is not present or true by default
        if (checkToggle()) {

          thisInput.on('focus click focusin', function onFocusAndClick() {

            isMouseOnInput = true;

            if (!isMouseOn &&
            !isMouseOnInput && theCalendar) {

              $scope.hideCalendar();
            } else {

              showCalendar();
            }
          });
        }

        thisInput.on('focusout blur', function onBlurAndFocusOut() {

          isMouseOnInput = false;
        });
        //some tricky dirty events to fire if click is outside of the calendar and show/hide calendar when needed
        angular.element(theCalendar).on('mouseenter', function onMouseEnter() {

          isMouseOn = true;
        });

        angular.element(theCalendar).on('mouseleave', function onMouseLeave() {

          isMouseOn = false;
        });

        angular.element(theCalendar).on('focusin', function onCalendarFocus() {

          isMouseOn = true;
        });

        angular.element($window).on('click focus focusin', onClickOnWindow);

        //check always if given range of dates is ok
        if ($scope.dateMinLimit &&
          !$scope.isSelectableMinYear($scope.year) ||
          !$scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

          resetToMinDate();
        }

        if ($scope.dateMaxLimit &&
          !$scope.isSelectableMaxYear($scope.year) ||
          !$scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

          resetToMaxDate();
        }

        //datepicker boot start
        $scope.paginateYears($scope.year);
        $scope.paginateMonths($scope.year);

        setDaysInMonth($scope.monthNumber, $scope.year);
        $scope.checkVisibility = checkVisibility;

        $scope.$on('$destroy', function unregisterListener() {

          unregisterDataSetWatcher();
          unregisterDateMinLimitWatcher();
          unregisterDateMaxLimitWatcher();
          unregisterDateFormatWatcher();
          unregisterDateDisabledDatesWatcher();
          unregisterDateEnabledDatesWatcher();
          thisInput.off('focus click focusout blur');
          angular.element(theCalendar).off('mouseenter mouseleave focusin');
          angular.element($window).off('click focus focusin', onClickOnWindow);
        });
      };

      return {
        'restrict': 'AEC',
        'scope': {
          'dateSet': '@',
          'dateMinLimit': '@',
          'dateMaxLimit': '@',
          'dateMonthTitle': '@',
          'dateYearTitle': '@',
          'buttonNextTitle': '@',
          'buttonPrevTitle': '@',
          'dateDisabledDates': '@',
          'dateEnabledDates': '@',
          'dateDisabledWeekdays': '@',
          'dateSetHidden': '@',
          'dateTyper': '@',
          'dateWeekStartDay': '@',
          'datepickerAppendTo': '@',
          'datepickerToggle': '@',
          'datepickerClass': '@',
          'datepickerShow': '@'
        },
        'link': linkingFunction
      };
    };

  angular.module('720kb.datepicker', [])
               .directive('datepicker', ['$window', '$compile', '$locale', '$filter', '$interpolate', '$timeout', datepickerDirective]);
}(angular, navigator));
