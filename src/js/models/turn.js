define(['backbone', 'models/players/player'], function(Backbone, Player) {
  return Backbone.Model.extend({
    // player: Player
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
      } else if (action == "choose-selected-for-resolution"
        || action.startsWith("choose-resolution-prompt")) {
        var nextResolution = this.resolveAction(action);
        this.set('action_resolution', nextResolution);
        if (!nextResolution) {
          this.finishedAnAction();
        }
      } else if (action == "no-more-actions") {
        // TODO: deselect all actions in hand
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
        this.cleanUp();
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
      // TODO: clicking selected should de-select
      if (this.playState() == 'ACTIONS') {
        if (this.get('action_resolution')
          && this.get('action_resolution').get('source') == 'hand') {
          if (this.get('action_resolution').canSelectHandCard(card, this.get('selected_hand_cards'))) {
            this.set('selected_hand_cards', this.get('selected_hand_cards').concat([card]));
            card.set('selected', true);
            if (this.get('action_resolution').get('max_count')
              && this.get('action_resolution').get('max_count') < this.get('selected_hand_cards').length) {
              var first_selected = this.get('selected_hand_cards').splice(0, 1)[0];
              first_selected.set('selected', false);
            }
            return true;
          } else {
            return false;
          }
        } else if (card.get('type') == 'action') {
          // when not resolving actions, you can only select one card at a time
          _.each(this.get('selected_hand_cards'), function(card) {
            card.set('selected', false);
          });
          this.set('selected_hand_cards', [card]);
          card.set('selected', true);
          return true;
        }
      } else if (this.playState() == 'TREASURES') {
        if (card.get('type') == 'treasure') {
          if (card.get('selected')) {
            var index_in_selection = this.get('selected_hand_cards').indexOf(card);
            if (index_in_selection != -1) {
              this.get('selected_hand_cards').splice(index_in_selection, 1);
            }
            card.set('selected', false);
            return false;
          } else {
            this.set('selected_hand_cards', this.get('selected_hand_cards').concat([card]));
            card.set('selected', true);
            return true;
          }
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
      if (resolution_step) {
        this.set('action_resolution', resolution_step);
        // board will handle input here
      } else {
        this.finishedAnAction();
      }
    },

    resolveAction: function(action_str) {
      var ar = this.get('action_resolution');
      if (ar.get('source')) {
        var selected = [];
        if (ar.get('source') == 'hand') {
          selected = this.get('selected_hand_cards');
          this.set('selected_hand_cards', []);
        } else if (ar.get('source') == 'supply') {
          selected = this.get('selected_piles');
          this.set('selected_piles', []);
        }
        _.each(selected, function(card_or_pile) {
          card_or_pile.set('selected', false);
        });
        return ar.resolve(selected);
      } else if (ar.get('prompt_buttons')) {
        var components = action_str.split('_');
        var button_index = parseInt(components[1],10);
        return ar.resolve(button_index);
      }
    },

    finishedAnAction: function() {
      if (this.get('num_actions') == 0 || this.get('player').get('hand').find_cards_by_type('action').length == 0) {
        this.advancePlayState();
      } else {
        this.preSelectOnlyActionCard();
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
      var cards_left = pile.get('count');
      return cost <= num_coins && num_buys > 0 && cards_left > 0;
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
      } else if (this.playState() == 'ACTIONS'
        && this.get('action_resolution')
        && this.get('action_resolution').get('source') == 'supply') {
        var selection_result = this.get('action_resolution').canSelectPile(pile, this.get('selected_piles'));
        if (selection_result[0]) {
          _.each(this.get('selected_piles'), function(pile) {
            pile.set('selected', false);
          });
          this.set('selected_piles', selection_result[1]);
          _.each(this.get('selected_piles'), function(pile) {
            pile.set('selected', true);
          });
          return true;
        } else {
          return false;
        }
      }
      return false;
    },

    tryToBuy: function(pile) {
      if (this.playState() == 'BUY' && this.isPileValidToBuy(pile)) {
        this.set('num_coins', this.get('num_coins') - pile.get('builder').attrs.cost);
        this.set('num_buys', this.get('num_buys') - 1);
        this.get('player').gainFromPile(pile);

        _.each(this.get('selected_piles'), function(pile) {
          pile.set('selected', false);
        });
        this.set('selected_piles', []);

        if (this.get('num_buys') == 0) {
          this.cleanUp();
        }
        return true;
      }
      return false;
    },

    cleanUp: function() {
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
