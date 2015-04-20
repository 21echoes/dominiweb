define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed', 'models/resolutions/resolution_builder'],
function(CardBuilder, CardList, Revealed, ResolutionBuilder) {
  CardList.Cornucopia = {};

  CardList.Cornucopia.Hamlet = new CardBuilder({type: 'action', cost: 2, name: 'Hamlet'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(1);

      return ResolutionBuilder({
        source: 'hand',
        max_count: 1
      }, {
        resolve: function(cards_arr) {
          if (cards_arr.length > 0) {
            turn.set('num_actions', turn.get('num_actions') + 1);
            turn.get('player').get('hand').moveSomeCardsInto(turn.get('player').get('discard'), cards_arr);
          }
          return ResolutionBuilder({
            source: 'hand',
            max_count: 1
          }, {
            resolve: function(cards_arr) {
              if (cards_arr.length > 0) {
                turn.set('num_buys', turn.get('num_buys') + 1);
                turn.get('player').get('hand').moveSomeCardsInto(turn.get('player').get('discard'), cards_arr);
              }
            }
          });
        }
      });
    }
  });
  CardList.Cornucopia.FortuneTeller = new CardBuilder({type: 'action', cost: 3, name: 'Fortune Teller'}, {
    performAction: function(turn) {
      turn.set('num_coins', turn.get('num_coins') + 2);
      _.each(turn.get('game').inactivePlayers(), function(player) {
        var revealed_holding = new Revealed();
        var revealed_to_discard = new Revealed();
        var revealed_match = new Revealed();
        while (revealed_match.length < 1 &&
          (player.get('deck').length + player.get('discard').length) > 0)
        {
          player.get('deck').drawInto(revealed_holding, 1, player.get('discard'));
          console.log('revealed a',revealed_holding.at(0),'as models are',revealed_holding.models);
          if (revealed_holding.at(0).get('type') == 'victory' || revealed_holding.at(0).get('type') == 'curse') {
            revealed_match.placeFrom(revealed_holding);
          } else {
            revealed_to_discard.placeFrom(revealed_holding);
          }
        }
        revealed_match.moveSomeCardsInto(player.get('deck'), revealed_match.models, {at: 0});
        player.get('discard').placeFrom(revealed_to_discard);
      });
    }
  });
  CardList.Cornucopia.Menagerie = new CardBuilder({type: 'action', cost: 3, name: 'Menagerie'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      // TODO: reveal hand to other interactive players
      var all_distinct = turn.get('player').get('hand').num_distinct() === turn.get('player').get('hand').length;
      if (all_distinct) {
        turn.get('player').draw(3);
      } else {
        turn.get('player').draw(1);
      }
    }
  });
  CardList.Cornucopia.FarmingVillage = new CardBuilder({type: 'action', cost: 4, name: 'Farming Village'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      var revealed_holding = new Revealed();
      var revealed_to_discard = new Revealed();
      var revealed_match = new Revealed();
      while (revealed_match.length < 1 &&
        (turn.get('player').get('deck').length + turn.get('player').get('discard').length) > 0)
      {
        turn.get('player').get('deck').drawInto(revealed_holding, 1, turn.get('player').get('discard'));
        if (revealed_holding.at(0).get('type') == 'treasure' || revealed_holding.at(0).get('type') == 'action') {
          revealed_match.placeFrom(revealed_holding);
        } else {
          revealed_to_discard.placeFrom(revealed_holding);
        }
      }
      turn.get('player').get('hand').placeFrom(revealed_match);
      turn.get('player').get('discard').placeFrom(revealed_to_discard);
    }
  });
  CardList.Cornucopia.Remake = new CardBuilder({type: 'action', cost: 4, name: 'Remake'}, {
    performAction: function(turn) {
      var gainerBuilderBuilder = function(trashedCost, index) {
        return ResolutionBuilder({
            source: 'supply',
            // TODO: enforce *_count, up to num selectable piles
            exact_count: 1
          }, {
            canSelectPile: function(pile, already_selected_piles) {
              if (pile.get('builder').attrs.cost != (trashedCost + 1)) {
                return [false, null];
              }
              return [true, [pile]];
            },
            resolve: function(piles_arr) {
              turn.get('player').gainFromPile(piles_arr[0]);
              index += 1;
              if (index < 2) {
                return trasherBuilderBuilder(index);
              }
            }
          });
      }
      var trasherBuilderBuilder = function(index) {
        return ResolutionBuilder({
          source: 'hand',
          exact_count: 1
        }, {
          resolve: function(cards_arr) {
            turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
            return gainerBuilderBuilder(cards_arr[0].get('cost'), index);
          }
        });
      }
      return trasherBuilderBuilder(0);
    }
  });
  CardList.Cornucopia.Harvest = new CardBuilder({type: 'action', cost: 5, name: 'Harvest'}, {
    performAction: function(turn) {
      var revealed = new Revealed();
      turn.get('player').get('deck').drawInto(revealed, 4, turn.get('player').get('discard'));
      turn.set('num_coins', turn.get('num_coins') + revealed.num_distinct());
      turn.get('player').get('discard').placeFrom(revealed);
    }
  });
  CardList.Cornucopia.HuntingParty = new CardBuilder({type: 'action', cost: 5, name: 'Hunting Party'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(1);

      var revealed_holding = new Revealed();
      var revealed_to_discard = new Revealed();
      var revealed_match = new Revealed();
      while (revealed_match.length < 1 &&
        (turn.get('player').get('deck').length + turn.get('player').get('discard').length) > 0)
      {
        turn.get('player').get('deck').drawInto(revealed_holding, 1, turn.get('player').get('discard'));
        var match = turn.get('player').get('hand').find(function(card) {
          revealed_holding.at(0).get('key') == card.get('key');
        });
        console.log('match is',match);
        if (!match) {
          console.log('so putting into hand');
          revealed_match.placeFrom(revealed_holding);
        } else {
          console.log('so discarding');
          revealed_to_discard.placeFrom(revealed_holding);
        }
      }
      turn.get('player').get('hand').placeFrom(revealed_match);
      turn.get('player').get('discard').placeFrom(revealed_to_discard);
    }
  });
  CardList.Cornucopia.Fairgrounds = new CardBuilder({type: 'victory', cost: 6, name: 'Fairgrounds'}, {
    calculateScore: function(deck) {
      return Math.floor(deck.num_distinct() / 5) * 2;
    }
  });

  /* TODO
  Jester

  REACTION
  Horse Traders

  PRIZES
  Tournament

  OTHER PLAYER INPUT
  Young Witch (BANE)

  ALT TREASURE
  Horn of Plenty
  */

  return CardList;
});
