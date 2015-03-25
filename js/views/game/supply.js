define(['jquery', 'backbone', 'hbars!templates/game/supply'], function($, Backbone, template) {
  return Backbone.View.extend({
    initialize: function(options, supply) {
      this.supply = supply;
    },

    events: {
      "click li.pile": "cardClicked"
    },

    render: function() {
      if (this.el == undefined) {
        this.setElement(this.$el.selector);
      }
      this.$el.html(template({
        meta_treasure_piles: _.map(this.supply.meta_treasure_piles(), function(pile) { return pile.toJSON(); }),
        meta_victory_piles: _.map(this.supply.meta_victory_piles(), function(pile) { return pile.toJSON(); }),
        meta_curse_pile: _.map(this.supply.meta_curse_pile(), function(pile) { return pile.toJSON(); }),
        kingdom_piles: _.map(this.supply.kingdom_piles(), function(pile) { return pile.toJSON(); })
      }));
    },

    cardClicked: function(e) {
      var id_prefix_re = /supply-pile-(.*)/;
      var card_key = id_prefix_re.exec($(e.currentTarget).attr('id'))[1];
      this.trigger("supply:card:clicked", this.supply.find_pile_by_key(card_key));
    }
  });
});
