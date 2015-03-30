define(['jquery', 'models/cards/lists/base', 'models/cards/lists/prosperity'], function($, BaseCardList, ProsperityCardList) {
  return $.extend({}, BaseCardList, ProsperityCardList);
});
