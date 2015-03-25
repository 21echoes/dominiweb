define(['jquery', 'underscore', 'backbone', 'hbars!templates/setup'], function($, _, Backbone, template) {
  var presets = {
    random: {
      name: "Random",
      sets: [
        {value: 'random-base', name: "Random Base Game"},
        {value: 'random-all', name: "Random (all sets)"}
      ]
    },
    predefined: {
      name: "Preset",
      sets: [
        {value: 'first-game-base', name: "First Game (Base)"},
        {value: 'big-money-base', name: "Big Money (Base)"}
      ]
    },
    "last-played": {
      name: "Last Played"
    }
  };

  var players = [
    {value: 'no-player', name: ""},
    {value: 'earl', name: "Earl"},
    {value: 'kristin', name: "Kristin"}
  ];

  return Backbone.View.extend({
    el: '#container',

    state: {
      category: 'random',
      set: '',
      player: ''
    },

    initialize: function(){
      this.render();
    },

    render: function() {
      this.$el.html(template({
        preset_categories: _.map(Object.keys(presets), function(key) {
          return {value: key, name: presets[key]['name']};
        }),

        preset_sets: presets[this.state.category]['sets'],
        player_counts: _.map(_.range(2, 3), function(id) { return {id: id} }),
        players: players
      }));

      this.$el.find('#cards-type').val(this.state.category);
      this.$el.find('#preset').val(this.state.set);
      this.$el.find('#player-2-select').val(this.state.player);

      var self = this;
      this.$el.find('#cards-type').change(function(event) {
        self.state.category = $(this).val();
      });
      this.$el.find('#preset').change(function(event) {
        self.state.set = $(this).val();
      });
      this.$el.find('#player-2-select').change(function(event) {
        self.state.player = $(this).val();
      });
    }
  });
});
