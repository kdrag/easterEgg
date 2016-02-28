angular.module('starter.controllers', ['ngResource', 'ngCordovaOauth', 'ngTwitter'])


.controller('AppCtrl', function($scope){

  var navIcons = document.getElementsByClassName('ion-navicon');
  for (var i = 0; i < navIcons.length; i++) {
      navIcons.addEventListener('click', function() {
          this.classList.toggle('active');
      });
  }

  ////////////////////////////////////////
  // Layout Methods
  ////////////////////////////////////////

  $scope.hideNavBar = function() {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
  };

  $scope.showNavBar = function() {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
  };

  $scope.noHeader = function() {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
          if (content[i].classList.contains('has-header')) {
              content[i].classList.toggle('has-header');
          }
      }
  };

  $scope.setExpanded = function(bool) {
      $scope.isExpanded = bool;
  };

  $scope.setHeaderFab = function(location) {
      var hasHeaderFabLeft = false;
      var hasHeaderFabRight = false;

      switch (location) {
          case 'left':
              hasHeaderFabLeft = true;
              break;
          case 'right':
              hasHeaderFabRight = true;
              break;
      }

      $scope.hasHeaderFabLeft = hasHeaderFabLeft;
      $scope.hasHeaderFabRight = hasHeaderFabRight;
  };

  $scope.hasHeader = function() {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
          if (!content[i].classList.contains('has-header')) {
              content[i].classList.toggle('has-header');
          }
      }

  };

  $scope.hideHeader = function() {
      $scope.hideNavBar();
      $scope.noHeader();
  };

  $scope.showHeader = function() {
      $scope.showNavBar();
      $scope.hasHeader();
  };

  $scope.clearFabs = function() {
      var fabs = document.getElementsByClassName('button-fab');
      if (fabs.length && fabs.length > 1) {
          fabs[0].remove();
      }
  };


})

.controller('LandingCtrl', function($scope, $localstorage, $ionicPlatform, $cordovaOauth, $twitterApi,  ionicMaterialInk, ionicMaterialMotion){
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);

  // Activate ink for controller
  ionicMaterialInk.displayEffect();

  ionicMaterialMotion.pushDown({
      selector: '.push-down'
  });
  ionicMaterialMotion.fadeSlideInRight({
      selector: '.animate-fade-slide-in .item'
  });


  var myToken=null;
  var bearerToken=null;
  var accessToken=null;
  var userIs = null;
  $scope.user={
    "username":null,
    "fullname":null,
    "password":null
  };
  var twitterKey = 'STORAGE.TWITTER.KEY';
  var clientId = 'ohH4Hyty2sQ2fpGDeqJHEYmO1';
  var clientSecret = 'JZrTMUahQuNrz7hfV93bF9P3h25PQyQ9LfJAhn2PkTRR6wLibG';
  var twitterToken = null;
  $localstorage.set('clientId', clientId);
  $localstorage.set('clientSecret', clientSecret);





  $scope.openStartNewGame = function(){

  }

  $scope.openJoinNewGame = function(){

  }

  $scope.selectTwitter = function(){
    console.log('pressed Twitter bar');
    $ionicPlatform.ready(function() {
      twitterToken = $localstorage.getObject('twitterKey');
      console.log('twitterToken value: ' + JSON.stringify(twitterToken) );
      var val = JSON.stringify(twitterToken);
      if (val === '' || val === null || val === '{}') {
        console.log('twitterToken is empty or null');
        $cordovaOauth.twitter(clientId, clientSecret).then(function (scc) {
          twitterToken = scc;
          $localstorage.setObject('twitterToken', scc);
          console.log('have token, calling configure API');
          $localstorage.setObject('twitterKey', JSON.stringify(scc));
          $twitterApi.configure(clientId, clientSecret, scc);
          console.log('returned from configure API');
        }, function(error) {
          console.log(error);
        });
      } else {
        console.log('have token, calling configure API');
        $twitterApi.configure(clientId, clientSecret, twitterToken);
        console.log('returned from configure API');
      }
    });

  }

})

.controller('NewGameCtrl', function($scope){

})

.controller('JoinGameCtrl', function($scope){

})

.controller('AddTagCtrl', function($scope, $ionicModal, nfcService){



    $ionicModal.fromTemplateUrl('templates/addTag-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addTagModal = modal;
    });

    $scope.onPlusClick = function(){
      $scope.addTagModal.show();
    };

    $scope.closeTagAdd = function() {
      $scope.addTagModal.hide();
    };

    $scope.tag = nfcService.tag;
    $scope.clear = function() {
        nfcService.clearTag();
    };



})

;
