define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    // resolve : function
    
    canSelectHandCard: function(card, already_selected_cards) {
      return false;
    },

    canSelectPile: function(pile, already_selected_piles) {
      return [false, null];
    },

    enoughHandCardsSelectedForResolution: function(selected, hand) {
      if (!this.get('min_count') || selected.length >= this.get('min_count')) {
        return true;
      }
      var self = this;
      var selectable_but_unselected = hand.findWhere(function(card) {
        selected.indexOf(card) == -1 && self.canSelectHandCard(card, selected);
      });
      // if there are selectable cards but they are not selected, then we are not ready to resolve
      return !selectable_but_unselected;
    },

    enoughSupplyPilesSelectedForResolution: function(selected, supply) {
      if (!this.get('min_count') || selected.length >= this.get('min_count')) {
        return true;
      }
      var self = this;
      var selectable_but_unselected = supply.findWhere(function(pile) {
        selected.indexOf(pile) == -1 && self.canSelectPile(pile, selected);
      });
      // if there are selectable piles but they are not selected, then we are not ready to resolve
      return !selectable_but_unselected;
    }
  });
});
