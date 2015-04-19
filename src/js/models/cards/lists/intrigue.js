define(['models/cards/card_builder', 'models/cards/lists/meta', 'models/cards/revealed', 'models/resolutions/resolution_builder'],
function(CardBuilder, CardList, Revealed, ResolutionBuilder) {
  CardList.Intrigue = {};

  CardList.Intrigue.Courtyard = new CardBuilder({type: 'action', cost: 2, name: 'Courtyard'}, {
    performAction: function(turn) {
      turn.get('player').draw(3);
      return ResolutionBuilder({
        source: 'hand',
        exact_count: 1
      }, {
        resolve: function(cards_arr) {
          turn.get('player').placeFromHandOnTopOfDeck(cards_arr);
        }
      });
    }
  });
  CardList.Intrigue.Pawn = new CardBuilder({type: 'action', cost: 2, name: 'Pawn'}, {
    performAction: function(turn) {
      var rbb = function myself(already_selected_index) {
        var all_prompts = [
          {key: 'choose-resolution-prompt_0', text: "Draw 1"},
          {key: 'choose-resolution-prompt_1', text: "+1 action"},
          {key: 'choose-resolution-prompt_2', text: "+1 buy"},
          {key: 'choose-resolution-prompt_3', text: "+1 coin"},
        ];
        var prompts = all_prompts.slice(0);
        if (already_selected_index !== undefined) {
          prompts.splice(already_selected_index, 1);
        }
        return ResolutionBuilder({
          input: 'Which will you do?',
          prompt_buttons: prompts
        }, {
          resolve: function(button_index) {
            if (button_index == 0) {
              // we wait until both choices are made to draw, as that reveals the top card of the deck
            } else if (button_index == 1) {
              turn.set('num_actions', turn.get('num_actions') + 1);
            } else if (button_index == 2) {
              turn.set('num_buys', turn.get('num_buys') + 1);
            } else if (button_index == 3) {
              turn.set('num_coins', turn.get('num_coins') + 1);
            }
            if (already_selected_index === undefined) {
              return myself(button_index);
            } else if (already_selected_index == 0) {
              turn.get('player').draw(1);
            }
          }
        });
      };
      return rbb();
    }
  });
  CardList.Intrigue.ShantyTown = new CardBuilder({type: 'action', cost: 3, name: 'Shanty Town'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 2);
      if (turn.get('player').get('hand').find_cards_by_type('action').length == 0) {
        turn.get('player').draw(2);
      }
    }
  });
  CardList.Intrigue.Steward = new CardBuilder({type: 'action', cost: 3, name: 'Steward'}, {
    performAction: function(turn) {
      return ResolutionBuilder({
        input: 'Which will you do?',
        prompt_buttons: [
          {key: 'choose-resolution-prompt_0', text: "Draw 2"},
          {key: 'choose-resolution-prompt_1', text: "+2 coin"},
          {key: 'choose-resolution-prompt_2', text: "Trash 2 cards"},
        ]
      }, {
        resolve: function(button_index) {
          if (button_index == 0) {
            turn.get('player').draw(2);
          } else if (button_index == 1) {
            turn.set('num_coins', turn.get('num_coins') + 2);
          } else if (button_index == 2) {
            return ResolutionBuilder({
              source: 'hand',
              exact_count: 2
            }, {
              resolve: function(cards_arr) {
                turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
              }
            });
          }
        }
      });
    }
  });
  CardList.Intrigue.Swindler = new CardBuilder({type: 'action', cost: 3, name: 'Swindler'}, {
    performAction: function(turn) {
      turn.set('num_coins', turn.get('num_coins') + 2);

      var inactive_players = turn.get('game').inactivePlayers();
      var inactive_player_index = 0;
      return this.attackPlayer(inactive_player_index, inactive_players, turn);
    },

    attackPlayer: function(index, players, turn) {
      if (index == players.length) {
        return;
      }
      var self = this;
      var attacked_player = players[index];
      if ((attacked_player.get('deck').length + attacked_player.get('discard').length) > 0) {
        var revealed_holding = new Revealed();
        attacked_player.get('deck').drawInto(revealed_holding, 1, attacked_player.get('discard'));
        var revealed_card = revealed_holding.at(0);
        revealed_holding.moveSomeCardsInto(turn.get('game').get('trash'), revealed_card);
        var revealed_card_cost = revealed_card.get('cost');
        var prompt = attacked_player.get('name')+' revealed '+revealed_card.get('name')+'.';
        prompt += ' Choose a card costing exactly '+revealed_card_cost+' to replace it with.';
        return ResolutionBuilder({
          input: prompt,
          source: 'supply',
          exact_count: 1
        }, {
          canSelectPile: function(pile, already_selected_piles) {
            if (pile.get('builder').attrs.cost !== revealed_card_cost) {
              return [false, null];
            }
            return [true, [pile]];
          },
          resolve: function(piles_arr) {
            attacked_player.gainFromPile(piles_arr[0]);
            return self.attackPlayer(index + 1, players, turn);
          }
        });
      }
    }
  });
  CardList.Intrigue.WishingWell = new CardBuilder({type: 'action', cost: 3, name: 'Wishing Well'}, {
    performAction: function(turn) {
      turn.get('player').draw(1);
      turn.set('num_actions', turn.get('num_actions') + 1);

      // we choose to be slightly helpful by only listing cards you own
      var all_cards = []
        .concat(turn.get('player').get('deck').models)
        .concat(turn.get('player').get('discard').models)
        .concat(turn.get('player').get('hand').models)
        .concat(turn.get('player').get('table').models);
      var card_name_buttons = _.chain(all_cards)
        .map(function(card) { return card.get('name'); })
        .unique(function(name) { return name; })
        .map(function(name, index) {
          return {key: 'choose-resolution-prompt_'+index, text: name};
        }).value();
      card_name_buttons.concat([{key: 'choose-resolution-prompt_'+card_name_buttons.length, text: "None"}]);
      return ResolutionBuilder({
        input: "Name a card. If it's the top card of your deck, you draw it into your hand.",
        prompt_buttons: card_name_buttons
      }, {
        resolve: function(button_index) {
          var revealed = new Revealed();
          turn.get('player').get('deck').drawInto(revealed, 1, turn.get('player').get('discard'));
          var desired_name = card_name_buttons[button_index].text;
          if (revealed.at(0).get('name') === desired_name) {
            revealed.moveSomeCardsInto(turn.get('player').get('hand'), revealed.models);
          } else {
            revealed.moveSomeCardsInto(turn.get('player').get('deck'), revealed.models, {at: 0});
          }
        }
      });
    }
  });
  CardList.Intrigue.Baron = new CardBuilder({type: 'action', cost: 4, name: 'Baron'}, {
    performAction: function(turn) {
      turn.set('num_buys', turn.get('num_buys') + 1);
      var estates_in_hand = turn.get('player').get('hand').find_cards_by_key('estate');
      if (estates_in_hand.length > 0) {
        var self = this;
        return ResolutionBuilder({
          input: 'Discard an estate for +4 coin, or gain an Estate?',
          prompt_buttons: [
            {key: 'choose-resolution-prompt_0', text: "Discard"},
            {key: 'choose-resolution-prompt_1', text: "Gain"},
          ]
        }, {
          resolve: function(button_index) {
            if (button_index == 0) {
              turn.get('player').discard(estates_in_hand[0]);
              turn.set('num_coins', turn.get('num_coins') + 4);
            } else if (button_index == 1) {
              self.gainEstate(turn);
            }
          }
        });
      } else {
        this.gainEstate(turn);
      }
    },

    gainEstate: function(turn) {
      turn.get('player').gainFromPile(turn.get('game').get('supply').find_pile_by_key('estate'));
    }
  });
  CardList.Intrigue.Conspirator = new CardBuilder({type: 'action', cost: 4, name: 'Conspirator'}, {
    performAction: function(turn) {
      turn.set('num_coins', turn.get('num_coins') + 2);
      var actions_in_play = turn.get('player').get('table').find_cards_by_type('action');
      if (actions_in_play.length >= 3) {
        turn.set('num_actions', turn.get('num_actions') + 1);
        turn.get('player').draw(1);
      }
    }
  });
  CardList.Intrigue.Ironworks = new CardBuilder({type: 'action', cost: 4, name: 'Ironworks'}, {
    performAction: function(turn) {
      return ResolutionBuilder({
        source: 'supply',
        // TODO: enforce *_count
        exact_count: 1
      }, {
        canSelectPile: function(pile, already_selected_piles) {
          if (pile.get('builder').attrs.cost > 4) {
            return [false, null];
          }
          return [true, [pile]];
        },
        resolve: function(piles_arr) {
          var pile = piles_arr[0];
          turn.get('player').gainFromPile(pile);
          var type = pile.get('builder').attrs.type;
          if (type == 'action') {
            turn.set('num_actions', turn.get('num_actions') + 1);
          }
          if (type == 'treasure') {
            turn.set('num_coins', turn.get('num_coins') + 1);
          }
          if (type == 'victory') {
            turn.get('player').draw(1);
          }
        }
      });
    }
  });
  CardList.Intrigue.MiningVillage = new CardBuilder({type: 'action', cost: 4, name: 'Mining Village'}, {
    performAction: function(turn) {
      turn.get('player').draw(1);
      turn.set('num_actions', turn.get('num_actions') + 2);
      return ResolutionBuilder({
        input: "Trash Mining Village for +2 coin?",
        prompt_buttons: [
          {key: 'choose-resolution-prompt_0', text: 'Yes'},
          {key: 'choose-resolution-prompt_1', text: 'No'},
        ]
      }, {
        resolve: function(button_index) {
          if (button_index === 0) {
            mv = [turn.get('player').get('table').find_cards_by_key('mining-village')[0]];
            turn.get('player').get('table').moveSomeCardsInto(turn.get('game').get('trash'), mv);
            turn.set('num_coins', turn.get('num_coins') + 2);
          }
        }
      });
    }
  });
  CardList.Intrigue.Duke = new CardBuilder({type: 'victory', cost: 5, name: 'Duke'}, {
    calculateScore: function(deck) {
      return deck.find_cards_by_key('duchy').length;
    }
  });
  CardList.Intrigue.Minion = new CardBuilder({type: 'action', cost: 5, name: 'Minion'}, {
    performAction: function(turn) {
      turn.set('num_actions', turn.get('num_actions') + 1);
      return ResolutionBuilder({
        input: "+2 Coin, or discard your hand for +4 cards and all other players with more than 4 cards in hand discard their hands for +4 cards",
        prompt_buttons: [
          {key: 'choose-resolution-prompt_0', text: '+2 Coin'},
          {key: 'choose-resolution-prompt_1', text: 'Discard for +4 Cards'},
        ]
      }, {
        resolve: function(button_index) {
          if (button_index === 0) {
            turn.set('num_coins', turn.get('num_coins') + 2);
          } else {
            turn.get('player').discardHand();
            turn.get('player').draw(4);
            _.each(turn.get('game').inactivePlayers(), function(player) {
              if (player.get('hand').length > 4) {
                player.discardHand();
                player.draw(4);
              }
            });
          }
        }
      });
    }
  });
  CardList.Intrigue.TradingPost = new CardBuilder({type: 'action', cost: 5, name: 'Trading Post'}, {
    performAction: function(turn) {
      return ResolutionBuilder({
        source: 'hand',
        exact_count: 2
      }, {
        resolve: function(cards_arr) {
          turn.get('player').trashFromHand(cards_arr, turn.get('game').get('trash'));
          if (cards_arr.length == 2) {
            turn.get('player').gainFromPile(turn.get('game').get('supply').find_pile_by_key('silver'));
          }
        }
      });
    }
  });
  CardList.Intrigue.Tribute = new CardBuilder({type: 'action', cost: 5, name: 'Tribute'}, {
    performAction: function(turn) {
      var attacked_player = turn.get('game').inactivePlayers()[0];
      var revealed = new Revealed();
      attacked_player.get('deck').drawInto(revealed, 2, attacked_player.get('discard'));
      _.chain(revealed.models)
        .unique(function(card) { return card.get('name'); })
        .each(function(card) {
          var type = card.get('type');
          if (type == 'action') {
            turn.set('num_actions', turn.get('num_actions') + 2);
          }
          if (type == 'treasure') {
            turn.set('num_coins', turn.get('num_coins') + 2);
          }
          if (type == 'victory') {
            turn.get('player').draw(2);
          }
        });
      attacked_player.discard(revealed.models);
    }
  });
  // TODO: mixin for actions behavior. should be able to do something like mixins: [Cantrip, ExactRemodel(+1)]
  CardList.Intrigue.Upgrade = new CardBuilder({type: 'action', cost: 5, name: 'Upgrade'}, {
    performAction: function(turn) {
      turn.get('player').draw(1);
      turn.set('num_actions', turn.get('num_actions') + 1);

      var gainerBuilderBuilder = function(trashedCost) {
        return ResolutionBuilder({
            source: 'supply',
            // TODO: enforce *_count
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

  /* TODO:
  Secret Chamber (reaction)
  Great Hall (multi-type)
  Masquerade (other user input)
  Bridge (variable cost effect)
  Coppersmith (treasure power)
  Scout (re-order cards)
  Saboteur (other user input)
  Torturer (other user input)
  Harem (multi-type)
  Nobles (multi-type)
  */

  return CardList;
});
