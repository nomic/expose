'use strict';

var _ = require('lodash'),
    assert = require('assert');

module.exports = function exposer(exposed, opts) {
  opts = _.defaults({}, opts, {
    decorator: _.identity
  });

  exposed = exposed || {};
  return function() {

    if (!arguments[0]) return exposed;

    var localOpts = _.defaults({}, opts, arguments[1]);
    // Export a named function
    if (_.isFunction(arguments[0])) {
      var fn = arguments[0];
      assert(fn.name, 'Exported function must be named');
      exposed[fn.name] = localOpts.decorator(fn);

    // Export all properties of an object
    } else if (_.isObject(arguments[0])) {
      var obj = _.mapValues(arguments[0], function(val) {
        return _.isFunction(val)
          ? localOpts.decorator(val)
          : val;
      });
      _.extend(exposed, obj);


    }
  };
};
