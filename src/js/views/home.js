define(['jquery', 'backbone', 'hbars!templates/home'], function($, Backbone, template) {
  return Backbone.View.extend({
    el: '#container',

    initialize: function(){
      this.render();
    },

    render: function(){
      this.$el.html(template());
    }
  });
});
