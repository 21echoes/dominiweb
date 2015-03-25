define(['models/cards/card_builder', 'models/cards/lists/meta'], function(CardBuilder, CardList) {
  CardList.Market = new CardBuilder({type: 'action', cost: 5, name: 'Market', key: 'market'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 1);
      turn.get('player').draw(1);
    }
  });

  /* TODO:
    Gardens
    Moat
    Adventurer
    Bureaucrat
    Cellar
    Chancellor
    Chapel
    CouncilRoom
    Feast
    Festival
    Laboratory
    Library
    Militia
    Mine
    MoneyLender
    Remodel
    Smithy
    Spy
    Thief
    ThroneRoom
    Village
    Witch
    Woodcutter
    Workshop,
  */
  
  return CardList;
});
