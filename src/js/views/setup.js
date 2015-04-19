define(['jquery', 'backbone', 'hbars!templates/setup',
  'models/game_setup', 'models/cards/kingdoms/all_kingdoms', 'models/players/all_players'],
  function($, Backbone, template, GameSetup, Kingdoms, Players) {
  var presets = {
    random: {
      name: "Random",
      sets: [
      // TODO: get these from the Kingdoms object
        {value: 'random-Base', name: "Random Base Game"},
        {value: 'random-Intrigue', name: "Random Intrigue Game"},
        {value: 'random-Seaside', name: "Random Seaside Game"},
        {value: 'random-Prosperity', name: "Random Prosperity Game"},
        {value: 'random-all', name: "Random (all sets)"}
      ]
    },
    predefined: {
      name: "Preset",
      sets: [
      // TODO: get these from the Kingdoms object
        {value: 'first-game', name: "First Game (Base)"},
        {value: 'big-money', name: "Big Money (Base)"},
        {value: 'interaction', name: "Interaction (Base)"},
        {value: 'size-distortion', name: "Size Distortion (Base)"},
        {value: 'village-square', name: "Village Square (Base)"},
      ]
    },
    // "last-played": {
    //   name: "Last Played"
    // }
  };

  var players = [
    // {value: 'no-player', name: ""},
    {value: 'interactive', name: "Interactive"},
    {value: 'earl', name: "Earl"}
  ];

  return Backbone.View.extend({
    el: '#container',

    state: {
      category: 'predefined',
      set: 'size-distortion',
      player: 'interactive'
    },

    initialize: function(bus) {
      this.bus = bus;
      this.assembleSetup();
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
        self.render();
      });
      this.$el.find('#preset').change(function(event) {
        self.state.set = $(this).val();
        self.assembleSetup();
      });
      this.$el.find('#player-2-select').change(function(event) {
        self.state.player = $(this).val();
        self.assembleSetup();
      });
    },

    assembleSetup: function() {
      var PlayerTypeOne = Players.getPlayer('interactive');
      var PlayerTypeTwo = Players.getPlayer(this.state.player);
      this.gameSetup = new GameSetup({
        kingdom: Kingdoms.getKingdom(this.state.set),
        players: [
          new PlayerTypeOne({name: 'Player 1'}),
          new PlayerTypeTwo({name: 'Player 2'})
        ]
      })
      this.bus.trigger('setup:modified', this.gameSetup);
    }
  });
});
