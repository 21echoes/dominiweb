define(['jquery', 'backbone', 'hbars!templates/game/info'], function($, Backbone, template) {
  return Backbone.View.extend({
    initialize: function(options, turn) {
      this.setTurn(turn);
    },

    setTurn: function(turn) {
      this.turn = turn;
      this.render();
    },

    events: {
      "click #action-buttons button": "clickActionButton"
    },

    render: function() {
      if (this.el == undefined) {
        this.setElement(this.$el.selector);
      }

      if (this.turn.isGameOver()) {
        var self = this;
        var score_strs = _.map(this.turn.get('game').scores(), function(score, index) {
          return ""+(self.turn.get('game').get('players')[index].get('name'))+": "+score;
        });
        this.$el.html(template({
          instructions: this.getInstructions(),
          score_strs: score_strs
        }));
        this.$el.find('#turn-indicator').remove();
        this.$el.find('#turn-state').remove();
        this.$el.find('#action-buttons').remove();
        this.$el.find('#player-stats').remove();
      } else {
        var instructions = this.getInstructions();

        var action_buttons = this.getActionButtons();

        this.$el.html(template({
          num_actions: this.turn.get('num_actions'),
          num_buys: this.turn.get('num_buys'),
          num_coins: this.turn.get('num_coins'),

          player_name: this.turn.get('player').get('name'),

          instructions: instructions,

          action_buttons : action_buttons,

          deck_size: this.turn.get('player').get('deck').length,
          discard_size: this.turn.get('player').get('discard').length,
          hand_size: this.turn.get('player').get('hand').length
        }));
      }
    },

    getInstructions: function() {
      if (this.turn.isGameOver()) {
        return "Game Over!"
      } else if (this.turn.playState() == 'ACTIONS') {
        if (this.turn.get('action_resolution')
          && this.turn.get('action_resolution').get('input')) {
          return this.turn.get('action_resolution').get('input');
        } else {
          return "Pick an action card from your hand to play";
        }
      } else if (this.turn.playState() == 'TREASURES') {
        var num_treasures = this.turn.get('player').get('hand').find_cards_by_type("treasure").length;
        if (num_treasures > 1) {
          return "Pick up to "+num_treasures+" treasure cards from your hand to use for money";
        } else {
          return "Pick a treasure card from your hand to use for money";
        }
      } else if (this.turn.playState() == 'BUY') {
        return "Select a card from the table that costs at most ("+this.turn.get('num_coins')+") to buy";
      } else {
        return "";
      }
    },

    getActionButtons: function() {
      if (this.turn.isGameOver()) {
        return [];
      } else if (this.turn.playState() == 'ACTIONS') {
        if (this.turn.get('action_resolution')) {
          // TODO: enabled? based on min_ max_ and exact_ count, preferrably in convenience method
          var str = this.turn.get('selected_hand_cards').length > 0 ? "Done" : "None";
          return [{key: 'choose-selected-for-resolution', text: str}];
        } else {
          var play_enabled = this.turn.get('selected_hand_cards').length > 0;
          return [{key: 'play-selected-action', text: 'Play', disabled: !play_enabled},
          {key: 'no-more-actions', text: 'None'}];
        }
      } else if (this.turn.playState() == 'TREASURES') {
        return [{key: 'play-all-treasures', text: 'All'},
        {key: 'no-more-treasures', text: 'None'}];
      } else if (this.turn.playState() == 'BUY') {
        var buy_enabled = this.turn.get('selected_piles').length > 0;
        return [{key: 'buy', text: 'Buy', disabled: !buy_enabled},
          {key: 'end-turn', text: 'End Turn'}];
      } else {
        return [];
      }
    },

    clickActionButton: function(e) {
      var id_prefix_re = /action-(.*)/;
      var action = id_prefix_re.exec($(e.currentTarget).attr('id'))[1];
      this.trigger("action-button:clicked", action);
    }
  });
});
