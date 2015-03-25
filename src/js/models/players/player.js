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

    play: function(cards) {
      this.get('hand').remove(cards);
      this.get('table').add(cards);
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