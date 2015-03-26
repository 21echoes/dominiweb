define(['backbone', 'models/resolutions/action_resolution'], function(Backbone, ActionResolution) {
  return ActionResolution.extend({
    canSelectHandCard: function(card, already_selected_cards) {
      return true; // TODO: real logix
    }
  });
});
