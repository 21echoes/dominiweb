define(['backbone', 'models/resolutions/hand_selection', 'models/resolutions/supply_selection', 'models/resolutions/choice_prompt'],
function(Backbone, HandSelection, SupplySelection, ChoicePrompt) {
  var normalizeAttrs = function(attrs) {
    if (attrs.min_count == attrs.max_count) {
      attrs.exact_count = attrs.min_count;
    }
    if (attrs.exact_count) {
      attrs.min_count = attrs.exact_count;
      attrs.max_count = attrs.exact_count;
    }
    return attrs;
  }

  var generatePrompt = function(attrs) {
    if (attrs.input) {
      return attrs;
    }
    if (attrs.exact_count) {
      attrs.input = "Choose exactly "+attrs.exact_count+" cards";
    } else if (attrs.min_count) {
      if (attrs.max_count) {
        attrs.input = "Choose at least "+attrs.min_count+" and up to "+attrs.max_count+" cards";
      } else {
        attrs.input = "Choose at least "+attrs.min_count+" cards";
      }
    } else if (attrs.max_count) {
      attrs.input = "Choose up to "+attrs.max_count+" cards";
    } else {
      attrs.input = "Choose cards";
    }
    // TODO: "to gain" / "to trash" / "to discard" via "genre" attr?
    if (attrs.source == 'hand') {
      attrs.input = attrs.input + " from your hand";
    } else {
      attrs.input = attrs.input + " from the supply";
    }
    return attrs;
  }

  function ResolutionBuilder(attrs, functions) {
    attrs = normalizeAttrs(attrs);
    attrs = generatePrompt(attrs);
    functions = functions || {};
    if (attrs.source == 'hand') {
      var NewHandSelection = HandSelection.extend(functions);
      return new NewHandSelection(attrs);
    } else if (attrs.source == 'supply') {
      var NewSupplySelection = SupplySelection.extend(functions);
      return new NewSupplySelection(attrs);
    } else {
      var NewChoicePrompt = ChoicePrompt.extend(functions);
      return new NewChoicePrompt(attrs);
    }
  }
  return ResolutionBuilder;
});
