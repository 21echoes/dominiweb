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
      CardList.Base.Merchant,
      // CardList.Base.Militia,
      CardList.Base.Mine,
      // CardList.Base.Moat,
      CardList.Base.Remodel,
      CardList.Base.Smithy,
      CardList.Base.Village,
      CardList.Base.Workshop,
    ]
  });
  Kingdoms.Base.SizeDistortion = new Kingdom({set: 'base', name: 'Size Distortion', cards: [
      CardList.Base.Artisan,
      CardList.Base.Bandit,
      // CardList.Base.Bureaucrat,
      CardList.Base.Chapel,
      CardList.Base.Festival,
      CardList.Base.Gardens,
      CardList.Base.Sentry,
      // CardList.Base.ThroneRoom,
      CardList.Base.Witch,
      CardList.Base.Workshop,
    ]
  });
  Kingdoms.Base.DeckTop = new Kingdom({set: 'base', name: 'Deck Top', cards: [
      CardList.Base.Artisan,
      // CardList.Base.Bureaucrat,
      CardList.Base.CouncilRoom,
      CardList.Base.Festival,
      // CardList.Base.Harbinger,
      CardList.Base.Laboratory,
      CardList.Base.Moneylender,
      CardList.Base.Sentry,
      CardList.Base.Vassal,
      CardList.Base.Village,
    ]
  });
  Kingdoms.Base.SleightOfHand = new Kingdom({set: 'base', name: 'Sleight of Hand', cards: [
      CardList.Base.Cellar,
      CardList.Base.CouncilRoom,
      CardList.Base.Festival,
      CardList.Base.Gardens,
      CardList.Base.Library,
      // CardList.Base.Harbinger,
      // CardList.Base.Militia,
      CardList.Base.Poacher,
      CardList.Base.Smithy,
      // CardList.Base.ThroneRoom,
    ]
  });
  Kingdoms.Base.Improvements = new Kingdom({set: 'base', name: 'Improvements', cards: [
      CardList.Base.Artisan,
      CardList.Base.Cellar,
      CardList.Base.Market,
      CardList.Base.Merchant,
      CardList.Base.Mine,
      // CardList.Base.Moat,
      CardList.Base.Moneylender,
      CardList.Base.Poacher,
      CardList.Base.Remodel,
      CardList.Base.Witch,
    ]
  });
  Kingdoms.Base.SilverAndGold = new Kingdom({set: 'base', name: 'Silver and Gold', cards: [
        CardList.Base.Bandit,
        // CardList.Base.Bureaucrat,
        CardList.Base.Chapel,
        // CardList.Base.Harbinger,
        CardList.Base.Laboratory,
        CardList.Base.Merchant,
        CardList.Base.Mine,
        CardList.Base.Moneylender,
        // CardList.Base.ThroneRoom,
        CardList.Base.Vassal,
    ]
  });

  return Kingdoms;
});
