requirejs.config({
  baseUrl: "js",
  paths: {
    jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery",
    underscore: "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.2/underscore",
    backbone: "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone",
    Handlebars: "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.0/handlebars",
    text: "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text",
    hbars: "https://cdnjs.cloudflare.com/ajax/libs/requirejs-handlebars/0.0.2/hbars",
    fastclick: "https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick",

    utilities: 'utilities',
    routers: 'routers',
    views: 'views',
    templates: 'templates'
    // models: 'models',
    // collections: 'collections'
  },
  shim: {
    Handlebars: {
      exports: 'Handlebars'
    }
  }
});

define(['jquery', 'fastclick', 'routers/router'], function($, FastClick, DominiwebRouter) {
  $(document).ready(function() {
    'use strict';
    FastClick.attach(document.body);
    new DominiwebRouter();
    Backbone.history.start();
  });
});
