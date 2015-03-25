define(['jquery', 'backbone',
  'views/game/supply', 'views/game/hand', 'views/game/view-only-play-area', 'views/game/info', 'hbars!templates/game/game',
  'models/game'],
function($, Backbone,
  SupplyView, HandView, ViewOnlyPlayAreaView, InfoView, template,
  Game) {
  return Backbone.View.extend({
    el: '#container',

    initialize: function() {
      this.game = new Game();

      this.supplyView = new SupplyView({el: '#supply'}, this.game.get('supply'));
      this.supplyView.bind("supply:card:clicked", this.supplyPileClicked, this);

      var turn = this.game.get('turn');
      this.handView = new HandView(turn.get('player').get('hand'));
      this.handView.bind("hand:card:clicked", this.handCardClicked, this);
      this.tableView = new ViewOnlyPlayAreaView({id: 'table', name: 'Table'}, turn.get('player').get('table'));
      this.playAreas = [this.handView, this.tableView];

      this.infoView = new InfoView({el: '#info'}, turn);
      this.infoView.bind("action-button:clicked", this.actionButtonClicked, this);

      // this.setupForTurn(turn); has been implicitly called by the above constructors

      this.initialRender();
    },

    setupForTurn: function(turn) {
      if (turn.isGameOver()) {
        this.handView.setHand(null);
        this.tableView.setCards(null);
      } else {
        this.handView.setHand(turn.get('player').get('hand'));
        this.tableView.setCards(turn.get('player').get('table'));
      }
      this.infoView.setTurn(turn);
    },

    initialRender: function() {
      this.$el.html(template());

      this.supplyView.render();
      
      var $playAreas = this.$el.find('#play-areas');
      $playAreas.empty();
      _.each(this.playAreas, function(playArea) {
        var selector = '#'+playArea.id;
        var $el = $('<div/>').attr('id', selector);
        $playAreas.append($el);
        playArea.el = selector;
        playArea.setElement($el);
        playArea.render();
      });

      this.nonSupplyRender();
    },

    nonSupplyRender: function() {
      _.each(this.playAreas, function(playArea) {
        playArea.render();
      });

      this.infoView.render();
    },

    supplyPileClicked: function(pile) {
      var success = this.game.get('turn').tryToSelectPile(pile);
      if (success) {
        // TODO: bind instead to this.turn.get('selected_piles');
        this.supplyView.render();
        this.infoView.render();
      }
    },

    handCardClicked: function(card) {
      var success = this.game.get('turn').tryToSelectHandCard(card);
      if (success) {
        this.nonSupplyRender();
      }
    },

    actionButtonClicked: function(turn_action) {
      this.game.get('turn').takeTurnAction(turn_action);
      if (this.game.get('turn').playState() == 'WAIT') {
        this.game.nextTurn();
        // TODO: instead, bind to the turn attr on this.game
        this.setupForTurn(this.game.get('turn'));
      }
      this.supplyView.render();
      this.nonSupplyRender();
    }
  });
});
