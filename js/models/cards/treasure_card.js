define(['backbone', 'models/cards/card'], function(Backbone, Card) {
  return Card.extend({
    type: 'TREASURE',
    // value: int
    // cost: int
    // name: string
    // key: string
  });
});
