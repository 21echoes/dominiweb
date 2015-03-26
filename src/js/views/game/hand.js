define(['jquery', 'backbone', 'hbars!templates/game/play-area'], function($, Backbone, template) {
  return Backbone.View.extend({
    initialize: function(hand) {
      this.setHand(hand);
      this.id = 'hand';
      this.name = 'Hand';
    },

    events: {
      "click li.card": "cardClicked"
    },

    setHand: function(hand) {
      this.hand = hand;
      this.render();
    },

    render: function() {
      var handJSON = this.hand !== null ? _.map(this.hand.prioritySorted(), function(card) { return card.toJSON() }) : [];
      this.$el.html(template({id: this.id, name: this.name, cards: handJSON}));
    },

    cardClicked: function(e) {
      var card_uid = $(e.currentTarget).data('uid');
      this.trigger("hand:card:clicked", this.hand.find_card_by_uid(card_uid));
    }
  });
});
