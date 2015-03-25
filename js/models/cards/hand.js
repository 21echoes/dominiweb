define(['backbone', 'models/cards/cards'], function(Backbone, Cards) {
  return Cards.extend({
    prioritySorted: function() {
      return _.sortBy(this.models, function(card) {
        if (card.get('type') == 'action') {
          return -1000 - card.get('cost');
        } else if (card.get('type') == 'treasure') {
          return -500 - card.get('cost');
        } else if (card.get('type') == 'victory') {
          return -card.get('cost');
        } else if (card.get('type') == 'curse') {
          return 500 - card.get('cost');
        }
      });
    }
  });
});
