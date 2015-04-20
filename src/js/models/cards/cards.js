define(['backbone', 'models/cards/card'], function(Backbone, Card) {
  return Backbone.Collection.extend({
    model: Card,

    // moves [count] cards from [this] into [hand], refilling [this] from shuffled [discard] as needed
    drawInto: function(hand, count, discard) {
      if (count <= this.length || discard == null || discard.length == 0) {
        hand.add(this.models.slice(0, count));
        this.reset(this.models.slice(count));
      } else {
        // empty the remaining deck
        var firstDrawCount = this.length;
        this.drawInto(hand, firstDrawCount, discard);
        // move discard into the deck & shuffle
        discard.drawInto(this, discard.length, null);
        this.reset(this.shuffle(), {silent: true});
        // finish drawing
        this.drawInto(hand, count - firstDrawCount, discard);
      }
    },

    // convenience method to move all of [hand] into [this] (without shuffling)
    placeFrom: function(hand) {
      hand.drawInto(this, hand.length, null);
    },

    moveSomeCardsInto: function(dest, cards_arr, options) {
      dest.add(cards_arr, options);
      this.remove(cards_arr);
    },

    find_cards_by_type: function(type) {
      return this.where({'type': type });
    },

    find_cards_by_key: function(key) {
      return this.where({'key': key });
    },

    find_card_by_uid: function(uid) {
      var components = uid.split('_');
      var key = components[0];
      var index = parseInt(components[1],10);
      var cards = this.where({'key': key, 'index': index});
      return cards.length > 0 ? cards[0] : null;
    },

    num_distinct: function() {
      return Object.keys(this.groupBy(function(card) {
        return card.get('key');
      })).length;
    }
  });
});
