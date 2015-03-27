define(['backbone', 'models/cards/supply_pile', 'models/cards/lists/base'], function(Backbone, SupplyPile, CardList) {
  return Backbone.Collection.extend({
    model: SupplyPile,

    initialize: function() {
      this.add(new SupplyPile({count: 46, builder: CardList.Copper}));
      this.add(new SupplyPile({count: 40, builder: CardList.Silver}));
      this.add(new SupplyPile({count: 30, builder: CardList.Gold}));

      this.add(new SupplyPile({count: 10, builder: CardList.Curse}));

      this.add(new SupplyPile({count: 8, builder: CardList.Estate}));
      this.add(new SupplyPile({count: 8, builder: CardList.Duchy}));
      this.add(new SupplyPile({count: 8, builder: CardList.Province}));

      this.add(new SupplyPile({count: 10, builder: CardList.Workshop}));
      this.add(new SupplyPile({count: 10, builder: CardList.Cellar}));
      this.add(new SupplyPile({count: 10, builder: CardList.Market}));
      this.add(new SupplyPile({count: 10, builder: CardList.Adventurer}));
      this.add(new SupplyPile({count: 10, builder: CardList.Festival}));
      this.add(new SupplyPile({count: 10, builder: CardList.Laboratory}));
      this.add(new SupplyPile({count: 10, builder: CardList.Smithy}));
      this.add(new SupplyPile({count: 10, builder: CardList.Village}));
      this.add(new SupplyPile({count: 10, builder: CardList.Woodcutter}));
      this.add(new SupplyPile({count: 8, builder: CardList.Gardens}));
      this.add(new SupplyPile({count: 10, builder: CardList.CouncilRoom}));
      this.add(new SupplyPile({count: 10, builder: CardList.Witch}));
      this.add(new SupplyPile({count: 10, builder: CardList.Chapel}));
      this.add(new SupplyPile({count: 10, builder: CardList.Mine}));
      this.add(new SupplyPile({count: 10, builder: CardList.MoneyLender}));
      this.add(new SupplyPile({count: 10, builder: CardList.Remodel}));
      this.add(new SupplyPile({count: 10, builder: CardList.Feast}));
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
