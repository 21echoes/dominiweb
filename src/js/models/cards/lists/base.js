define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed', 'models/resolutions/resolution_builder'],
function(CardBuilder, CardList, Revealed, ResolutionBuilder) {
  CardList.Base = {};

  CardList.Base.Market = new CardBuilder({type: 'action', cost: 5, name: 'Market'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 1);
      turn.get('player').draw(1);
    }
  });
  // Removed in v2
  // CardList.Base.Adventurer = new CardBuilder({type: 'action', cost: 6, name: 'Adventurer'}, {
  //   performAction: function(turn) {
  //     var revealed_holding = new Revealed();
  //     var revealed_treasures = new Revealed();
  //     var revealed_non_treasures = new Revealed();
  //     while (revealed_treasures.length < 2 &&
  //       (turn.get('player').get('deck').length + turn.get('player').get('discard').length) > 0)
  //     {
  //       turn.get('player').get('deck').drawInto(revealed_holding, 1, turn.get('player').get('discard'));
  //       if (revealed_holding.at(0).get('type') == 'treasure') {
  //         revealed_treasures.placeFrom(revealed_holding);
  //       } else {
  //         revealed_non_treasures.placeFrom(revealed_holding);
  //       }
  //     }
  //     turn.get('player').get('hand').placeFrom(revealed_treasures);
  //     turn.get('player').get('discard').placeFrom(revealed_non_treasures);
  //   }
  // });
  CardList.Base.Festival = new CardBuilder({type: 'action', cost: 5, name: 'Festival'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.set('num_coins', turn.get('num_coins') + 2);
    }
  });
  CardList.Base.Laboratory = new CardBuilder({type: 'action', cost: 5, name: 'Laboratory'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(2);
    }
  });
  CardList.Base.Smithy = new CardBuilder({type: 'action', cost: 4, name: 'Smithy'}, {
    performAction: function(turn) {
      turn.get('player').draw(3);
    }
  });
  CardList.Base.Village = new CardBuilder({type: 'action', cost: 3, name: 'Village'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      turn.get('player').draw(1);
    }
  });
  // Removed in v2
  // CardList.Base.Woodcutter = new CardBuilder({type: 'action', cost: 3, name: 'Woodcutter'}, {
  //   performAction: function(turn) {
  //     turn.set('num_buys', turn.get('num_buys') + 1);
  //     turn.set('num_coins', turn.get('num_coins') + 2);
  //   }
  // });
  CardList.Base.CouncilRoom = new CardBuilder({type: 'action', cost: 5, name: 'Council Room'}, {
    performAction: function(turn) {
      turn.set('num_buys', turn.get('num_buys') + 1);
      turn.get('player').draw(4);
      _.each(turn.get('game').inactivePlayers(), function(player) {
        player.draw(1);
      });
    }
  });
  CardList.Base.Witch = new CardBuilder({type: 'action', cost: 5, name: 'Witch'}, {
    performAction: function(turn) {
      turn.get('player').draw(2);
      var curse_pile = turn.get('game').get('supply').meta_curse_pile();
      _.each(turn.get('game').inactivePlayers(), function(player) {
        player.gainFromPile(curse_pile);
      });
    }
  });
  CardList.Base.Cellar = new CardBuilder({type: 'action', cost: 2, name: 'Cellar'}, {
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
  CardList.Base.Workshop = new CardBuilder({type: 'action', cost: 3, name: 'Workshop'}, {
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
  CardList.Base.Gardens = new CardBuilder({type: 'victory', cost: 4, name: 'Gardens'}, {
    calculateScore: function(deck) {
      return Math.floor(deck.length / 10);
    }
  });
  CardList.Base.Chapel = new CardBuilder({type: 'action', cost: 2, name: 'Chapel'}, {
    performAction: function(turn) {
      return ResolutionBuilder({
        source: 'hand',
        max_count: 4
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
        }
      });
    }
  });
  CardList.Base.Moneylender = new CardBuilder({type: 'action', cost: 4, name: 'Moneylender'}, {
    performAction: function(turn) {
      var copper_card = turn.get('player').get('hand').findWhere({key: "copper"});
      if (copper_card) {
        turn.get('player').trashFromHand([copper_card], turn.get('game').get('trash'));
        turn.set('num_coins', turn.get('num_coins') + 3);
      }
    }
  });
  CardList.Base.Mine = new CardBuilder({type: 'action', cost: 5, name: 'Mine'}, {
    performAction: function(turn) {
      var gainerBuilderBuilder = function(trashedCost) {
        return ResolutionBuilder({
            source: 'supply',
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
              var pile = piles_arr[0];
              if (pile) {
                turn.get('player').get('hand').add(pile.getCard());
              }
            }
          });
      }
      return ResolutionBuilder({
        source: 'hand',
        max_count: 1
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          return gainerBuilderBuilder(cards_arr[0].get('cost'));
        }
      });
    }
  });
  CardList.Base.Remodel = new CardBuilder({type: 'action', cost: 4, name: 'Remodel'}, {
    performAction: function(turn) {
      var gainerBuilderBuilder = function(trashedCost) {
        return ResolutionBuilder({
            source: 'supply',
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
        exact_count: 1
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          return gainerBuilderBuilder(cards_arr[0].get('cost'));
        }
      });
    }
  });
  // Removed in v2
  // CardList.Base.Feast = new CardBuilder({type: 'action', cost: 4, name: 'Feast'}, {
  //   performAction: function(turn) {
  //     turn.get('player').get('table').moveSomeCardsInto(turn.get('game').get('trash'), [this]);
  //
  //     // TODO: factor this out to just {genre: 'gainer', max_cost: '5'}
  //     return ResolutionBuilder({
  //       source: 'supply',
  //       input: 'Gain a card costing up to (5)' // TODO: auto-generate this?
  //     }, {
  //       canSelectPile: function(pile, already_selected_piles) {
  //         if (pile.get('builder').attrs.cost > 5) {
  //           return [false, null];
  //         }
  //         return [true, [pile]];
  //       },
  //       resolve: function(piles_arr) {
  //         turn.get('player').gainFromPile(piles_arr[0]);
  //       }
  //     });
  //   }
  // });
  CardList.Base.Library = new CardBuilder({type: 'action', cost: 5, name: 'Library'}, {
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
        var drawn_card = revealed_holding.at(0);
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
  // Removed in v2
  // CardList.Base.Chancellor = new CardBuilder({type: 'action', cost: 3, name: 'Chancellor'}, {
  //   performAction: function(turn) {
  //     turn.set('num_coins', turn.get('num_coins') + 2);
  //     return ResolutionBuilder({
  //         input: 'Discard your deck?',
  //         prompt_buttons: [
  //           {key: 'choose-resolution-prompt_0', text: "Yes"},
  //           {key: 'choose-resolution-prompt_1', text: "No"},
  //         ]
  //       }, {
  //         resolve: function(button_index) {
  //           if (button_index == 0) {
  //             turn.get('player').get('discard').placeFrom(turn.get('player').get('deck'));
  //           }
  //         }
  //       });
  //   },
  // });
  // Removed in v2
  // CardList.Base.Thief = new CardBuilder({type: 'action', cost: 4, name: 'Thief'}, {
  //   performAction: function(turn) {
  //     var inactive_players = turn.get('game').inactivePlayers();
  //     var inactive_player_index = 0;
  //     return this.attackPlayer(inactive_player_index, inactive_players, turn);
  //   },
  //
  //   attackPlayer: function(index, players, turn) {
  //     if (index == players.length) {
  //       return;
  //     }
  //     var self = this;
  //     var attacked_player = players[index];
  //     if ((attacked_player.get('deck').length + attacked_player.get('discard').length) > 0) {
  //       var revealed_holding = new Revealed();
  //       attacked_player.get('deck').drawInto(revealed_holding, 2, attacked_player.get('discard'));
  //       var prompt = attacked_player.get('name')+' revealed '+(revealed_holding.map(function(card) {
  //         return card.get('name');
  //       }).join(' and '))+'. Which do you wish to trash?';
  //       var treasures = revealed_holding.find_cards_by_type('treasure');
  //       var buttons = treasures.map(function(card, index) {
  //         return {key: 'choose-resolution-prompt_'+index, text: card.get('name')};
  //       });
  //       buttons.push({key: 'choose-resolution-prompt_'+treasures.length, text: "None"});
  //       return ResolutionBuilder({
  //           input: prompt,
  //           prompt_buttons: buttons
  //         }, {
  //           resolve: function(button_index) {
  //             if (button_index != treasures.length) {
  //               var selected_card = treasures[button_index];
  //               var trash = turn.get('game').get('trash');
  //               revealed_holding.moveSomeCardsInto(trash, [selected_card]);
  //               // TODO: return prompt that does this! the user doesn't have to gain the trashed card
  //               trash.moveSomeCardsInto(turn.get('player').get('discard'), [selected_card]);
  //               attacked_player.get('discard').placeFrom(revealed_holding);
  //             }
  //             return self.attackPlayer(index + 1, players, turn);
  //           }
  //         });
  //     }
  //   }
  // });
  // Removed in v2
  // CardList.Base.Spy = new CardBuilder({type: 'action', cost: 4, name: 'Spy'}, {
  //   performAction: function(turn) {
  //     turn.set('num_actions', turn.get('num_actions') + 1);
  //     turn.get('player').draw(1);
  //     var players = turn.get('game').get('players');
  //     var player_index = 0;
  //     return this.spyOnPlayer(player_index, players, turn);
  //   },
  //
  //   spyOnPlayer: function(index, players, turn) {
  //     if (index == players.length) {
  //       return;
  //     }
  //     var self = this;
  //     var spied_on_player = players[index];
  //     if ((spied_on_player.get('deck').length + spied_on_player.get('discard').length) > 0) {
  //       var revealed_holding = new Revealed();
  //       spied_on_player.get('deck').drawInto(revealed_holding, 1, spied_on_player.get('discard'));
  //       var revealed_card = revealed_holding.at(0);
  //       var prompt = spied_on_player.get('name')+' revealed '
  //         +revealed_card.get('name')+'. Do you wish to discard it?';
  //       var buttons = [
  //         {key: 'choose-resolution-prompt_0', text: "Yes"},
  //         {key: 'choose-resolution-prompt_1', text: "No"},
  //       ]
  //       return ResolutionBuilder({
  //           input: prompt,
  //           prompt_buttons: buttons
  //         }, {
  //           resolve: function(button_index) {
  //             if (button_index == 0) {
  //               spied_on_player.get('discard').placeFrom(revealed_holding);
  //             } else {
  //               spied_on_player.get('deck').add(revealed_card, {at: 0});
  //             }
  //             return self.spyOnPlayer(index + 1, players, turn);
  //           }
  //         });
  //     }
  //   }
  // });

  // All the following were added in v2
  CardList.Base.Merchant = new CardBuilder({type: 'action', cost: 3, name: 'Merchant'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(1);

      // Technically, we are assuming they will play their silver here,
      // as we have no way to trigger +1 coin when the silver is played
      var silvers = turn.get('player').get('hand').find_cards_by_key('silver');
      if (silvers.length > 0) {
          turn.set('num_coins', turn.get('num_coins') + 1);
      }
    },
  });
  CardList.Base.Vassal = new CardBuilder({type: 'action', cost: 3, name: 'Vassal'}, {
    performAction: function(turn) {
      turn.set('num_coins', turn.get('num_coins') + 2);

      if ((turn.get('player').get('deck').length + turn.get('player').get('discard').length) === 0) {
          return
      }
      var revealed = new Revealed();
      turn.get('player').get('deck').drawInto(revealed, 1, turn.get('player').get('discard'));
      var drawn_card = revealed.at(0);
      turn.get('player').get('discard').placeFrom(revealed);
      if (drawn_card.get('type') == 'action') {
        return ResolutionBuilder({
            input: 'Play '+drawn_card.get('name')+'?',
            prompt_buttons: [
              {key: 'choose-resolution-prompt_0', text: "Yes"},
              {key: 'choose-resolution-prompt_1', text: "No"},
            ]
          }, {
            resolve: function(button_index) {
              if (button_index == 0) {
                turn.get('player').get('discard').moveSomeCardsInto(turn.get('player').get('table'), [drawn_card]);
                drawn_card.performAction(turn);
              }
            }
          });
      }
    },
  });
  CardList.Base.Poacher = new CardBuilder({type: 'action', cost: 4, name: 'Poacher'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.set('num_coins', turn.get('num_coins') + 1);
      turn.get('player').draw(1);

      var num_empty_piles = turn.get('game').get('supply').empty_piles().length;
      if (num_empty_piles > 0) {
          return ResolutionBuilder({
            source: 'hand',
            exact_count: num_empty_piles
          }, {
            resolve: function(cards_arr) {
              turn.get('player').discard(cards_arr);
            }
          });
      }
    },
  });
  CardList.Base.Bandit = new CardBuilder({type: 'action', cost: 5, name: 'Bandit'}, {
    performAction: function(turn) {
      var gold_pile = turn.get('game').get('supply').find_pile_by_key('gold');
      if (gold_pile) {
        turn.get('player').gainFromPile(gold_pile);
      }

      var self = this;
      _.each(turn.get('game').inactivePlayers(), function(player) {
        self.trashWorstNonCopperTreasure(turn, player);
      });
    },

    trashWorstNonCopperTreasure: function(turn, player) {
      // take top two cards from deck, trash the worst non-copper treasure
      if ((player.get('deck').length + player.get('discard').length) === 0) {
          return
      }
      var revealed = new Revealed();
      player.get('deck').drawInto(revealed, 2, player.get('discard'));
      var revealed_non_copper_treasures = revealed.filter(function (card) {
          return card.get('type') === 'treasure' && card.get('key') !== 'copper';
      });
      if (revealed_non_copper_treasures.length > 0) {
        // TODO: technically, the player should choose which one to trash
        var sorted = _.sortBy(revealed_non_copper_treasures, function(card) {
          return (card.get('cost') * 10) + card.get('value');
        });
        var worst_card = sorted[0];
        var other_cards = [];
        if (sorted.length > 1) {
            other_cards = sorted[1];
        }
        var trash = turn.get('game').get('trash');
        revealed.moveSomeCardsInto(trash, [worst_card]);
        revealed.moveSomeCardsInto(player.get('discard'), other_cards);
      }
    },
  });
  CardList.Base.Sentry = new CardBuilder({type: 'action', cost: 5, name: 'Sentry'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      turn.get('player').draw(1);

      if ((turn.get('player').get('deck').length + turn.get('player').get('discard').length) === 0) {
          return
      }

      var revealed = new Revealed();
      turn.get('player').get('deck').drawInto(revealed, 2, turn.get('player').get('discard'));
      return this.trashOrDiscardTopCard(turn, revealed);
    },

    trashOrDiscardTopCard: function(turn, revealed) {
      if (revealed.length === 0) {
          return;
      }
      var revealed_card = revealed.at(0);
      var self = this;
      return ResolutionBuilder({
        input: 'Discard or trash '+revealed_card.get('name')+'?',
        prompt_buttons: [
          {key: 'choose-resolution-prompt_0', text: "Discard"},
          {key: 'choose-resolution-prompt_1', text: "Trash"},
        ]
      }, {
        resolve: function(button_index) {
          if (button_index == 0) {
            revealed.moveSomeCardsInto(turn.get('player').get('discard'), [revealed_card]);
          } else {
            revealed.moveSomeCardsInto(turn.get('game').get('trash'), [revealed_card]);
          }
          return self.trashOrDiscardTopCard(turn, revealed);
        }
      });
    },
  });
  CardList.Base.Artisan = new CardBuilder({type: 'action', cost: 6, name: 'Artisan'}, {
    performAction: function(turn) {
      var self = this;
      return ResolutionBuilder({
        source: 'supply',
        input: 'Gain a card to your hand costing up to (5)' // TODO: auto-generate this?
      }, {
        canSelectPile: function(pile, already_selected_piles) {
          if (pile.get('builder').attrs.cost > 5) {
            return [false, null];
          }
          return [true, [pile]];
        },
        resolve: function(piles_arr) {
          turn.get('player').get('hand').add(piles_arr[0].getCard());
          return self.topDeckACard(turn);
        }
      });
    },

    topDeckACard: function(turn) {
        return ResolutionBuilder({
          source: 'hand',
          input: 'Place a card from your hand on top of your deck',
          exact_count: 1,
        }, {
          resolve: function(cards_arr) {
            turn.get('player').get('hand').moveSomeCardsInto(turn.get('player').get('deck'), cards_arr, {at: 0});
          }
        });
    },
  });
  // CardList.Base.Harbinger = new CardBuilder({type: 'action', cost: 3, name: 'Harbinger'}, {
  //   performAction: function(turn) {
  //     turn.set('num_actions', turn.get('num_actions') + 1);
  //     turn.get('player').draw(1);
  //     return this.topDeckADiscardedCard(turn);
  //   },
  //
  //   topDeckADiscardedCard: function(turn) {
  //     return ResolutionBuilder({
  //       input: 'Put a card on top of your deck?',
  //       source: 'discard' // TODO: add discard as a possible source
  //     }, {
  //       resolve: function(cards_arr) {
  //         if (cards_arr.length > 0) {
  //           turn.get('player').get('deck').addFrom(cards_arr[0]);
  //         }
  //       }
  //     });
  //   }
  // });

  /* TODO:
  Militia
  Moat
  Bureaucrat
  Throne Room (gonna need some crazy cloning stuff methinks)
  */

  return CardList;
});
