angular.module('starter.services', ['ngResource'])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    clear: function () {
      $window.localStorage.clear();
    }
  }
}])

.factory('nfcService', function ($rootScope, $ionicPlatform, $localstorage) {

        var tag = {};


        $ionicPlatform.ready(function() {
            nfc.addNdefListener(function (nfcEvent) {
                var tag= nfcEvent.tag;

                console.log(JSON.stringify(nfcEvent.tag, null, 4));
                console.log('tag: ' + JSON.stringify(tag));
                console.log('techTypes: ' + JSON.stringify(tag.techTypes));
                console.log('id value: ' + tag.id[1]);

                var tempVal = $localstorage.getObject('idArray');
                tempVal.push(tag.id[1]);
                $localstorage.setObject('idArray', tempVal);

            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                alert("Error adding NFC Listener " + reason);
            });

        });

        return {
            tag: this.tag,

            clearTag: function () {
                angular.copy({}, this.tag);
            }
        };


    })








;
