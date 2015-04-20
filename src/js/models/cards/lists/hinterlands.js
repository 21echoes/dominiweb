define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed', 'models/resolutions/resolution_builder'],
function(CardBuilder, CardList, Revealed, ResolutionBuilder) {
  CardList.Hinterlands = {};

  CardList.Hinterlands.Crossroads = new CardBuilder({type: 'action', cost: 2, name: 'Crossroads'}, {
    performAction: function(turn) {
      // TODO: reveal hand
      if (turn.get('player').get('table').where({key: 'crossroads'}).length == 1) {
        turn.set('num_actions', turn.get('num_actions') + 3);
      }
      var num_victory_in_hand = turn.get('player').get('hand').find_cards_by_type('victory').length;
      turn.get('player').draw(num_victory_in_hand);
    }
  });
  CardList.Hinterlands.Develop = new CardBuilder({type: 'action', cost: 3, name: 'Develop'}, {
    performAction: function(turn) {
      var gainerBuilderBuilder = function(trashedCost, nextGBB) {
        return ResolutionBuilder({
          source: 'supply',
          // TODO: enforce *_count
          exact_count: 1
        }, {
          canSelectPile: function(pile, already_selected_piles) {
            if (pile.get('builder').attrs.cost != trashedCost) {
              return [false, null];
            }
            return [true, [pile]];
          },
          resolve: function(piles_arr) {
            turn.get('player').gainFromPile(piles_arr[0]);
            return nextGBB;
          }
        });
      }
      return ResolutionBuilder({
        source: 'hand',
        exact_count: 1
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          return gainerBuilderBuilder(cards_arr[0].get('cost') + 1,
            gainerBuilderBuilder(cards_arr[0].get('cost') - 1));
        }
      });
    }
  });
  CardList.Hinterlands.Oasis = new CardBuilder({type: 'action', cost: 3, name: 'Oasis'}, {
    performAction: function(turn) {
      turn.get('player').draw(1);
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.set('num_coins', turn.get('num_coins') + 1);

      return ResolutionBuilder({
          source: 'hand',
          // TODO: enforce *_count
          exact_count: 1
        }, {
          resolve: function(cards_arr) {
            turn.get('player').discard(cards_arr);
          }
        });
    }
  });
  CardList.Hinterlands.JackOfAllTrades = new CardBuilder({type: 'action', cost: 4, name: 'Jack of all Trades'}, {
    performAction: function(turn) {
      this.gain_silver(turn);
      var self = this;
      return this.spy_own_deck(turn, function() {
        self.draw_to_five(turn);
        return self.trash_non_treasure(turn);
      });
    },

    gain_silver: function(turn) {
      var silver_pile = turn.get('game').get('supply').find_pile_by_key("silver");
      turn.get('player').gainFromPile(silver_pile);
    },

    spy_own_deck: function(turn, continuation) {
      var revealed = new Revealed();
      turn.get('player').get('deck').drawInto(revealed, 1, turn.get('player').get('discard'));
      return ResolutionBuilder({
          input: 'Discard '+revealed.at(0).get('name')+' or place back on deck?',
          prompt_buttons: [
            {key: 'choose-resolution-prompt_0', text: "Discard"},
            {key: 'choose-resolution-prompt_1', text: "Return to Deck"},
          ]
        }, {
          resolve: function(button_index) {
            if (button_index == 0) {
              turn.get('player').get('discard').placeFrom(revealed)
            } else {
              turn.get('player').get('deck').add(revealed.at(0), {at: 0});
            }
            return continuation();
          }
        });
    },

    draw_to_five: function(turn) {
      var num_to_draw = Math.max(0, 5 - turn.get('player').get('hand').length);
      turn.get('player').draw(num_to_draw);
    },

    trash_non_treasure: function(turn) {
      return ResolutionBuilder({
        source: 'hand',
        exact_count: 1
      }, {
        canSelectHandCard: function(card, already_selected_cards) {
          return (card.get('type') != 'treasure');
        },
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
        }
      });
    }
  });


  /* TODO
  Noble Brigand
  Silk Road
  Spice Merchant
  Stables

  OTHER PLAYER INPUT
  Duchess
  Oracle
  Margrave

  REACTION
  Tunnel
  Trader

  ORDER CARDS
  Cartographer

  VARIABLE TREASURE
  Fool's Gold

  ON CLEAN UP
  Scheme

  ON GAIN
  Nomad Camp
  Cache
  Embassy
  Ill-Gotten Gains (TREASURE EFFECT)
  Inn
  Mandarin
  Border Village
  Farmland

  GAIN EFFECTS
  Haggler

  COST MODIFICATION
  Highway
  */

  return CardList;
});
