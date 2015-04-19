define(['jquery', 'models/cards/lists/base',
  'models/cards/lists/intrigue', 'models/cards/lists/prosperity', 'models/cards/lists/seaside'],
function($, Base, Intrigue, Prosperity, Seaside) {
  return $.extend({}, Base, Intrigue, Prosperity, Seaside);
});
