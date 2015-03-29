define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    // resolve : function
    
    canSelectHandCard: function(card, already_selected_cards) {
      return false;
    },

    canSelectPile: function(pile, already_selected_piles) {
      return [false, null];
    }
  });
});
