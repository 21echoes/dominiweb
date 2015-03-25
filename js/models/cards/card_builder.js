define(['models/cards/card'], function(Card) {
  function CardBuilder(attrs) {
    this.attrs = attrs;
    this.build = function() {
      return new Card(this.attrs);
    }
  }
  return CardBuilder;
});
