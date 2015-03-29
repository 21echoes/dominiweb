define(['jquery', 'backbone',
  'views/game/supply', 'views/game/hand', 'views/game/view-only-play-area', 'views/game/info', 'hbars!templates/game/game',
  'models/game'],
function($, Backbone,
  SupplyView, HandView, ViewOnlyPlayAreaView, InfoView, template,
  Game) {
  return Backbone.View.extend({
    el: '#container',

    initialize: function(game) {
      this.game = game;

      this.supplyView = new SupplyView({el: '#supply'}, this.game.get('supply'));
      this.supplyView.bind("supply:card:clicked", this.supplyPileClicked, this);

      var turn = this.game.get('turn');
      this.handView = new HandView(turn.get('player').get('hand'));
      this.handView.bind("hand:card:clicked", this.handCardClicked, this);
      this.tableView = new ViewOnlyPlayAreaView({id: 'table', name: 'Table'}, turn.get('player').get('table'));
      this.trashView = new ViewOnlyPlayAreaView({id: 'trash', name: 'Trash'}, turn.get('game').get('trash'));
      this.playAreas = [this.handView, this.tableView, this.trashView];

      this.infoView = new InfoView({el: '#info'}, turn);
      this.infoView.bind("action-button:clicked", this.actionButtonClicked, this);

      // this.setupForTurn(turn); has been implicitly called by the above constructors, except
      this.setupBindingsForTurn(turn);

      this.initialRender();
    },

    setupForTurn: function(turn) {
      this.infoView.setTurn(turn);
      if (turn.isGameOver()) {
        this.handView.setHand(null);
        this.tableView.setCards(null);
      } else {
        this.handView.setHand(turn.get('player').get('hand'));
        this.tableView.setCards(turn.get('player').get('table'));
        this.setupBindingsForTurn(turn);
      }
    },

    setupBindingsForTurn: function(turn) {
      // TODO: maybe just easier to call .render every time?
      turn.get('player').get('hand').bind('change', this.handChanged, this);
      turn.get('player').get('table').bind('change', this.tableChanged, this);
      turn.get('game').get('trash').bind('change', this.trashChanged, this);
      turn.get('game').get('supply').bind('change', this.supplyChanged, this);
      turn.on('change', this.turnChanged, this);
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

    render: function() {
      this.supplyView.render();
      this.nonSupplyRender();
    },

    nonSupplyRender: function() {
      _.each(this.playAreas, function(playArea) {
        playArea.render();
      });

      this.infoView.render();
    },

    supplyPileClicked: function(pile) {
      this.game.get('turn').tryToSelectPile(pile);
    },

    handCardClicked: function(card) {
      this.game.get('turn').tryToSelectHandCard(card);
    },

    actionButtonClicked: function(turn_action) {
      this.game.get('turn').takeTurnAction(turn_action);
    },

    handChanged: function() {
      this.handView.render();
      this.infoView.render();
    },

    tableChanged: function() {
      this.tableView.render();
      this.infoView.render();
    },

    trashChanged: function() {
      this.trashView.render();
      this.infoView.render();
    },

    supplyChanged: function() {
      this.supplyView.render();
      this.infoView.render();
    },

    turnChanged: function() {
      if (this.game.get('turn').playState() == 'WAIT') {
        this.game.nextTurn();
        // TODO: instead, bind to the turn attr on this.game
        this.setupForTurn(this.game.get('turn'));

        // TODO: this should really be in the model..
        if (this.game.currentPlayer() && this.game.currentPlayer().key != 'interactive') {
          this.game.currentPlayer().driveTurn(this.game.get('turn'));
        }
      }
      this.render();
    }
  });
});
