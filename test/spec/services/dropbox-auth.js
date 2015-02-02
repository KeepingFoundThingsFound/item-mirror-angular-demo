'use strict';

describe('Service: dropboxAuth', function () {

  // load the service's module
  beforeEach(module('itemMirrorAngularDemoApp'));

  // instantiate service
  var dropboxAuth;
  beforeEach(inject(function (_dropboxAuth_) {
    dropboxAuth = _dropboxAuth_;
  }));

  it('should do something', function () {
    expect(!!dropboxAuth).toBe(true);
  });

});
