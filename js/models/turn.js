define(['backbone', 'models/players/interactive_player'], function(Backbone, InteractivePlayer) {
  return Backbone.Model.extend({
    // player: InteractivePlayer
    // play_state_index: int

    initialize: function(game) {
      this.set('game', game);
      var player = game.currentPlayer();
      this.set('player', player);
      this.set('play_state_index', 0);
      this.set('action_resolution', null);
      this.set('num_actions', 1);
      this.set('num_buys', 1);
      this.set('num_coins', 0);
      this.set('selected_piles', []);
      this.set('selected_hand_cards', []);

      var actionCards = player ? player.get('hand').find_cards_by_type('action') : [];
      if (actionCards.length == 0) {
        this.advancePlayState();
      } else {
        this.preSelectOnlyActionCard();
      }
    },

    takeTurnAction: function(action) {
      if (action == "play-selected-action") {
        this.playAction(this.get('selected_hand_cards')[0]);
      } else if (action == "no-more-actions") {
        this.advancePlayState();
      } else if (action == "no-more-treasures") {
        this.advancePlayState();
      } else if (action == "play-all-treasures") {
        var treasures = this.get('player').get('hand').find_cards_by_type("treasure");
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

      // TODO: finish TREASURES if no TREASURES cards
    },

    tryToSelectHandCard: function(card) {
      if (this.playState() == 'ACTIONS') {
        if (this.get('action_resolution') && this.get('action_resolution').get('input')) {
          // TODO: does the action resolution require hand card selection?
        } else {
          this.set('selected_hand_cards', [card]);
          card.set('selected', true);
          return true;
        }
      }
      return false;
    },

    playAction: function(action_card) {
      action_card.set('selected', false);
      this.set('selected_hand_cards', []);

      this.set('num_actions', this.get('num_actions') - 1);
      this.get('player').play([action_card]);

      var resolution_step = action_card.performAction(this);
      if (resolution_step && resolution_step.get('input')) {
          // TODO: how the fuck to handle input?
      } else {
        if (resolution_step) {
          _.each(resolution_step.get('players'), resolution_step.get('behavior'));
        }
        if (this.get('num_actions') == 0 || this.get('player').get('hand').find_cards_by_type('action').length == 0) {
          this.advancePlayState();
        } else {
          this.preSelectOnlyActionCard();
        }
      }
    },

    preSelectOnlyActionCard: function() {
      var actionCards = this.get('player').get('hand').find_cards_by_type('action');
      var uniqueActionCards = _.reduce(actionCards, function(memo, card) {
        if (memo.indexOf(card.get('key')) === -1) {
          memo.push(card.get('key'));
        }
        return memo;
      }, []);
      if (uniqueActionCards.length == 1) {
        this.tryToSelectHandCard(actionCards[0]);
      }
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
      this.get('player').get('discard').placeFrom(this.get('player').get('table'));
      this.get('player').get('discard').placeFrom(this.get('player').get('hand'));
      this.get('player').draw(5);
      this.set('play_state_index', this.playStates.length - 1);
    },

    isGameOver: function() {
      return this.get('player') === null;
    }
  });
});
