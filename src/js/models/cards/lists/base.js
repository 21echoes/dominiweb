define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed', 'models/resolutions/resolution_builder'],
  function(CardBuilder, CardList, Revealed, ResolutionBuilder) {
  CardList.Market = new CardBuilder({type: 'action', cost: 5, name: 'Market'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 1);
      turn.get('player').draw(1);
    }
  });
  CardList.Adventurer = new CardBuilder({type: 'action', cost: 6, name: 'Adventurer'}, {
    performAction: function(turn) {
      var revealed_holding = new Revealed();
      var revealed_treasures = new Revealed();
      var revealed_non_treasures = new Revealed();
      while (revealed_treasures.length < 2 &&
        (turn.get('player').get('deck').length + turn.get('player').get('discard').length) > 0)
      {
        turn.get('player').get('deck').drawInto(revealed_holding, 1, turn.get('discard'));
        if (revealed_holding.models[0].get('type') == 'treasure') {
          revealed_treasures.placeFrom(revealed_holding);
        } else {
          revealed_non_treasures.placeFrom(revealed_holding);
        }
      }
      turn.get('player').get('hand').placeFrom(revealed_treasures);
      turn.get('player').get('discard').placeFrom(revealed_non_treasures);
    }
  });
  CardList.Festival = new CardBuilder({type: 'action', cost: 5, name: 'Festival'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 2);
    }
  });
  CardList.Laboratory = new CardBuilder({type: 'action', cost: 5, name: 'Laboratory'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(2);
    }
  });
  CardList.Smithy = new CardBuilder({type: 'action', cost: 4, name: 'Smithy'}, {
    performAction: function(turn) {
      turn.get('player').draw(3);
    }
  });
  CardList.Village = new CardBuilder({type: 'action', cost: 3, name: 'Village'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.get('player').draw(1);
    }
  });
  CardList.Woodcutter = new CardBuilder({type: 'action', cost: 3, name: 'Woodcutter'}, {
    performAction: function(turn) {
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 2);
    }
  });
  CardList.CouncilRoom = new CardBuilder({type: 'action', cost: 5, name: 'Council Room'}, {
    performAction: function(turn) {
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.get('player').draw(4);
      _.each(turn.get('game').inactivePlayers(), function(player) {
        player.draw(1);
      });
    }
  });
  CardList.Witch = new CardBuilder({type: 'action', cost: 5, name: 'Witch'}, {
    performAction: function(turn) {
      turn.get('player').draw(2);
      var curse_pile = turn.get('game').get('supply').meta_curse_pile();
      _.each(turn.get('game').inactivePlayers(), function(player) {
        if (curse_pile.get('count') > 0) {
          player.get('discard').add(curse_pile.getCard());
        }
      });
    }
  });
  // CardList.Moat = new CardBuilder({type: 'action', cost: 2, name: 'Moat'}, {
  //   performAction: function(turn) {
  //     turn.get('player').draw(2);
  //   }

  //   // TODO: reaction on being attacked
  // });
  // CardList.Library = new CardBuilder({type: 'action', cost: 5, name: 'Library'}, {
  //   performAction: function(turn) {
  //     var revealed_holding = new Revealed();
  //     var set_aside_actions = new Revealed();
  //     while (turn.get('player').get('hand').length < 7 &&
  //       (turn.get('player').get('deck').length + turn.get('player').get('discard').length) > 0)
  //     {
  //       turn.get('player').get('deck').drawInto(revealed_holding, 1, turn.get('discard'));
  //       // TODO: user chooses whether or not to discard..
  //       var user_discards = true;
  //       if (revealed_holding.models[0].get('type') == 'action' && user_discards) {
  //         set_aside_actions.placeFrom(revealed_holding);
  //       } else {
  //         turn.get('player').get('hand').placeFrom(revealed_holding);
  //       }
  //     }
  //     turn.get('player').get('discard').placeFrom(set_aside_actions);
  //   }
  // });
  CardList.Cellar = new CardBuilder({type: 'action', cost: 2, name: 'Cellar'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      return ResolutionBuilder({
        source: 'hand'
      }, {
        resolve: function(cards_arr) {
          turn.get('player').discard(cards_arr);
          turn.get('player').draw(cards_arr.length);
          return true;
        }
      });
    }
  });

  CardList.Gardens = new CardBuilder({type: 'victory', cost: 4, name: 'Gardens'}, {
    calculateScore: function(deck) {
      return Math.floor(deck.length / 10);
    }
  });

  /* TODO:
    Bureaucrat
    Chancellor
    Chapel
    Feast
    Militia
    Mine
    MoneyLender
    Remodel
    Spy
    Thief
    ThroneRoom
    Workshop,
  */
  
  return CardList;
});
