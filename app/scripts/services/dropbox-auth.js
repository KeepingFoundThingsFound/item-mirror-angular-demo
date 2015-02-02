'use strict';

/**
 * @ngdoc service
 * @name itemMirrorAngularDemoApp.dropboxAuth
 * @description
 * # dropboxAuth
 *
 * Factory used for authenticating with dropbox's servers. The
 * ItemMirror factory is dependent on this factory for operating. Note
 * that this is also dependent on access to the Dropbox library.
 */
angular.module('itemMirrorAngularDemoApp')
  .factory('dropboxAuth', ['$q', function ($q) {
    var dropboxClientCredentials = {
      key: '6d22rktdrfxkiq9',
      secret: 'kkgcohccllqj3b4'
    };
    var dropboxClient = new Dropbox.Client(dropboxClientCredentials);
    var authenticatedClient = null;

    function getClient() {
      return authenticatedClient;
    }

    function connectDropbox() {
      var deferred = $q.defer();
      if(authenticatedClient) {
        console.log('Dropbox authenticated');
        deferred.resolve(authenticatedClient);
      } else {
        console.log('Dropbox authenticating...');
        dropboxClient.authenticate(function (error, client) {
          if (error) { deferred.reject(error); }
          authenticatedClient = client;
          // Need this redirect to prevent digest from entering an infinite loop
          window.location.href = window.location.href + '#';
          deferred.resolve(client);
        });
      }
      return deferred.promise;
    }
    function disconnectDropbox() {
      dropboxClient.signOut();
    }

    return{
      connectDropbox : connectDropbox,
      disconnectDropbox : disconnectDropbox,
      getClient : getClient
    };
  }]);
