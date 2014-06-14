'use strict';

requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    'components': '../js/components',
    'page': '../js/page',
    'lunr': '../js/lunr.min'
  }
});

require(
  [
    'flight/lib/compose',
    'flight/lib/registry',
    'flight/lib/advice',
    'flight/lib/logger',
    'flight/lib/debug',
    'depot/depot',
    'lunr'
  ],

  function(compose, registry, advice, withLogging, debug) {
    debug.enable(true);
    compose.mixin(registry, [advice.withAdvice]);

    require(['page/default'], function(initializeDefault) {
      initializeDefault();
    });
  }
);
