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
    // This overrides the default redirection method, and seems to be the only
    // way to get it working with Angular
    dropboxClient.authDriver(new Dropbox.AuthDriver.Popup({
      // Replace thordev.me with localhost or whatever host you're using for development
      receiverUrl: 'https://thordev.me:9001/misc/oauth_reciever.html'
    }));

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
          if (error) {
            console.log('Dropbox FAILED to authenticate!');
            deferred.reject(error);
          }
          else {
            authenticatedClient = client;
            console.log('Dropbox authenticated');
            deferred.resolve(client);
          }
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
