define(['backbone', 'models/resolutions/action_resolution'], function(Backbone, ActionResolution) {
  return ActionResolution.extend({
    canSelectTrashCard: function(card, already_selected_cards) {
      return true; // TODO: this will be the super of many, have it auto-enforce max_count, etc.
    }
  });
});
