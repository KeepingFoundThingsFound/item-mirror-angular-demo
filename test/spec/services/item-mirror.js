'use strict';

describe('Service: itemMirror', function () {

  // load the service's module
  beforeEach(module('itemMirrorAngularDemoApp'));

  // instantiate service
  var itemMirror;
  beforeEach(inject(function (_itemMirror_) {
    itemMirror = _itemMirror_;
  }));

  it('should do something', function () {
    expect(!!itemMirror).toBe(true);
  });

});
