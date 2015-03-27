define(['backbone', 'models/cards/cards', 'models/cards/lists/meta'], function(Backbone, Cards, CardList) {
  return Cards.extend({
    standardStart: function() {
      var start = [];
      _.each(_.range(7), function() {
        start.push(CardList.Meta.Copper.build());
      });
      _.each(_.range(3), function() {
        start.push(CardList.Meta.Estate.build());
      });
      start = _.shuffle(start);
      this.reset(start);
    }
  });
});
