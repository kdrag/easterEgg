angular.module('starter.controllers', ['ngResource', 'ngCordovaOauth', 'ngTwitter'])


.controller('AppCtrl', function($scope, $localstorage){

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

  $localstorage.setObject('idArray', []);
  $localstorage.set('hashtag','');
  $localstorage.setObject('searchedArray', []);
  $localstorage.set('maxCount', 10);


})

.controller('LandingCtrl', function($timeout, $scope, $localstorage, $ionicPlatform, $cordovaOauth, $twitterApi,  ionicMaterialInk, ionicMaterialMotion){
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.$parent.setHeaderFab('left');

  // Delay expansion
  //$timeout(function() {
  //    $scope.isExpanded = true;
  //    $scope.$parent.setExpanded(true);
  //}, 300);

  // Set Motion
  //ionicMaterialMotion.fadeSlideInRight();

  // Set Ink
  //ionicMaterialInk.displayEffect();

  $scope.shouldShowDelete = false;
  $scope.listCanSwipe = true;


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

.controller('NewGameCtrl', function($scope,  $ionicModal, nfcService, $localstorage, $twitterApi, $cordovaOauth){

  $scope.tweet={};
  var twitterKey;
  var clientId=$localstorage.get('clientId');
  var clientSecret=$localstorage.get('clientSecret');
  var twitterToken = $localstorage.getObject('twitterToken');
  var myToken='';


    var tag = nfcService.tag;

    $scope.maxWin=10;//set fixed maximum count of winners
    $localstorage.set('maxCount', $scope.maxWin);

    $scope.data={
      "description":null,
      "hashtag":null
    }


    $scope.smartTags=$localstorage.getObject('idArray');

    $scope.doRefresher = function() {
      $scope.$broadcast('scroll.refreshComplete');
      console.log('smartTags: ' + JSON.stringify($scope.smartTags));
      $scope.smartTags=$localstorage.getObject('idArray');
      $scope.$apply();
    };

    $scope.setGame = function(){
      // store the idArray as the set of valid NFC tags in memory
      $localstorage.set('validTags', JSON.stringify($scope.smartTags));
      console.log('valid tags: ' + JSON.stringify($scope.smartTags));
    }

    $scope.maxWinSubmit = function(){
      $localstorage.set('maxCount', $scope.maxWin);
      console.log('setting maxCount to: ' + $scope.maxWin);
    }


    $ionicModal.fromTemplateUrl('templates/openReg-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.openRegModal = modal;
    });

    $scope.openRegister=function(){
      $scope.openRegModal.show();
      $scope.showHomeTimeline();
    };

    $scope.closeRegister = function() {
      $scope.openRegModal.hide();
    };


    $scope.genRanHash = function(){
        $scope.data.hashtag="#"+randString(10);
    }

    function randString(x){
        var s = "";
        while(s.length<x&&x>0){
            var r = Math.random();
            s+= (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
        }
        return s;
    }

    $scope.descriptionSubmit = function(){
      console.log('Game is defined ' + $scope.data.description);
      $localstorage.setObject('definedGame', $scope.data.description);
      $localstorage.set('hashtag', $scope.data.hashtag);
      $scope.tweet.text = JSON.stringify($localstorage.getObject('definedGame'));
      //alert('twitterKey/twitterToken/myTokens, clientId, clientSecret: ' + twitterKey + twitterToken + myToken + ' ' + clientId + ' ' + clientSecret);
      myToken = $localstorage.getObject('twitterToken');
      var val = JSON.stringify(myToken);
      console.log("oAuth token: " + val);
      if (val === '' || val === null || val === '{}' || val === undefined) {
        $cordovaOauth.twitter(clientId, clientSecret).then(function (succ) {
          myToken = succ;
          $localstorage.setObject('twitterToken', succ);
          console.log('configuring Twitter API after token retrieval');
          $localstorage.setObject('twitterKey', JSON.stringify(succ));
          $twitterApi.configure(clientId, clientSecret, succ);
          console.log('post to Twitter');
          var message= $scope.tweet.text;
          var hashtag= $localstorage.get('hashtag');
          $twitterApi.postStatusUpdate(hashtag + " " + "Game Alert: "+message);
          console.log('(1) published on Twitter timeline');
          $scope.showHomeTimeline();
        });
      } else {
        console.log('configuring Twitter API');
        $twitterApi.configure(clientId, clientSecret, myToken);
        console.log('post to Twitter');
        var message= $scope.tweet.text;
        var hashtag= $localstorage.get('hashtag');
        $twitterApi.postStatusUpdate(hashtag + " " + "Game Alert: "+message);
        console.log('(2) published on Twitter timeline');
        $scope.showHomeTimeline();
      };
    };
    $scope.showHomeTimeline = function() {
      $twitterApi.getHomeTimeline().then(function(data) {
        $scope.home_timeline = data;
      });
    };

    $scope.correctTimestring = function(string) {
      return new Date(Date.parse(string));
    };





})

.controller('JoinGameCtrl', function($scope, $ionicModal, nfcService, $localstorage, $twitterApi, $cordovaOauth){

  $scope.tweet={};
  var twitterKey;
  var clientId=$localstorage.get('clientId');
  var clientSecret=$localstorage.get('clientSecret');
  var twitterToken = $localstorage.getObject('twitterToken');
  var myToken='';


  $ionicModal.fromTemplateUrl('templates/openTweet-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.openTweetModal = modal;
  });


  $scope.closeTweet = function() {
    $scope.openTweetModal.hide();
  };





    var tag = nfcService.tag;

    $scope.data={
      "hashtag":null
    }


    $scope.smartTags=$localstorage.getObject('idArray');

    $scope.doRefresh = function() {
      $scope.$broadcast('scroll.refreshComplete');
      console.log('smartTags: ' + JSON.stringify($scope.smartTags));
      $scope.smartTags=$localstorage.getObject('idArray');
      $scope.$apply();
    };



  $scope.submitGame = function (){
    $scope.openTweetModal.show();
    console.log('Hash of game ' + $scope.data.hashtag);
    $localstorage.set('hashtag', $scope.data.hashtag);
    $scope.tweet.text = JSON.stringify($scope.smartTags+" "+$scope.data.hashtag);
    myToken = $localstorage.getObject('twitterToken');
    var val = JSON.stringify(myToken);
    console.log("oAuth token: " + val);
    if (val === '' || val === null || val === '{}' || val === undefined) {
      $cordovaOauth.twitter(clientId, clientSecret).then(function (succ) {
        myToken = succ;
        $localstorage.setObject('twitterToken', succ);
        console.log('configuring Twitter API after token retrieval');
        $localstorage.setObject('twitterKey', JSON.stringify(succ));
        $twitterApi.configure(clientId, clientSecret, succ);
        console.log('post to Twitter');
        var message= $scope.tweet.text;
        $twitterApi.postStatusUpdate("Found: "+message);
        console.log('(1) published on Twitter timeline');
        $scope.showHomeTimeline();
      });
    } else {
      console.log('configuring Twitter API');
      $twitterApi.configure(clientId, clientSecret, myToken);
      console.log('post to Twitter');
      var message= $scope.tweet.text;
      $twitterApi.postStatusUpdate("Found: "+message);
      console.log('(2) published on Twitter timeline');
      $scope.showHomeTimeline();
    };
  };

  $scope.showHomeTimeline = function() {
    $twitterApi.getHomeTimeline().then(function(data) {
      $scope.home_timeline = data;
    });
  };

  $scope.correctTimestring = function(string) {
    return new Date(Date.parse(string));
  };
})

.controller('ResultCtrl', function($scope, $ionicModal, $localstorage, $twitterApi, $cordovaOauth){

  $scope.tweet={};
  var twitterKey;
  var clientId=$localstorage.get('clientId');
  var clientSecret=$localstorage.get('clientSecret');
  var twitterToken = $localstorage.getObject('twitterToken');
  var myToken='';
  $scope.searchResult='';

    $scope.searchValues=[];

    $scope.doRefresh = function() {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.searchValues=$localstorage.getObject('searchedArray')
      $scope.$apply();
    };



  $scope.s1 = function (){
    console.log('Hash of game ' + $localstorage.get('hashtag'));
    console.log('submitted maxCount for search is: ' + $localstorage.get('maxCount'));
    var param = $localstorage.get('hashtag');
    var q=param;
    myToken = $localstorage.getObject('twitterToken');
    var val = JSON.stringify(myToken);
    console.log("oAuth token: " + val);
    if (val === '' || val === null || val === '{}' || val === undefined) {
      $cordovaOauth.twitter(clientId, clientSecret).then(function (succ) {
        myToken = succ;
        $localstorage.setObject('twitterToken', succ);
        console.log('configuring Twitter API after token retrieval');
        $localstorage.setObject('twitterKey', JSON.stringify(succ));
        $twitterApi.configure(clientId, clientSecret, succ);
        console.log('search Twitter');
        $twitterApi.searchTweets(q, {count: $localstorage.get('maxCount')}).then(function(data){
          $scope.searchResult = data;
          //var searchCount = $scope.searchResult.search_metadata.count;
          var searchCount = $scope.searchResult.statuses.length;
          var i=0;          var i=0;
          var tempElement=null;
          var tempSearchedArray=[];
          do{
            tempElement={
              "Text":$scope.searchResult.statuses[i].text,
              "Screen_name":$scope.searchResult.statuses[i].user.name
            };
            tempSearchedArray.push(tempElement);
            console.log('tempElement: ' + JSON.stringify(tempElement));
            console.log('tempSearchedArray: ' + JSON.stringify(tempSearchedArray));
            i++;
          }while(i< searchCount);
          $localstorage.setObject('searchedArray', tempSearchedArray);
          console.log('searchedArray: ' + JSON.stringify($localstorage.getObject('searchedArray')));
        });
        console.log('(1) search Twitter timeline');
        //var searchCount = $scope.searchResult.search_metadata.count;
        var searchCount = $scope.searchResult.statuses.length;
        var i=0;        console.log('searchResult is: ' + JSON.stringify($scope.searchResult));
        console.log('total count of search: ' + $scope.searchResult.search_metadata.count);
        console.log('count: ' + searchCount);
        var i=0;
        do{
          console.log('data1: ' + $scope.searchResult.statuses[i].text);
          console.log('data2: ' + $scope.searchResult.statuses[i].user.screen_name);
          i++;
        }while(i< searchCount);
        });
    } else {
      console.log('configuring Twitter API');
      $twitterApi.configure(clientId, clientSecret, myToken);
      console.log('search Twitter');
      $twitterApi.searchTweets(q, {count: $localstorage.get('maxCount')}).then(function(data){
        $scope.searchResult = data;
        //var searchCount = $scope.searchResult.search_metadata.count;
        var searchCount = $scope.searchResult.statuses.length;
        var i=0;
        var tempElement=null;
        var tempSearchedArray=[];
        do{
          tempElement={
            "Text":$scope.searchResult.statuses[i].text,
            "Screen_name":$scope.searchResult.statuses[i].user.name
          };
          tempSearchedArray.push(tempElement);
          console.log('tempElement: ' + JSON.stringify(tempElement));
          console.log('tempSearchedArray: ' + JSON.stringify(tempSearchedArray));
          i++;
        }while(i< searchCount);
        $localstorage.setObject('searchedArray', tempSearchedArray);
        console.log('searchedArray: ' + JSON.stringify($localstorage.getObject('searchedArray')));
      });
      console.log('(2) search Twitter timeline');
      console.log('searchResult is: ' + JSON.stringify($scope.searchResult));
      console.log('total count of search: ' + $scope.searchResult.search_metadata.count);
      //var searchCount = $scope.searchResult.search_metadata.count;
      var searchCount = $scope.searchResult.statuses.length;
      var i=0;      console.log('count: ' + searchCount);
      var i=0;
      do{
        console.log('data1: ' + $scope.searchResult.statuses[i].text);
        console.log('data2: ' + $scope.searchResult.statuses[i].user.screen_name);
        i++;
      }while(i< searchCount);
    };
  };


  $scope.correctTimestring = function(string) {
    return new Date(Date.parse(string));
  };



})


;
