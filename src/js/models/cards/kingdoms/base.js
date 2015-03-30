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
      var cards_arr;
      if (set_key == 'all') {
        var All = {};
        for (m_set_key in CardList) {
          if (m_set_key == 'Meta') {
            continue;
          }
          for (card_key in CardList[m_set_key]) {
            All[card_key] = CardList[m_set_key][card_key];
          }
        }
        var card_keys = Object.keys(All);
        cards_arr = _.chain(card_keys.length)
          .range()
          .shuffle()
          .slice(0, 10)
          .map(function(index) { return All[card_keys[index]]; })
          .value();
      } else {
        var set = CardList[set_key];
        var set_keys = Object.keys(set);
        cards_arr = _.chain(set_keys.length)
          .range()
          .shuffle()
          .slice(0, 10)
          .map(function(index) { return set[set_keys[index]]; })
          .value();
      }
      return new Kingdom({set: set_key, name: 'Random', cards: cards_arr});
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
