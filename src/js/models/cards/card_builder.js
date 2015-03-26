define(['models/cards/card'], function(Card) {
  function CardBuilder(attrs, functions) {
    this.attrs = attrs;
    this.functions = functions;
    this.attrs.index = 0;
    this.attrs.key = this.attrs.name.replace(/ /g, '_').toLowerCase();
    this.build = function() {
      this.attrs.index = this.attrs.index + 1;
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
