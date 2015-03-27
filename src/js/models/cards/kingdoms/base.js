define(['models/cards/lists/all_cards', 'models/cards/kingdoms/kingdom'], function(CardList, Kingdom) {
  var Kingdoms = {
    getKingdom: function(target) {
      if (target.startsWith('random')) {
        return this.getRandomKingdom(target);
      }
      for (key in this) {
        if (typeof key == 'function') {
          continue;
        }
        for (kingdom_key in this[key]) {
          var kingdom = this[key][kingdom_key];
          if (kingdom.get('key') === target) {
            return kingdom;
          }
        }
      }
    },

    getRandomKingdom: function(target) {
      var components = target.split('-');
      var set_key = components[1];
      var set = CardList[set_key];
      var set_keys = Object.keys(set);
      var cards_arr = _.chain(set_keys.length)
        .range()
        .shuffle()
        .slice(0, 10)
        .map(function(index) { return set[set_keys[index]]; })
        .value();
      return new Kingdom({set: 'base', name: 'Random', cards: cards_arr});
    }
  };
  Kingdoms.Base = {};

  Kingdoms.Base.FirstGame = new Kingdom({set: 'base', name: 'First Game', cards: [
      CardList.Base.Cellar,
      CardList.Base.Market,
      // CardList.Base.Militia,
      CardList.Base.Mine,
      // CardList.Base.Moat,
      CardList.Base.Remodel,
      CardList.Base.Smithy,
      CardList.Base.Village,
      CardList.Base.Woodcutter,
      CardList.Base.Workshop,
    ]
  });
  Kingdoms.Base.BigMoney = new Kingdom({set: 'base', name: 'Big Money', cards: [
      CardList.Base.Adventurer,
      // CardList.Base.Bureaucrat,
      CardList.Base.Chancellor,
      CardList.Base.Chapel,
      CardList.Base.Feast,
      CardList.Base.Laboratory,
      CardList.Base.Market,
      CardList.Base.Mine,
      CardList.Base.Moneylender,
      // CardList.Base.ThroneRoom,
    ]
  });
  Kingdoms.Base.Interaction = new Kingdom({set: 'base', name: 'Interaction', cards: [
      // CardList.Base.Bureaucrat,
      CardList.Base.Chancellor,
      CardList.Base.CouncilRoom,
      CardList.Base.Festival,
      CardList.Base.Library,
      // CardList.Base.Militia,
      // CardList.Base.Moat,
      CardList.Base.Spy,
      CardList.Base.Thief,
      CardList.Base.Village,
    ]
  });
  Kingdoms.Base.SizeDistortion = new Kingdom({set: 'base', name: 'Size Distortion', cards: [
      CardList.Base.Cellar,
      CardList.Base.Chapel,
      CardList.Base.Feast,
      CardList.Base.Gardens,
      CardList.Base.Laboratory,
      CardList.Base.Thief,
      CardList.Base.Village,
      CardList.Base.Witch,
      CardList.Base.Woodcutter,
      CardList.Base.Workshop,
    ]
  });
  Kingdoms.Base.VillageSquare = new Kingdom({set: 'base', name: 'Village Square', cards: [
      // CardList.Base.Bureaucrat,
      CardList.Base.Cellar,
      CardList.Base.Festival,
      CardList.Base.Library,
      CardList.Base.Market,
      CardList.Base.Remodel,
      CardList.Base.Smithy,
      // CardList.Base.ThroneRoom,
      CardList.Base.Village,
      CardList.Base.Woodcutter,
    ]
  });

  return Kingdoms;
});
