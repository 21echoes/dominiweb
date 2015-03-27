define(['backbone', 'models/cards/supply_pile', 'models/cards/lists/all_cards'], function(Backbone, SupplyPile, CardList) {
  return Backbone.Collection.extend({
    model: SupplyPile,

    initialize: function(models, options) {
      models.push(new SupplyPile({count: 46, builder: CardList.Meta.Copper}));
      models.push(new SupplyPile({count: 40, builder: CardList.Meta.Silver}));
      models.push(new SupplyPile({count: 30, builder: CardList.Meta.Gold}));

      models.push(new SupplyPile({count: 10, builder: CardList.Meta.Curse}));

      models.push(new SupplyPile({count: 8, builder: CardList.Meta.Estate}));
      models.push(new SupplyPile({count: 8, builder: CardList.Meta.Duchy}));
      models.push(new SupplyPile({count: 8, builder: CardList.Meta.Province}));

      // TODO: determine if Colony game, if Shelters game, etc.

      var kingdom = options.kingdom;
      _.each(kingdom.get('cards'), function(builder) {
        var count = 10;
        if (builder.attrs.type == 'victory') {
          count = 8;
        }
        models.push(new SupplyPile({count: count, builder: builder}));
        // TODO: if Tournament, add Prizes, etc.
      });
    },

    comparator: function(model) {
      return model.get('builder').attrs.cost;
    },

    find_piles_by_type: function(type) {
      return this.filter(function (pile) { return pile.get('builder').attrs.type == type; });
    },

    find_piles_by_name: function(name) {
      return this.filter(function (pile) { return pile.get('builder').attrs.name == name; });
    },

    find_pile_by_key: function(key) {
      var piles = this.filter(function (pile) { return pile.get('builder').attrs.key == key; });
      return piles.length > 0 ? piles[0] : null;
    },

    meta_treasure_keys: ['copper', 'silver', 'gold', 'platinum'],
    meta_victory_keys: ['estate', 'duchy', 'province', 'colony'],

    meta_treasure_piles: function() {
      var self = this;
      return this.filter(function (pile) {
        return self.meta_treasure_keys.indexOf(pile.get('builder').attrs.key) !== -1;
      });
    },

    meta_victory_piles: function() {
      var self = this;
      return this.filter(function (pile) {
        return self.meta_victory_keys.indexOf(pile.get('builder').attrs.key) !== -1;
      });
    },

    meta_curse_pile: function() {
      return this.find_piles_by_type("curse")[0];
    },

    kingdom_piles: function() {
      var meta_keys = this.meta_treasure_keys.concat(this.meta_victory_keys).concat(['curse']);
      return this.filter(function (pile) {
        return meta_keys.indexOf(pile.get('builder').attrs.key) === -1;
      });
    },

    empty_piles: function() {
      return this.filter(function (pile) { return pile.get('count') == 0; });
    }
  });
});
