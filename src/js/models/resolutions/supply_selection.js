define(['backbone', 'models/resolutions/action_resolution'], function(Backbone, ActionResolution) {
  return ActionResolution.extend({
    canSelectPile: function(pile, already_selected_piles) {
      return true; // TODO: this will be the super of many, have it auto-enforce max_count, etc.
    }
  });
});
