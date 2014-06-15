'use strict';

requirejs.config({
  baseUrl: '/bower_components',
  paths: {
    'components_ui': '/js/components_ui',
    'components_data': '/js/components_data',
    'page': '/js/page',
    'lunr': '/js/lunr.min',
    'async': '/bower_components/async/lib/async',
    'handlebars': '/bower_components/handlebars/handlebars.min'
  },
  shim: {
      'handlebars': {
          'exports': 'Handlebars'
      }
  }
});

require(
  [
    'flight/lib/compose',
    'flight/lib/registry',
    'flight/lib/advice',
    'flight/lib/logger',
    'flight/lib/debug'
  ],

  function(compose, registry, advice, withLogging, debug) {
    debug.enable(true);
    compose.mixin(registry, [advice.withAdvice]);

    require(['page/default'], function(initializeDefault) {
      initializeDefault();
    });
  }
);
