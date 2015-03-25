define(['backbone', 'models/cards/card'], function(Backbone, Card) {
  return Card.extend({
    type: 'treasure',
    // value: int
    // cost: int
    // name: string
    // key: string
  });
});
