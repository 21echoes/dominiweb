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
      var handJSON = this.hand !== null ? _.map(this.hand.prioritySorted(), function(card) { return card.toJSON() }) : [];
      this.rendered = template({id: 'hand', name: 'Hand', cards: handJSON});
    }
  });
});
