define(['backbone', 'models/players/interactive_player'], function(Backbone, InteractivePlayer) {
  return Backbone.Model.extend({
    // player: InteractivePlayer
    // play_state_index: int

    initialize: function(player) {
      this.set('player', player);
      this.set('play_state_index', player.get('hand').find_cards_by_type('ACTION').length > 0 ? 0 : 1);
      this.set('num_actions', 1);
      this.set('num_buys', 1);
      this.set('num_coins', 0);
      this.set('selected_piles', []);
      this.set('selected_hand_cards', []);
    },

    takeTurnAction: function(action) {
      if (action == "no-more-actions") {
        this.advancePlayState();
      } else if (action == "no-more-treasures") {
        this.advancePlayState();
      } else if (action == "play-all-treasures") {
        var treasures = this.get('player').get('hand').find_cards_by_type("TREASURE");
        this.playTreasures(treasures);
        this.advancePlayState();
      } else if (action == "play-selected-treasures") {
        // this.get('player').play(this.get('player').get('hand').selectedCards());
      } else if (action == "buy") {
        this.tryToBuy(this.get('selected_piles')[0]);
      } else if (action == "end-turn") {
        this.end();
        // calls Game#nextTurn on its own
      }
    },

    playState: function() {
      return this.playStates[this.get('play_state_index')];
    },

    playStates: [
      'ACTIONS',
      'TREASURES',
      'BUY',
      'CLEAN_UP',
      'WAIT'
    ],

    advancePlayState: function() {
      var oldState = this.playState();
      var index = this.get('play_state_index');
      var new_index = (index + 1) % this.playStates.length;
      this.set('play_state_index', new_index);
    },

    playTreasures: function(treasures) {
      var num_coins = _.reduce(treasures, function(memo, treasure) {
        return memo + treasure.get('value');
      }, 0);
      this.set('num_coins', this.get('num_coins') + num_coins);
      this.get('player').play(treasures);
    },

    isPileValidToBuy: function(pile) {
      var cost = pile.get('builder').attrs.cost;
      var num_coins = this.get('num_coins');
      var num_buys = this.get('num_buys');
      return cost <= num_coins && num_buys > 0;
    },

    tryToSelectPile: function(pile) {
      if (this.playState() == 'BUY') {
        _.each(this.get('selected_piles'), function(pile) {
          pile.set('selected', false);
        });
        if (this.isPileValidToBuy(pile)) {
          this.set('selected_piles', [pile]);
          pile.set('selected', true);
          return true;
        }
        return false;
      }
      return false;
    },

    tryToBuy: function(pile) {
      if (this.playState() == 'BUY' && this.isPileValidToBuy(pile)) {
        this.set('num_coins', this.get('num_coins') - pile.get('builder').attrs.cost);
        this.set('num_buys', this.get('num_buys') - 1);
        this.get('player').get('discard').add(pile.getCard());

        _.each(this.get('selected_piles'), function(pile) {
          pile.set('selected', false);
        });
        this.set('selected_piles', []);

        if (this.get('num_buys') == 0) {
          this.end();
        }
        return true;
      }
      return false;
    },

    end: function() {
      this.get('player').get('discard').place(this.get('player').get('table'));
      this.get('player').get('discard').place(this.get('player').get('hand'));
      this.get('player').drawFive();
      this.set('play_state_index', this.playStates.length - 1);
    }
  });
});
