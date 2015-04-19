define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed', 'models/resolutions/resolution_builder'],
function(CardBuilder, CardList, Revealed, ResolutionBuilder) {
  CardList.Seaside = {};

  CardList.Seaside.Warehouse = new CardBuilder({type: 'action', cost: 3, name: 'Warehouse'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(3);
      return ResolutionBuilder({
        source: 'hand',
        exact_count: 3
      }, {
        resolve: function(cards_arr) {
          turn.get('player').discard(cards_arr);
        }
      });
    }
  });
  CardList.Seaside.Cutpurse = new CardBuilder({type: 'action', cost: 4, name: 'Cutpurse'}, {
    performAction: function(turn) {
      turn.set('num_coins', turn.get('num_coins') + 2);
      _.each(turn.get('game').inactivePlayers(), function(player) {
        var coppers = player.get('hand').find_cards_by_key('copper');
        if (coppers.length > 0) {
          player.discard([coppers[0]]);
        }
      });
    }
  });
  CardList.Seaside.Salvager = new CardBuilder({type: 'action', cost: 4, name: 'Salvager'}, {
    performAction: function(turn) {
      turn.set('num_buys', turn.get('num_buys') + 1);
      return ResolutionBuilder({
        source: 'hand',
        exact_count: 1
      }, {
        resolve: function(cards_arr) {
          var card = cards_arr[0];
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          turn.set('num_coins', turn.get('num_coins') + card.get('cost'));
        }
      });
    }
  });
  CardList.Seaside.SeaHag = new CardBuilder({type: 'action', cost: 4, name: 'Sea Hag'}, {
    performAction: function(turn) {
      var curse_pile = turn.get('game').get('supply').meta_curse_pile();
      _.each(turn.get('game').inactivePlayers(), function(player) {
        var revealed = new Revealed();
        player.get('deck').drawInto(revealed, 1, turn.get('player').get('discard'));
        player.get('discard').placeFrom(revealed);

        var curse = curse_pile.getCard();
        if (curse) {
          player.get('deck').add([curse], {at: 0});
        }
      });
    }
  });
  CardList.Seaside.TreasureMap = new CardBuilder({type: 'action', cost: 4, name: 'Treasure Map'}, {
    performAction: function(turn) {
      var played_tm = [turn.get('player').get('table').find_cards_by_key('treasure-map')[0]];
      turn.get('player').get('table').moveSomeCardsInto(turn.get('game').get('trash'), played_tm);
      var hand_tm = turn.get('player').get('hand').find_cards_by_key('treasure-map');
      if (hand_tm.length > 0) {
        turn.get('player').trashFromHand([hand_tm[0]], turn.get('game').get('trash'));
        var gold_pile = turn.get('game').get('supply').find_pile_by_key("gold");
        _.each(_.range(4), function() {
          var gold = gold_pile.getCard();
          if (gold) {
            turn.get('player').get('deck').add([gold], {at: 0});
          }
        });
      }
    }
  });
  CardList.Seaside.Bazaar = new CardBuilder({type: 'action', cost: 5, name: 'Bazaar'}, {
    performAction: function(turn) {
      turn.get('player').draw(1);
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.set('num_coins', turn.get('num_coins') + 1);
    }
  });


  /* TODO
  Pearl Diver
  Ambassador
  Lookout
  Smugglers
  Navigator
  Explorer

  TOKENS
  Embargo
  Pirate Ship

  DURATIONS
  Haven
  Lighthouse
  Fishing Village
  Caravan
  Merchant Ship
  Outpost
  Tactician
  Wharf

  MORE MATS
  Native Village
  Island

  OTHER PLAYER INPUT
  Ghost Ship

  ON CLEANUP
  Treasury
  */

  return CardList;
});
