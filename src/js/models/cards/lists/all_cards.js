define(['jquery', 'models/cards/lists/base',
  'models/cards/lists/intrigue', 'models/cards/lists/prosperity',
  'models/cards/lists/seaside', 'models/cards/lists/cornucopia', 'models/cards/lists/hinterlands'],
function($, Base, Intrigue, Prosperity, Seaside, Cornucopia, Hinterlands) {
  return $.extend({}, Base, Intrigue, Prosperity, Seaside, Cornucopia, Hinterlands);
});
