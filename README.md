Angular Datepicker
==================
![Angular datepicker calendar](http://i.imgur.com/jKfADtA.png)

[![Join the chat at https://gitter.im/720kb/angular-datepicker](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/720kb/angular-datepicker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Angular datepicker is an angularjs directive that generates a datepicker calendar on your input element.

The Angularjs Datepicker is developed by [720kb](http://720kb.net).

## Requirements

AngularJS v1.3+

### Browser support

Chrome | Firefox | IE | Opera | Safari
--- | --- | --- | --- | --- |
 ✔ | ✔ | IE9 + | ✔ | ✔ |


## Load

To use the directive, include the Angular Datepicker's javascript and css files in your web page:

```html
<!DOCTYPE HTML>
<html>
<head>
  <link href="src/css/angular-datepicker.css" rel="stylesheet" type="text/css" />
</head>
<body ng-app="app">
  //.....
  <script src="src/js/angular-datepicker.js"></script>
</body>
</html>
```

## Installation

#### Bower

```
$ bower install angularjs-datepicker --save
```
#### Npm

```
$ npm install angularjs-datepicker --save
```

_then load the js files in your html_

### Add module dependency

Add the 720kb.datepicker module dependency

```js
angular.module('app', [
  '720kb.datepicker'
 ]);
```

Call the directive wherever you want in your html page

```html
<datepicker ng-model="date"></datepicker>
```
> By default the ng-model will show a Javascript Date() Object inside your input, you can use the options below to set your preferred date format to.

### Configure defaults

```js
  app.config(function(datepickerConfigProvider){
      datepickerConfigProvider.setDefaultDateFormat('medium');
      datepickerConfigProvider.useTyper(true);
      datepickerConfigProvider.setTimezoneReference('+0130');
      datepickerConfigProvider.setTimezoneWarning('<b>Warning!</b> Different timezone will lead into a different date ({{timeshiftReference}}): {{ ngModel | date:'mediumDate':timeshiftReference }}');
  })
```

Function | Default | Description
------------- | ------------- | -------------
setDefaultDateFormat | "mediumDate" | Set the default date format you want to use in your application, see the list [here](https://docs.angularjs.org/api/ng/filter/date)
useTyper | undefined | If set true, will use the typer feature by default
setTimezoneReference | "string" | Sets the timeshift offset as string like "+0430" in order to display a warning, if the date differs from the intented due to timezone differences
setTimezoneWarning | "html" | A html snippet, that will be compiled in scope in case of a timeshift mismatch

Furthermore some settings, which might happen in realtime, can be defined by a service:

```js
  app.controller(function(datepickerSettings){
      datepickerSettings.timeshiftReference = '+0200';
      datepickerSettings.monthCountStart = new Date();
  })
```


## DOC

Option | Type | Default | Description
------------- | ------------- | ------------- | -------------
ng-model="" | Date() | undefined | the ng-model of the elements value
readonly | Boolean | undefined | define the datepicker is readonly
required | Boolean | undefined | marks it as required, ng-model can not be null for form.$valid handling
month-count-start="" | Date() | undefined | if set, an ascending month index is appended to the days and months readouts as Mxx format
date-format="" | String | String(new Date()) | Set the date format you want to use, see the list [here](https://docs.angularjs.org/api/ng/filter/date)
 |  | | **tip:** _Be always sure to use a recognized format, maybe try first of all to pass it through new Date('...') and see if it's recognized_
date-min-limit="" | String | false | Set a minimum date limit - you can use all the accepted date formats by the javascript `new Date()`
date-max-limit="" | String | false | Set a maximum date limit - you can use all the accepted date formats by the javascript `new Date()`
date-set-hidden="" | String(Boolean) | false | Set the default date to be shown only in calendar and not in the input field
date-disabled-dates="" | String([Date(), Date(), ...]) | false | Disable specific dates using an _Array_ of dates.
date-enabled-dates="" | String([Date(), Date(), ...]) | false | Enable only the specific dates using an _Array_ of dates.
date-disabled-weekdays="" | String(1, 5, ...]) | false | Disable specific weekdays using an _Array_ of weeks number
date-refocus="" | String(Boolean) | false | Set the datepicker to re-focus the input after selecting a date
date-typer="" | String(Boolean) | false | Set the datepicker to update calendar date when user is typing a date, see validation [tips](#date-validation)
date-week-start-day="" | String(Number) | 0 | Set the first day of the week. Must be an integer between 0 (Sunday) and 6 (Saturday). (e.g. 1 for Monday)
datepicker-class="" | String('class1 class2 class3') | false | Set custom class/es for the datepicker calendar
datepicker-append-to="" | String('#id','.classname', 'body') | false | Append the datepicker to #id or  .class element or to body
datepicker-toggle="" | String(Boolean) | true | Set the datepicker to toggle its visibility on focus and blur 
| | | **tip:** Best is to use `pointer-events: none;` on your input if you don't want the user to toggle the calendar visibility.
datepicker-show="" | String | false | Trigger the datepicker visibility, if true datepicker is shown if false it is hidden
 |  | | **tip:** _Do not mix it with datepicker-toggle for a more stable behavior_
datepicker-mobile="" | String | true | Set to `false` to force override of mobile styles. Especially useful for using desktop-style pagination control in mobile apps.
timeshiftReference="" | String | null | Can override the timeshiftReference used to determine a timezone offset mismatch in date

## Options
Angular datepicker allows you to use some options via `attribute` data

#### Custom titles

You can set the titles for the month and year selectors with the **date-year-title=""** and **date-month-title=""** data attributes (default to is _"select month"_ and _"select year"_)

```html
<datepicker ng-model="date" date-month-title="selected year"></datepicker>

<datepicker ng-model="date" date-year-title="selected title"></datepicker>
```

#### Highlight today day in  calendar
To highlight or style the today day in the calendar just use its own CSS class (`._720kb-datepicker-today`) like this:

```css
._720kb-datepicker-calendar-day._720kb-datepicker-today {
  background:red;
  color:white;
}
```

#### Custom buttons
You can customize the calendar navigation buttons content, let's make an example while using [FontAwesome](http://fontawesome.io)

```html
<datepicker ng-model="date" button-prev="<i class='fa fa-arrow-left'></i>" button-next="<i class='fa fa-arrow-right'></i>"></datepicker>
```

#### Custom buttons titles for arrows
You can also set the titles for the left and right arrows with **button-next-title=""** for the right and **button-prev-title=""** for the left. By default they are labeled _"next"_ and _"prev"_.

```html
<datepicker ng-model="date" button-prev-title="previous month"></datepicker>

<datepicker ng-model="date" button-next-title="next month"></datepicker>
```

#### Input as grandchild
Sometimes you cannot put date input as a first child of datepicker. In this case you may use `selector=""` to point to the CSS class of the input. Below example with using Twitter Bootstrap and FontAwesome

```html
<datepicker ng-model="date" date-format="yyyy-MM-dd" selector="form-control">
    <div class="input-group">
        <input class="form-control" placeholder="Choose a date"/>
        <span class="input-group-addon" style="cursor: pointer">
        <i class="fa fa-lg fa-calendar"></i>
        </span>
    </div>
</datepicker>
```
#### Manually show and hide datepicker
Sometimes you want to (manually/programmatically) show or hide the datepicker, this can be achieved using `datepicker-show` attribute, if `false`, datepicker is hidden, if `true`, datepicker is shown

```javascript
.controller('TestController', ['$scope', '$interval', function TestController($scope, $interval) {
    $scope.visibility = true;

    $interval(function setInterval() {
      //toggling manually everytime
      $scope.visibility = !$scope.visibility;
    }, 3500);
  }]);
```
```html
  <datepicker ng-model="date3" ng-controller="TestController" datepicker-show="{{visibility}}"></datepicker>
```
_tip: you should use this attribute together with `datepicker-toggle="false" , for a better stable behavior of the datepicker_

#### Input as grandchild
Sometimes you cannot put date input as a first child of datepicker. In this case you may use `selector=""` to point to the CSS class of the input. Below example with using Twitter Bootstrap and FontAwesome

```html
<datepicker ng-model="date" date-format="yyyy-MM-dd" selector="form-control">
    <div class="input-group">
        <input class="form-control" placeholder="Choose a date"/>
        <span class="input-group-addon" style="cursor: pointer">
        <i class="fa fa-lg fa-calendar"></i>
        </span>
    </div>
</datepicker>
```
### Tips

### Example

[Live demo](https://720kb.github.io/angular-datepicker)

## Themes :art:
You can edit the default Css file `angular-datepicker.css` if you want to make a new theme for the datepicker, then just add it to the ```themes``` dir and PR!

More about it https://github.com/720kb/angular-datepicker/tree/master/themes.

Here is an example of a [Dark Theme](http://codepen.io/45kb/pen/bjslv) made using custom Css.

***_Please note that the example may not be uptodate with the latest angular and/or module version_

## Contributing

We will be much grateful if you help us making this project to grow up.
Feel free to contribute by forking, opening issues, pull requests etc.

## License

The MIT License (MIT)

Copyright (c) 2014 Filippo Oretti, Dario Andrei

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
