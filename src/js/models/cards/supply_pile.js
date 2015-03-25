define(['backbone', 'models/cards/card'], function(Backbone, Card) {
  return Backbone.Model.extend({
    // builder: CardBuilder
    // count: int
    // selected: bool

    defaults: {
      selected: false
    },

    getCard: function() {
      if (this.get('count') <= 0) {
        return;
      }
      this.set('count', this.get('count') - 1);
      return this.get('builder').build();
    }
  });
});
