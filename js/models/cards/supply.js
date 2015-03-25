define(['backbone', 'models/cards/supply_pile', 'models/cards/lists/meta'], function(Backbone, SupplyPile, CardList) {
  return Backbone.Collection.extend({
    model: SupplyPile,

    initialize: function() {
      this.models.push(new SupplyPile({count: 46, builder: CardList.Copper}));
      this.models.push(new SupplyPile({count: 40, builder: CardList.Silver}));
      this.models.push(new SupplyPile({count: 30, builder: CardList.Gold}));

      this.models.push(new SupplyPile({count: 10, builder: CardList.Curse}));

      this.models.push(new SupplyPile({count: 8, builder: CardList.Estate}));
      this.models.push(new SupplyPile({count: 8, builder: CardList.Duchy}));
      this.models.push(new SupplyPile({count: 8, builder: CardList.Province}));
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

    // TODO: these meta's need to be more selective -- only copper, silver, gold, platinum, curse, estate, duchy, province, colony
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
      return this.find_piles_by_type("curse");
    },

    empty_piles: function() {
      return this.filter(function (pile) { return pile.get('count') == 0; });
    }
  });
});
