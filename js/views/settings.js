define(['jquery', 'backbone'], function($, Backbone) {
  return Backbone.View.extend({
    el: '#container',

    initialize: function(){
      this.render();
    },

    render: function(){
      this.$el.html("Hello World");
    }
  });
});
