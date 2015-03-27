define(['backbone', 'models/game', 'models/cards/cards'], function(Backbone, Game, Cards) {
  return Backbone.Model.extend({
    // resolve : function
    
    canSelectHandCard: function(card, already_selected_cards) {
      return false;
    },

    canSelectPile: function(pile, already_selected_piles) {
      return false;
    }
  });
});
