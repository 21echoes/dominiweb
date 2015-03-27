define(['jquery', 'backbone',
  'views/home',
  'views/about', 'views/settings', 'views/setup', 'views/stats',
  'views/game/game', 'models/game'],
function($, Backbone, HomeView, AboutView, SettingsView, SetupView, StatsView, GameView, Game) {
  return Backbone.Router.extend({
    routes: {
      "": "home",
      "setup": "setup",
      "stats": "stats",
      "settings": "settings",
      "about": "about",
      "play": "play"
    },

    initialize: function() {
      this.bus = _.extend({}, Backbone.Events);

      var self = this;
      this.bus.on('setup:modified', function(setup) {
        self.gameSetup = setup;
      });
    },

    home: function() {
      new HomeView();
    },

    setup: function() {
      new SetupView(this.bus);
    },

    stats: function() {
      new StatsView();
    },

    settings: function() {
      new SettingsView();
    },

    about: function() {
      new AboutView();
    },

    play: function() {
      new GameView(new Game(this.gameSetup));
    }
  });
});