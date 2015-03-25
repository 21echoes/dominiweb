define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    // type: [TREASURE, VICTORY, CURSE, ACTION, RUIN]
    // cost: int
    // name: string
    // key: string
    // selected: bool

    defaults: {
      selected: false
    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.call(this);
      if (this.get('type') == 'treasure') {
        json['treasure_class'] = 'treasure-'+this.get('value');
      }
      return json;
    }
  });
});
