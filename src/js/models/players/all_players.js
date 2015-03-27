define(['models/players/interactive_player'], function(InteractivePlayer) {
  var Players = {
    getPlayer: function(target) {
      for (index in this.players) {
        var player = this.players[index];
        if (player.prototype.key === target) {
          return player;
        }
      }
    },
    players: [
      InteractivePlayer
    ]
  };

  return Players;
});
