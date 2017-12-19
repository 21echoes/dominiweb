define(['backbone', 'models/players/player', 'models/cards/cards'], function(Backbone, Player, Cards) {
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
          turn.advancePlayState();
        // TODO: check for action_resolution, resolve intelligently if so
        // TODO: finish and use this.playBestAction(turn);
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

    playBestAction: function(turn) {
        var bestAction = this.chooseBestActionToPlay(turn);
        if (bestAction) {
            turn.playAction(bestAction);
        }
    },

    chooseBestActionToPlay: function(turn) {
        var hand = turn.get('player').get('hand');

        var actionCards = hand.find_cards_by_type('action');
        if (actionCards.length === 0) {
            return null;
        }

        var dontPlayTypes = new Cards(['rats']);
        // TODO: don't play tactician if tactician already in play
        // TODO: don't play throne room if it's gonna make you play something in dontPlay

        // play a treasure map if you have 2 or more in hand
        if (hand.find_cards_by_key('treasure-map').length >= 2) {
            return hand.find_cards_by_key('treasure-map')[0];
        }
        dontPlay.add('treasure-map');

        if (hand.find_cards_by_key('throne-room').length > 0) {
            return hand.find_cards_by_key('throne-room')[0];
        }

        var bestEngineAction = this.getBestEngineAction(hand);
        if (bestEngineAction != null) {
          return bestEngineAction;
        }

        if (hand.find_cards_by_key('mine').length > 0 && this.mineableCards(hand) > 0) {
          return hand.find_cards_by_key('mine')[0];
        }
        dontPlay.add('mine');

        if (hand.find_cards_by_key('money-lender').length > 0
            && hand.find_cards_by_key('copper').length > 0) {
          return hand.find_cards_by_key('money-lender')[0];
        }
        dontPlay.add('money-lender');

        var preferenceOrder = [
            'sea-hag',
            'cutpurse',
            'militia',
            'bureaucrat',
            'library'
        ];
        for (var i = 0; i < preferenceOrder.length; i++) {
            var key = preferenceOrder[i];
            if (hand.find_cards_by_key(key).length > 0) {
              return hand.find_cards_by_key(key)[0];
            }
        }

        // TODO: sort by... cost?
        for (var i = 0; i < actionCards.length; i++) {
            var card = actionCards[i];
            if (dontPlay.indexOf(card.get('key')) !== -1) {
                continue;
            }
            return card;
        }
        return null;
    },

    getBestEngineAction: function(hand) {
        // TODO: need way to 'statically' analyze the cards in hand for how much they'll boost action count
        // if one exists, return the best one

        // TODO: need way to 'statically' analyze the cards in hand for how much they'll boost draw count
        // if one exists, return the best one
    }
  });
});
