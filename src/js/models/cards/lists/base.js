define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed', 'models/resolutions/resolution_builder'],
  function(CardBuilder, CardList, Revealed, ResolutionBuilder) {
  CardList.Market = new CardBuilder({type: 'action', cost: 5, name: 'Market'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 1);
      turn.get('player').draw(1);
    }
  });
  CardList.Adventurer = new CardBuilder({type: 'action', cost: 6, name: 'Adventurer'}, {
    performAction: function(turn) {
      var revealed_holding = new Revealed();
      var revealed_treasures = new Revealed();
      var revealed_non_treasures = new Revealed();
      while (revealed_treasures.length < 2 &&
        (turn.get('player').get('deck').length + turn.get('player').get('discard').length) > 0)
      {
        turn.get('player').get('deck').drawInto(revealed_holding, 1, turn.get('discard'));
        if (revealed_holding.models[0].get('type') == 'treasure') {
          revealed_treasures.placeFrom(revealed_holding);
        } else {
          revealed_non_treasures.placeFrom(revealed_holding);
        }
      }
      turn.get('player').get('hand').placeFrom(revealed_treasures);
      turn.get('player').get('discard').placeFrom(revealed_non_treasures);
    }
  });
  CardList.Festival = new CardBuilder({type: 'action', cost: 5, name: 'Festival'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 2);
    }
  });
  CardList.Laboratory = new CardBuilder({type: 'action', cost: 5, name: 'Laboratory'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(2);
    }
  });
  CardList.Smithy = new CardBuilder({type: 'action', cost: 4, name: 'Smithy'}, {
    performAction: function(turn) {
      turn.get('player').draw(3);
    }
  });
  CardList.Village = new CardBuilder({type: 'action', cost: 3, name: 'Village'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.get('player').draw(1);
    }
  });
  CardList.Woodcutter = new CardBuilder({type: 'action', cost: 3, name: 'Woodcutter'}, {
    performAction: function(turn) {
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 2);
    }
  });
  CardList.CouncilRoom = new CardBuilder({type: 'action', cost: 5, name: 'Council Room'}, {
    performAction: function(turn) {
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.get('player').draw(4);
      _.each(turn.get('game').inactivePlayers(), function(player) {
        player.draw(1);
      });
    }
  });
  CardList.Witch = new CardBuilder({type: 'action', cost: 5, name: 'Witch'}, {
    performAction: function(turn) {
      turn.get('player').draw(2);
      var curse_pile = turn.get('game').get('supply').meta_curse_pile();
      _.each(turn.get('game').inactivePlayers(), function(player) {
        if (curse_pile.get('count') > 0) {
          player.gainFromPile(curse_pile);
        }
      });
    }
  });
  CardList.Cellar = new CardBuilder({type: 'action', cost: 2, name: 'Cellar'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      return ResolutionBuilder({
        source: 'hand'
      }, {
        resolve: function(cards_arr) {
          turn.get('player').discard(cards_arr);
          turn.get('player').draw(cards_arr.length);
        }
      });
    }
  });
  CardList.Workshop = new CardBuilder({type: 'action', cost: 3, name: 'Workshop'}, {
    performAction: function(turn) {
      return ResolutionBuilder({
        source: 'supply',
        input: 'Gain a card costing up to (4)' // TODO: auto-generate this?
      }, {
        canSelectPile: function(pile, already_selected_piles) {
          if (pile.get('builder').attrs.cost > 4) {
            return [false, null];
          }
          return [true, [pile]];
        },
        resolve: function(piles_arr) {
          turn.get('player').gainFromPile(piles_arr[0]);
        }
      });
    }
  });
  CardList.Gardens = new CardBuilder({type: 'victory', cost: 4, name: 'Gardens'}, {
    calculateScore: function(deck) {
      return Math.floor(deck.length / 10);
    }
  });
  CardList.Chapel = new CardBuilder({type: 'action', cost: 2, name: 'Chapel'}, {
    performAction: function(turn) {
      return ResolutionBuilder({
        source: 'hand',
        // TODO: enforce max_count
        max_count: 4
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
        }
      });
    }
  });
  CardList.MoneyLender = new CardBuilder({type: 'action', cost: 4, name: 'Money Lender'}, {
    performAction: function(turn) {
      var copper_card = turn.get('player').get('hand').findWhere({key: "copper"});
      if (copper_card) {
        turn.get('player').trashFromHand([copper_card], turn.get('game').get('trash'));
        turn.set('num_coins', turn.get('num_coins') + 3);
      }
    }
  });
  CardList.Mine = new CardBuilder({type: 'action', cost: 5, name: 'Mine'}, {
    performAction: function(turn) {
      var gainerBuilderBuilder = function(trashedCost) {
        return ResolutionBuilder({
            source: 'supply',
            // TODO: enforce *_count
            exact_count: 1
          }, {
            canSelectPile: function(pile, already_selected_piles) {
              if (pile.get('builder').attrs.type != 'treasure'
                || pile.get('builder').attrs.cost > (trashedCost + 3)) {
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
        // TODO: enforce *_count
        exact_count: 1
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          return gainerBuilderBuilder(cards_arr[0].get('cost'));
        }
      });
    }
  });
  CardList.Remodel = new CardBuilder({type: 'action', cost: 4, name: 'Remodel'}, {
    performAction: function(turn) {
      var gainerBuilderBuilder = function(trashedCost) {
        return ResolutionBuilder({
            source: 'supply',
            // TODO: enforce *_count
            exact_count: 1
          }, {
            canSelectPile: function(pile, already_selected_piles) {
              if (pile.get('builder').attrs.cost > (trashedCost + 2)) {
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
        // TODO: enforce *_count
        exact_count: 1
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          return gainerBuilderBuilder(cards_arr[0].get('cost'));
        }
      });
    }
  });
  CardList.Feast = new CardBuilder({type: 'action', cost: 4, name: 'Feast'}, {
    performAction: function(turn) {
      turn.get('player').trash([this], turn.get('player').get('table'), turn.get('game').get('trash'));

      // TODO: factor this out to just {genre: 'gainer', max_cost: '5'}
      return ResolutionBuilder({
        source: 'supply',
        input: 'Gain a card costing up to (5)' // TODO: auto-generate this?
      }, {
        canSelectPile: function(pile, already_selected_piles) {
          if (pile.get('builder').attrs.cost > 5) {
            return [false, null];
          }
          return [true, [pile]];
        },
        resolve: function(piles_arr) {
          turn.get('player').gainFromPile(piles_arr[0]);
        }
      });
    }
  });
  // CardList.Moat = new CardBuilder({type: 'action', cost: 2, name: 'Moat'}, {
  //   performAction: function(turn) {
  //     turn.get('player').draw(2);
  //   }
  //   // TODO: reaction on being attacked
  // });
  CardList.Library = new CardBuilder({type: 'action', cost: 5, name: 'Library'}, {
    performAction: function(turn) {
      var revealed_holding = new Revealed();
      var set_aside_actions = new Revealed();
      
      return this.continueAction(turn, revealed_holding, set_aside_actions);
    },

    continueAction: function(turn, revealed_holding, set_aside_actions) {
      var self = this;
      while (turn.get('player').get('hand').length < 7 &&
        (turn.get('player').get('deck').length + turn.get('player').get('discard').length) > 0)
      {
        turn.get('player').get('deck').drawInto(revealed_holding, 1, turn.get('player').get('discard'));
        var drawn_card = revealed_holding.models[0];
        if (drawn_card.get('type') == 'action') {
          return ResolutionBuilder({
              input: 'Set aside '+drawn_card.get('name')+' for discard?',
              prompt_buttons: [
                {key: 'choose-resolution-prompt_0', text: "Yes"},
                {key: 'choose-resolution-prompt_1', text: "No"},
              ]
            }, {
              resolve: function(button_index) {
                if (button_index == 0) {
                  set_aside_actions.placeFrom(revealed_holding);
                } else {
                  turn.get('player').get('hand').placeFrom(revealed_holding);
                }
                return self.continueAction(turn, revealed_holding, set_aside_actions);
              }
            });
        } else {
          turn.get('player').get('hand').placeFrom(revealed_holding);
        }
      }
      turn.get('player').get('discard').placeFrom(set_aside_actions);
    }
  });
  CardList.Chancellor = new CardBuilder({type: 'action', cost: 3, name: 'Chancellor'}, {
    performAction: function(turn) {
      turn.set('num_coins', turn.get('num_coins') + 2);
      return ResolutionBuilder({
          input: 'Discard your deck?',
          prompt_buttons: [
            {key: 'choose-resolution-prompt_0', text: "Yes"},
            {key: 'choose-resolution-prompt_1', text: "No"},
          ]
        }, {
          resolve: function(button_index) {
            if (button_index == 0) {
              turn.get('player').get('discard').placeFrom(turn.get('player').get('deck'));
            }
          }
        });
    },
  });

  /* TODO:
  NEEDS PLAIN PROMPTS:
  Library
  Spy
  Chancellor

  TRASHERS:
  Thief

  NEEDS MULTIPLAYER PROMPTS:
  Bureaucrat
  Militia

  OTHER:
  ThroneRoom
  */
  
  return CardList;
});
