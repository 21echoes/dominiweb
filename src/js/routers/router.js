define(['jquery', 'backbone',
  'views/home',
  'views/about', 'views/settings', 'views/setup', 'views/stats',
  'views/game/game'],
function($, Backbone, HomeView, AboutView, SettingsView, SetupView, StatsView, GameView) {
  return Backbone.Router.extend({
    routes: {
      "": "home",
      "setup": "setup",
      "stats": "stats",
      "settings": "settings",
      "about": "about",
      "play": "play"
    },

    home: function() {
      new HomeView();
    },

    setup: function() {
      new SetupView();
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
      new GameView();
    }
  });
});