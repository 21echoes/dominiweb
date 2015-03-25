define(['models/cards/card'], function(Card) {
  function CardBuilder(attrs, functions) {
    this.attrs = attrs;
    this.functions = functions;
    this.build = function() {
      if (this.functions) {
        var NewCard = Card.extend(this.functions);
        return new NewCard(this.attrs);
      } else {
        return new Card(this.attrs);
      }
    }
  }
  return CardBuilder;
});
