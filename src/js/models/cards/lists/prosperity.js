define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed', 'models/resolutions/resolution_builder'],
function(CardBuilder, CardList, Revealed, ResolutionBuilder) {
  CardList.Prosperity = {};

  CardList.Meta.Platinum = new CardBuilder({type: 'treasure', value: 5, cost: 9, name: 'Platinum'});
  CardList.Meta.Colony = new CardBuilder({type: 'victory', value: 10, cost: 11, name: 'Colony'});

  // TODO: apostrophes in names
  CardList.Prosperity.WorkersVillage = new CardBuilder({type: 'action', cost: 4, name: 'Workers Village'}, {
    performAction: function(turn) {
      turn.get('player').draw(1);
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.set('num_buys', turn.get('num_buys') + 1);
    }
  });
  CardList.Prosperity.City = new CardBuilder({type: 'action', cost: 5, name: 'City'}, {
    performAction: function(turn) {
      turn.get('player').draw(1);
      turn.set('num_actions', turn.get('num_actions') + 2);

      var empty_piles = turn.get('game').get('supply').empty_piles();
      if (empty_piles.length >= 1) {
        turn.get('player').draw(1);
      }
      if (empty_piles.length >= 2) {
        turn.set('num_coins', turn.get('num_coins') + 1);
        turn.set('num_buys', turn.get('num_buys') + 1);
      }
    }
  });
  CardList.Prosperity.Expand = new CardBuilder({type: 'action', cost: 7, name: 'Expand'}, {
    performAction: function(turn) {
      var gainerBuilderBuilder = function(trashedCost) {
        return ResolutionBuilder({
            source: 'supply',
            // TODO: enforce *_count
            exact_count: 1
          }, {
            canSelectPile: function(pile, already_selected_piles) {
              if (pile.get('builder').attrs.cost > (trashedCost + 3)) {
                return [false, null];
              }
              return [true, [pile]];
            },
            resolve: function(piles_arr) {
              turn.get('player').gainFromPile(piles_arr[0]);
            }
          });
      }
      return ResolutionBuilder({
        source: 'hand',
        // TODO: if no cards in hand, don't explode
        exact_count: 1
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          return gainerBuilderBuilder(cards_arr[0].get('cost'));
        }
      });
    }
  });
  CardList.Prosperity.Forge = new CardBuilder({type: 'action', cost: 7, name: 'Forge'}, {
    performAction: function(turn) {
      var gainerBuilderBuilder = function(trashedCost) {
        return ResolutionBuilder({
            source: 'supply',
            // TODO: enforce *_count, except in instances where no cards are valid
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
            }
          });
      }
      return ResolutionBuilder({
        source: 'hand'
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          var total_cost = _.reduce(cards_arr, function(memo, card) {
            return memo + card.get('cost');
          }, 0);
          return gainerBuilderBuilder(total_cost);
        }
      });
    }
  });

  /* TODO:
  VICTORY TOKENS:
  Monument
  Bishop

  VARIABLE TREASURE
  Counting House
  Bank

  TREASURE POWER
  Loan
  Quarry
  Contraband
  Talisman
  Royal Seal
  Venture
  
  MULTI-TYPE
  Hoard

  VARIABLE COST
  Peddler

  Mint (on-buy)
  Mountebank (other user input)
  Rabble (other user input)
  Vault (other user input)
  Watchtower (reactions)
  Trade Route (token things)
  Goons (other user input)
  Grand Market (buy restrictions)
  King's Court
  */

  /* TODO: treasures have actions when played
  CardList.Prosperity.Loan = new CardBuilder({type: 'treasure', value: 1, cost: 3, name: 'Loan',
    performAction: function(turn) {
      var revealed_holding = new Revealed();
      var revealed_treasures = new Revealed();
      var revealed_non_treasures = new Revealed();
      while (revealed_treasures.length < 1 &&
        (turn.get('player').get('deck').length + turn.get('player').get('discard').length) > 0 &&
        revealed_non_treasures.length < (turn.get('player').get('deck').length + turn.get('player').get('discard').length))
      {
        turn.get('player').get('deck').drawInto(revealed_holding, 1, turn.get('discard'));
        if (revealed_holding.at(0).get('type') == 'treasure') {
          revealed_treasures.placeFrom(revealed_holding);
        } else {
          revealed_non_treasures.placeFrom(revealed_holding);
        }
      }
      if (revealed_treasures.length > 0) {
        var drawn_card = revealed_treasures.at(0);
        return ResolutionBuilder({
            input: 'Discard or trash '+drawn_card.get('name'),
            prompt_buttons: [
              {key: 'choose-resolution-prompt_0', text: "Discard"},
              {key: 'choose-resolution-prompt_1', text: "Trash"},
            ]
          }, {
            resolve: function(button_index) {
              if (button_index == 0) {
                turn.get('player').get('discard').placeFrom(revealed_treasures);
              } else {
                turn.get('player').get('hand').placeFrom(revealed_treasures);
              }
            }
          });
      }
      turn.get('player').get('discard').placeFrom(revealed_non_treasures);
    }
  });
  */

  return CardList;
});
