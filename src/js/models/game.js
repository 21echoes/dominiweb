define(['backbone',
  'models/cards/supply', 'models/cards/trash', 'models/turn',
  'models/game_setup', 'models/cards/kingdoms/all_kingdoms', 'models/players/all_players'],
function(Backbone, Supply, Trash, Turn, GameSetup, Kingdoms, Players) {
  return Backbone.Model.extend({
    initialize: function(gameSetup) {
      gameSetup = this.normalizeSetup(gameSetup);
      this.set('supply', new Supply([], {kingdom: gameSetup.get('kingdom')}));
      this.set('trash', new Trash());
      this.set('players', gameSetup.get('players'));
      this.set('current_player_index', 0);
      this.set('turn', new Turn(this));
    },

    normalizeSetup: function(gameSetup) {
      if (!gameSetup) {
        gameSetup = new GameSetup({});
      }
      if (!gameSetup.get('kingdom')) {
        gameSetup.set('kingdom', Kingdoms.getKingdom('first-game')); // TODO: which is default?
      }
      if (!gameSetup.get('players') || gameSetup.get('players').length == 0) {
        var InteractivePlayer = Players.getPlayer('interactive');
        gameSetup.set('players', [
          new InteractivePlayer({name: 'Player 1'}),
          new InteractivePlayer({name: 'Player 2'}) // TODO: what's the default?
        ]);
      }
      return gameSetup;
    },

    currentPlayer: function() {
      var index = this.get('current_player_index');
      if (index >= 0) {
        return this.get('players')[this.get('current_player_index')];
      } else {
        return null;
      }
    },

    inactivePlayers: function() {
      var index = this.get('current_player_index');
      if (index >= 0) {
        var numOtherPlayers = this.get('players').length - 1;
        var self = this;
        return _.map(_.range(numOtherPlayers), function(offset) {
          var other_player_index = (index + offset + 1) % (numOtherPlayers + 1);
          return self.get('players')[other_player_index];
        })
      } else {
        return this.get('players');
      }
    },

    nextTurn: function() {
      if (this.gameIsOver()) {
        this.set('current_player_index', -1);
      } else {
        var next_index = (this.get('current_player_index') + 1) % this.get('players').length;
        this.set('current_player_index', next_index);
      }
      this.set('turn', new Turn(this));
    },

    gameIsOver: function() {
      var empty_piles = this.get('supply').empty_piles();
      if (empty_piles.length >= 3) {
        return true;
      } else if (_.find(empty_piles, function (pile) { return pile.get('builder').attrs.key == 'province'; })) {
        return true;
      }
      return false;
    },

    scores: function() {
      return _.map(this.get('players'), this.score);
    },

    score: function(player) {
      var all_cards = player.allCards();
      return all_cards.reduce(function (memo, card) {
        if (card.get('type') == 'victory' || card.get('type') == 'curse') {
          if (card.get('value')) {
            return memo + card.get('value');
          } else {
            return memo + card.calculateScore(all_cards);
          }
        }
        return memo;
      }, 0);
    }
  });
});
