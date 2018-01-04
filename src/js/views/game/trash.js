define(['jquery', 'backbone', 'hbars!templates/game/play-area'], function($, Backbone, template) {
  return Backbone.View.extend({
    initialize: function(options, cards) {
      this.id = options.id;
      this.name = options.name;
      this.setCards(cards);
    },

    events: {
      "click li.card": "cardClicked"
    },

    setCards: function(cards) {
      this.cards = cards;
      this.render();
    },

    render: function() {
      var cardsJSON = this.cards !== null ? this.cards.toJSON() : [];
      this.$el.html(template({id: this.id, name: this.name, cards: cardsJSON}));
    },

    cardClicked: function(e) {
      var card_uid = $(e.currentTarget).data('uid');
      this.trigger("trash:card:clicked", this.cards.find_card_by_uid(card_uid));
    }
  });
});
