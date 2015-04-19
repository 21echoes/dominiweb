define(['backbone', 'models/cards/deck', 'models/cards/hand', 'models/cards/discard', 'models/cards/table', 'models/cards/cards'],
  function(Backbone, Deck, Hand, Discard, Table, Cards) {
  return Backbone.Model.extend({
    initialize: function() {
      var deck = new Deck();
      deck.standardStart();
      this.set('deck', deck);
      this.set('discard', new Discard());
      this.set('hand', new Hand());
      this.set('table', new Table());

      this.draw(5);
    },

    draw: function(count) {
      this.get('deck').drawInto(this.get('hand'), count, this.get('discard'));
    },

    play: function(cards_arr) {
      this.get('hand').moveSomeCardsInto(this.get('table'), cards_arr);
    },

    discard: function(cards_arr) {
      this.get('hand').moveSomeCardsInto(this.get('discard'), cards_arr);
    },

    gainFromPile: function(pile) {
      if (pile) {
        this.get('discard').add(pile.getCard());
      }
    },

    trashFromHand: function(cards_arr, trash) {
      this.get('hand').moveSomeCardsInto(trash, cards_arr);
    },

    discardHand: function() {
      this.get('discard').placeFrom(this.get('hand'));
    },

    placeFromHandOnTopOfDeck: function(cards_arr) {
      this.get('hand').moveSomeCardsInto(this.get('deck'), cards_arr, {at: 0});
    },

    allCards: function() {
      var sources = [this.get('deck'), this.get('discard'), this.get('hand'), this.get('table')];
      var models = _.reduce(sources, function(memo, cards) {
        return memo.concat(cards.models)
      }, [])
      return new Cards(models);
    }
  });
});
