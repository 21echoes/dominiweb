define(['jquery', 'models/cards/lists/base', 'models/cards/lists/intrigue', 'models/cards/lists/prosperity'],
function($, Base, Intrigue, Prosperity) {
  return $.extend({}, Base, Intrigue, Prosperity);
});
