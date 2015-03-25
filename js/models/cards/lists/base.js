define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed'], function(CardBuilder, CardList, Revealed) {
  CardList.Market = new CardBuilder({type: 'action', cost: 5, name: 'Market', key: 'market'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 1);
      turn.get('player').draw(1);
    }
  });
  CardList.Adventurer = new CardBuilder({type: 'action', cost: 6, name: 'Adventurer', key: 'adventurer'}, {
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
  CardList.Festival = new CardBuilder({type: 'action', cost: 5, name: 'Festival', key: 'festival'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 2);
    }
  });
  CardList.Laboratory = new CardBuilder({type: 'action', cost: 5, name: 'Laboratory', key: 'laboratory'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(2);
    }
  });
  CardList.Smithy = new CardBuilder({type: 'action', cost: 4, name: 'Smithy', key: 'smithy'}, {
    performAction: function(turn) {
      turn.get('player').draw(3);
    }
  });
  CardList.Village = new CardBuilder({type: 'action', cost: 3, name: 'Village', key: 'village'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.get('player').draw(1);
    }
  });
  CardList.Woodcutter = new CardBuilder({type: 'action', cost: 3, name: 'Woodcutter', key: 'woodcutter'}, {
    performAction: function(turn) {
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 2);
    }
  });
  // CardList.Moat = new CardBuilder({type: 'action', cost: 2, name: 'Moat', key: 'moat'}, {
  //   performAction: function(turn) {
  //     turn.get('player').draw(2);
  //   }

  //   // TODO: reaction on being attacked
  // });
  // CardList.CouncilRoom = new CardBuilder({type: 'action', cost: 5, name: 'Council Room', key: 'council-room'}, {
  //   performAction: function(turn) {
  //     turn.set('num_buys', turn.get('num_buys') + 1);
  //     turn.get('player').draw(4);

  //     // TODO: all other players draw 1
  //   }
  // });
  // CardList.Library = new CardBuilder({type: 'action', cost: 5, name: 'Library', key: 'library'}, {
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

  // TODO: implement calculateScore
  // CardList.Gardens = new CardBuilder({type: 'victory', cost: 4, name: 'Gardens', key: 'gardens'}, {
  //   calculateScore: function(deck) {
  //     return Math.floor(deck.length / 10);
  //   }
  // });

  /* TODO:
    Bureaucrat
    Cellar
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
    Witch
    Workshop,
  */
  
  return CardList;
});
