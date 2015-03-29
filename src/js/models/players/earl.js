define(['backbone', 'models/players/player'], function(Backbone, Player) {
  return Player.extend({
    key: 'earl',

    driveTurn: function(turn) {
      this.bindToTurn(turn);
      this.turnChanged(turn);
    },

    bindToTurn: function(turn) {
      // TODO: more bindings?
      turn.bind('change:play_state_index', this.turnChanged, this);
    },

    turnChanged: function(turn) {
      if (turn.playState() == 'ACTIONS') {
        // TODO: check for action_resolution
        // else, check for playable actions, choose one, play it, rinse & repeat
      } else if (turn.playState() == 'TREASURES') {
        turn.takeTurnAction('play-all-treasures');
      } else if (turn.playState() == 'BUY') {
        var pile = this.chooseBestPile(turn);
        if (pile) {
          console.log('buying',pile.get('builder').attrs.key);
          turn.tryToSelectPile(pile);
          turn.takeTurnAction('buy');
        } else {
          console.log('cant buy with just',turn.get('num_coins'));
          turn.cleanUp();
        }
        // TODO: bind to what to buy again if more than one buy?
      }
    },

    chooseBestPile: function(turn) {
      var supply = turn.get('game').get('supply');
      var province_pile = supply.find_pile_by_key('province');
      if (turn.isPileValidToBuy(province_pile)) {
        return province_pile;
      }
      var duchy_pile = supply.find_pile_by_key('duchy');
      if (turn.isPileValidToBuy(duchy_pile) && province_pile.get('count') <= 5) {
        return duchy_pile;
      }
      var estate_pile = supply.find_pile_by_key('estate');
      if (turn.isPileValidToBuy(estate_pile) && province_pile.get('count') <= 2) {
        return estate_pile;
      }
      var gold_pile = supply.find_pile_by_key('gold');
      if (turn.isPileValidToBuy(gold_pile)) {
        return gold_pile;
      }
      var silver_pile = supply.find_pile_by_key('silver');
      if (turn.isPileValidToBuy(silver_pile)) {
        return silver_pile;
      }
      return null;
    },
  });
});
