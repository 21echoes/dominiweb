define(['jquery', 'backbone', 'hbars!templates/reloader'], function($, Backbone, template) {
  return Backbone.View.extend({
    el: '#reloader',

    initialize: function() {
      console.log('initializing update presence to false');
      this.hasUpdate = false;
      this.userDoesNotWant = false;
      this.appCache = window.applicationCache;
      this.ensureFreshContent();
      this.render();
    },

    ensureFreshContent: function() {
      // If browser doesn't support cache manifest, move along.
      if (!this.appCache) {
        return;
      }

      // for logging & debugging purposes
      this.appCache.addEventListener('noupdate', _.bind(this.logNoUpdate, this), false); 
      // if we recognize an update, swap out the cache & display it.
      this.appCache.addEventListener('updateready', _.bind(this.promptUpdate, this), false);
      // Kick off the update
      this.appCache.update();

      // TODO: is this really needed?
      if (applicationCache.status == applicationCache.UPDATEREADY) {
        this.promptUpdate();
      }

      // TODO: if this.$el.data('version') != localStorage.get('appVersion') { this.promptUpdate() }, write to localStorage in reloadPage
    },

    promptUpdate: function(evt) {
      console.log('updates available in the manifest');

      // I think this is right: reset their "no update plz" selection if there's another new update
      this.userDoesNotWant = false;

      this.hasUpdate = true;
      this.render();
    },

    reloadPage: function() {
      this.appCache.swapCache();
      // .swapCache() has retrieved the updated MANIFEST
      // trigger the reload.
      window.location.reload();
    },

    logNoUpdate: function(evt) {
      console.log('no updates in the manifest');
    },

    hideReloadPrompt: function() {
      this.userDoesNotWant = true;
      this.$el.hide();
    },

    events: {
      "click #yes-reload": "reloadPage",
      "click #no-reload": "hideReloadPrompt",
    },

    render: function() {
      this.$el.hide();
      this.$el.html(template());
      if (this.hasUpdate && !this.userDoesNotWant) {
        this.$el.show();
      }
    }
  });
});
