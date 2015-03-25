define(['backbone', 'models/cards/supply_pile', 'models/cards/lists/meta_card_list'], function(Backbone, SupplyPile, CardList) {
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

    // TODO: these meta's need to be more selective -- only copper, silver, gold, platinum, curse, estate, duchy, province, colony
    meta_treasure_piles: function() {
      return this.find_piles_by_type("TREASURE");
    },

    meta_victory_piles: function() {
      return this.find_piles_by_type("VICTORY");
    },

    meta_curse_pile: function() {
      return this.find_piles_by_type("CURSE");
    },

    empty_piles: function() {
      return this.filter(function (pile) { return pile.get('count') == 0; });
    }
  });
});
