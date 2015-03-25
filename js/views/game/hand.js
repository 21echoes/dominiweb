define(['jquery', 'backbone', 'hbars!templates/game/play-area'], function($, Backbone, template) {
  return Backbone.View.extend({
    rendered: null,

    initialize: function(hand) {
      this.setHand(hand);
    },

    setHand: function(hand) {
      this.hand = hand;
      this.render();
    },

    render: function() {
      var handJSON = this.hand !== null ? this.hand.toJSON() : [];
      this.rendered = template({id: 'hand', name: 'Hand', cards: handJSON});
    }
  });
});
