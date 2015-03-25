define(['backbone', 'models/cards/deck', 'models/cards/hand', 'models/cards/discard', 'models/cards/table'],
  function(Backbone, Deck, Hand, Discard, Table) {
  return Backbone.Model.extend({
    initialize: function() {
      var deck = new Deck();
      deck.standardStart();
      this.set('deck', deck);
      this.set('discard', new Discard());
      this.set('hand', new Hand());
      this.set('table', new Table());

      this.drawFive();
    },

    drawFive: function() {
      this.get('deck').drawInto(this.get('hand'), 5, this.get('discard'));
    },

    play: function(cards) {
      this.get('hand').remove(cards);
      this.get('table').add(cards);
    },
  });
});
