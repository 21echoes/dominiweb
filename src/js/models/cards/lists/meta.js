define(['models/cards/card_builder'], function(CardBuilder) {
  var CardList = {};
  CardList.Meta = {};

  CardList.Meta.Copper = new CardBuilder({type: 'treasure', value: 1, cost: 0, name: 'Copper', key: 'copper'});
  CardList.Meta.Silver = new CardBuilder({type: 'treasure', value: 2, cost: 3, name: 'Silver', key: 'silver'});
  CardList.Meta.Gold = new CardBuilder({type: 'treasure', value: 3, cost: 6, name: 'Gold', key: 'gold'});

  CardList.Meta.Curse = new CardBuilder({type: 'curse', value: -1, cost: 0, name: 'Curse', key: 'curse'});

  CardList.Meta.Estate = new CardBuilder({type: 'victory', value: 1, cost: 2, name: 'Estate', key: 'estate'});
  CardList.Meta.Duchy = new CardBuilder({type: 'victory', value: 3, cost: 5, name: 'Duchy', key: 'duchy'});
  CardList.Meta.Province = new CardBuilder({type: 'victory', value: 6, cost: 8, name: 'Province', key: 'province'});

  return CardList;
});
