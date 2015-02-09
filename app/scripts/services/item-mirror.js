'use strict';

/**
 * @ngdoc service
 * @name itemMirrorAngularDemoApp.itemMirror
 * @description
 * # itemMirror
 *
 * The service that handles all of the data when it comes to the
 * itemMirror object. This data can then be accessed by any
 * controller and used to display the data in a variety of ways. It
 * also wraps the asynchronous methods in promises for better
 * compatability with Angular and more overall flexibility.
 */
angular.module('itemMirrorAngularDemoApp')
  .factory('itemMirror', ['dropboxAuth', '$q', function (dropboxAuth, $q) {
    // This variable represents the current itemMirror that the
    // service will display data for. To keep things simple, we're
    // just going to handle dealing with one mirror at a time rather
    // than multiple mirrors. This will be initially set to the root
    // mirror.
    var mirror;

    // This array is used to keep track of all created mirrors,
    // initially consisting of just the root mirror. This allows us to
    // lookup mirrors that have been previously constructed and set
    // the mirror rather than constructing a completely new object
    // each time. Very useful for navigation.
    var mirrors;

    // This variable is an array of wrappers that can be used for data
    // binding associations. For two-way data-binding, a get and set
    // function needs to be defined using the appropriate
    // variables. For one way, you can just set a property
    var associations;

    // This is the association wrapping function. In order to allow data
    // binding for custom namespace attributes they must be manually inserted
    // here. For writable attributes a getter / setter must be defined.
    //
    // TODO: Create an injection function that will add to the wrappers so
    // that they can be defined outside of this file, allowing a separation of
    // core item mirror attributes and namespace attributes.
    function assocWrapper(guid) {
      return {
        guid: guid,
        get displayText(){ return mirror.getAssociationDisplayText(guid); },
        set displayText(txt){ mirror.setAssociationDisplayText(guid, txt); },
        localItem: mirror.getAssociationLocalItem(guid),
        associatedItem: mirror.getAssociationAssociatedItem(guid),
        isGrouping: mirror.isAssociationAssociatedItemGrouping(guid),
        // This shows how to define a custom rw attribute. It simply wraps the
        // item mirror methods with the namespace and the attribute.
        // 'namespace' should be replaced likely with the name of your app
        // 'key' should be replaced with the name of the attribute
        get exampleNSAttr(){ return mirror.getAssociationNamespaceAttribute('key', guid, 'namespace'); },
        set exampleNSAttr(val){ mirror.setAssociationNamespaceAttribute('key', val, guid, 'namespace'); }
      };
    }

    // This function is extremely important to call after any major
    // change to the mirror variable. If the mirror switches to a new
    // mirror or a previous mirror, this must be called or Angular
    // won't be able to load any of the associations. This also needs
    // to be called during any type of sync operation when
    // associations can be created or deleted in bulk
    function updateAssociations() {
      console.log('updating associations');
      associations = mirror.listAssociations().map(function(guid) {
        return assocWrapper(guid);
      });
    }

    // Used to construct the very first ItemMirror object in the root
    // of the dropbox. In the future, this should be extended to use
    // FolderSelect, so that we can instead choose a different 'root'
    // itemMirror, or use a different set of drivers
    function constructRootMirror(dropboxClient) {
      var dropboxXooMLUtility;
      var dropboxItemUtility;
      var mirrorSyncUtility;
      var rootGroupingItemURI = '/';

      dropboxXooMLUtility = {
        fragmentURI: '/XooML2.xml',
        driverURI: 'DropboxXooMLUtility',
        dropboxClient: dropboxClient
      };
      dropboxItemUtility = {
        driverURI: 'DropboxItemUtility',
        dropboxClient: dropboxClient
      };
      mirrorSyncUtility = {
        utilityURI: 'MirrorSyncUtility'
      };

      var options = {
        groupingItemURI: rootGroupingItemURI,
        xooMLDriver: dropboxXooMLUtility,
        itemDriver: dropboxItemUtility,
        syncDriver: mirrorSyncUtility
      };

      return construct(options);
    }

    function construct(options) {
      var deferred = $q.defer();

      new ItemMirror(options, function(error, IM) {
        if (error) { deferred.reject(error); }
        else { deferred.resolve(IM); }
      });

      return deferred.promise;
    }

    // Creates a new itemMirror, and then sets the current mirror to
    // the newly created mirror. Additionally updates the
    // associations array to reflect the associations found in the
    // new mirror.
    //
    // Note that this doesn't check if a mirror has
    // already been created, that should be done before calling this
    // function to keep things efficient.
    function createChild(guid) {
      var deferred = $q.defer();

      console.log(mirror);
      mirror.createItemMirrorForAssociatedGroupingItem(guid, function(error, newMirror) {
        console.log(error);
        if (error) { deferred.reject(error); }
        else {
          mirrors.push(newMirror);
          mirror = newMirror;
          updateAssociations();
          console.log('assocs updated');
          console.log(associations);
          deferred.resolve();
        }
      });

      return deferred.promise;
    }

    return {
      save: function() {
        var deferred = $q.defer();

        mirror.save(function(error) {
          if (error) { deferred.reject(error); }
          else {
            updateAssociations();
            deferred.resolve();
          }
        });

        return deferred.promise;
      },

      refresh: function() {
        var deferred = $q.defer();

        mirror.refresh(function(error) {
          if (error) { deferred.reject(error); }
          else {
            updateAssociations();
            deferred.resolve();
          }
        });

        return deferred.promise;
      },

      createAssociation: function(options) {
        var deferred = $q.defer();

        mirror.createAssociation(options, function(error, guid) {
          if (error) { deferred.reject(error); }
          else {
            // Add a new wrapped association
            associations.push( assocWrapper(guid) );
            deferred.resolve();
          }
        });

        return deferred.promise;
      },

      deleteAssociation: function(guid) {
        console.log('Delete Association Called');
        console.log('GUID: ' + guid);
        var deferred = $q.defer();

        mirror.deleteAssociation(guid, function(error) {
          if (error) {
            deferred.reject(error); }
          else {
            var guids = associations.map(function(assoc) { return assoc.guid; });
            var delIdx = guids.indexOf(guid);
            // Removes the deleted association wrapper
            associations.splice(delIdx, 1);
            updateAssociations();
            deferred.resolve();
          }
        });

        return deferred.promise;
      },

      // This function will attempt to navigate to the specified
      // associated item's mirror. It first will see the URI exists
      // for any of the current mirrors in memory, and if so switch to
      // that mirror. If no mirrors are found, it then will attempt to
      // create a new mirror using the associated item of the
      // association
      //
      // Note that you should only call this on associations which are
      // grouping items, otherwise a mirror cannot be constructed.
      navigateMirror: function(guid) {
        var deferred = $q.defer();

        var mirrorURIs = mirrors.map(function(mirror) { return mirror.getURIforItemDescribed(); });
        var associatedItem = mirror.getAssociationAssociatedItem(guid);
        var exists = mirrorURIs.some(function(uri) { return uri === associatedItem; });
        if (exists) {
          mirror = mirrors[ mirrorURIs.indexOf(associatedItem) ];
          updateAssociations();
          deferred.resolve();
        } else {
          console.log('creating child');
          createChild(guid).
            then(function() {
              deferred.resolve();
            }, function(error) {
              deferred.reject(error);
            });
        }
        return deferred.promise;
      },

      // Renames the local item of an association. This will actually
      // change the name on the storage platform, and so it's
      // asychronous.
      renameAssociation: function(guid, name) {
        var deferred = $q.defer();

        // The guid should NOT change, but we need to pass it in. The
        // itemMirror method should be updated
        mirror.renameAssociationLocalItem(guid, function(error, newGuid) {
          if (error) { deferred.reject(error); }
          else {
            var guids = associations.map(function(guid) { return guid; });
            // Sine a rename actually performs a sync / save /
            // refresh, this may not actually work the way it's
            // intended
            associations[ guids.indexOf(guids) ].localItem = name;
            deferred.resolve();
          }
        });

        return deferred.promise;
      },

      // Returns the association wrappers for use within a
      // controller. Note that we use a getter, because the
      // associations aren't a property, they're part of a closure,
      // and so a function is needed for retrieval
      get associations() { return associations; },

      get displayName() { return mirror.getDisplayName(); },
      set displayName(name) { mirror.setDisplayName(name); },

      // A promise that completes after dropbox has authenticated, and
      // the initial root itemMirror has been created. This should
      // only be called once, preferably in some sort of start up area
      initialize: dropboxAuth.connectDropbox().
        then(constructRootMirror).
        then(function(rootMirror) {
          mirror = rootMirror;
          mirrors = [rootMirror];
          updateAssociations();
        }),

      // Calls the getCreator method of the itemMirror and sets it to that mirror if it isn't null. It's basically a way to go back.
      previous: function() {
        var parent = mirror.getCreator();
        if (parent) {
          mirror = parent;
          updateAssociations();
        }
      },

      get itemDescribed() { return mirror.getURIforItemDescribed(); }
    };
  }]);
