define(['backbone', 'models/cards/supply', 'models/turn', 'models/players/interactive_player'], function(Backbone, Supply, Turn, InteractivePlayer) {
  return Backbone.Model.extend({
    initialize: function() {
      this.set('supply', new Supply());
      this.set('players', [new InteractivePlayer()]);
      this.set('current_player_index', 0);
      this.set('turn', new Turn(this.currentPlayer()));
    },

    currentPlayer: function() {
      var index = this.get('current_player_index');
      if (index >= 0) {
        return this.get('players')[this.get('current_player_index')];
      } else {
        return null;
      }
    },

    nextTurn: function() {
      if (this.gameIsOver()) {
        console.log('GAME OVER!');
        this.set('turn', null);
        this.set('current_player_index', -1);
      } else {
        var next_index = (this.get('current_player_index') + 1) % this.get('players').length;
        this.set('current_player_index', next_index);
        this.set('turn', new Turn(this.currentPlayer()));
      }
    },

    gameIsOver: function() {
      var empty_piles = this.get('supply').empty_piles();
      if (empty_piles.length >= 3) {
        return true;
      } else if (_.find(empty_piles, function (pile) { return pile.get('builder').attrs.key == 'province'; })) {
        return true;
      }
      return false;
    }
  });
});
