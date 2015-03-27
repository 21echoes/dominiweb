define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    // set: string
    // name: string
    // key: string
    // cards: array

    initialize: function(attrs) {
      this.set('key', attrs.name.replace(/ /g, '-').toLowerCase());
    }
  });
});
