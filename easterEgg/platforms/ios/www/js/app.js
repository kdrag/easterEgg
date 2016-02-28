// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

//  Images:  http://www.freeimages.com/photo/easter-eggs-1-1545668

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-material', 'ionMdInput', 'ngResource', 'ngTwitter','ngCordova', 'ngCordovaOauth'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.directive('noScroll', function() {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $element.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Turn off caching for demo simplicity's sake
  $ionicConfigProvider.views.maxCache(0);



  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
  })

  .state('app.landing', {
      url: '/landing',
      views: {
          'menuContent': {
              templateUrl: 'templates/landing.html',
              controller: 'LandingCtrl'
          },
          'fabContent': {
              template: ''
          }
      }
  })


  .state('app.newGame', {
      url: '/newGame',
      views: {
          'menuContent': {
              templateUrl: 'templates/newGame.html',
              controller: 'NewGameCtrl'
          },
          'fabContent': {
            template: '<button id="fab-landing" class="button button-fab button-fab-bottom-right button-energized-900" ng-click="onPlusClick()"><i class="icon ion-plus"></i></button>',
            controller: 'AddTagCtrl'
          }
      }
  })


  .state('app.joinGame', {
      url: '/joinGame',
      views: {
          'menuContent': {
              templateUrl: 'templates/joinGame.html',
              controller: 'JoinGameCtrl'
          },
          'fabContent': {
              template: ''
          }
      }
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/landing');

});
