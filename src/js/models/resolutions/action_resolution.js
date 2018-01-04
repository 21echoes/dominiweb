define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    // resolve : function

    canSelectHandCard: function(card, already_selected_cards) {
      return false;
    },

    canSelectTrashCard: function(card, already_selected_cards) {
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
      var selectable_but_unselected = hand.find(function(card) {
        return selected.indexOf(card) == -1 && self.canSelectHandCard(card, selected);
      });
      // if there are selectable cards but they are not selected, then we are not ready to resolve
      return !selectable_but_unselected;
    },

    enoughTrashCardsSelectedForResolution: function(selected, trash) {
      if (!this.get('min_count') || selected.length >= this.get('min_count')) {
        return true;
      }
      var self = this;
      var selectable_but_unselected = trash.find(function(card) {
        return selected.indexOf(card) == -1 && self.canSelectTrashCard(card, selected);
      });
      // if there are selectable cards but they are not selected, then we are not ready to resolve
      return !selectable_but_unselected;
    },

    enoughSupplyPilesSelectedForResolution: function(selected, supply) {
      if (!this.get('min_count') || selected.length >= this.get('min_count')) {
        return true;
      }
      var self = this;
      var selectable_but_unselected = supply.find(function(pile) {
        return selected.indexOf(pile) == -1 && self.canSelectPile(pile, selected);
      });
      // if there are selectable piles but they are not selected, then we are not ready to resolve
      return !selectable_but_unselected;
    }
  });
});
