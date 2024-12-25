import csv
import random

import traceback
import os
import json

def exception_to_string(exception):
    try:
        text = str(exception)
        text += '\n'
        stack = traceback.format_tb(tb=exception.__traceback__)
        stack.reverse()
        for entry in stack:
            terms = entry.split(',')
            head, filename = os.path.split(terms[0])
            text += filename.replace('"', '') + terms[1].replace('line ', ':').replace(' ', '')
            text += terms[2].replace('\n', '')
            text += '\n'

        return text

    except Exception as e:
        return 'Failed to process exception!'


class ARSINOEReslienceGame:
    def __init__(self):
        self.intervention_deck = []
        self.current_deck = []

        self.round = 0
        self.selected_interventions = []

        self.init()

    def init(self):
        self.intervention_deck = []

        with open('interventions.csv', newline='', encoding='utf-8-sig') as csvfile:
            reader = csv.DictReader(csvfile, skipinitialspace=True)

            for row in reader:
                if isinstance(row['name'], str) and len(row['name']) > 0:

                    for key in row:
                        row[key] = row[key].replace('\n','')
                        row[key] = row[key].replace('\u00a0', ' ')


                    self.intervention_deck.append(row)

        with open('../game/intervention-cards.js','w') as fp:
            fp.write('let intervention_cards = ')
            fp.write('\n')
            json.dump(self.intervention_deck, fp, indent=4)
            fp.write(';\n')
            fp.write('\n')
            fp.close()


        self.current_deck = []

        index = 0
        for entry in self.intervention_deck:
            self.current_deck.append(index)
            index +=1

        self.round = 0
        self.selected_interventions = []

    def get_intervention_card(self, entry:int):
        return self.intervention_deck[entry]

    def select_intervention(self, entry:int):
        self.selected_interventions.append(entry)
        self.current_deck.remove(entry)

    def get_round_cards(self):
        current_options = []

        for i in range(0,4):

            while True:
                intervention = random.choice(self.current_deck)

                if intervention not in current_options and not self.invention_type_in_cards(intervention, current_options):
                    current_options.append(intervention)
                    break

        return current_options

    def invention_type_in_cards(self, intervention:int, current_options:list) -> bool:
        for card in current_options:
            if self.intervention_deck[intervention]['type'] == self.intervention_deck[card]['type']:
                return True

        return False

    def get_protection(self):
        protection = {}

        protection['EP'] = 0
        protection['BP'] = 0
        protection['FP'] = 0
        protection['DP'] = 0
        protection['HP'] = 0

        for entry in self.selected_interventions:
            card = self.get_intervention_card(entry)

            for key in protection.keys():
                protection[key] += int(card[key])

        return protection

    def print_selected_interventions(self):
        for entry in self.selected_interventions:
            card = self.get_intervention_card(entry)
            text = '\t'
            text += (card['type'] + ' ' + card['name']).ljust(40, ' ')
            text += '  EP:' + str(card['EP']).rjust(2, ' ')
            text += '  BP:' + str(card['BP']).rjust(2, ' ')
            text += '  FP:' + str(card['FP']).rjust(2, ' ')
            text += '  DP:' + str(card['DP']).rjust(2, ' ')
            text += '  HP:' + str(card['HP']).rjust(2, ' ')
            print(text)

        prot = self.get_protection()
        text = '\t'
        text += ('Overall Protection').ljust(40, ' ')

        for key in prot.keys():
            text += '  ' + key + ':' + str(prot[key]).rjust(2, ' ')

        print(text)

        print('\n')

    def get_response(self, severity:str, score:int) -> str:
        if severity == 'minor':

            if score <1: return 'under-prepared'
            if score < 3: return 'appropriate'

            if score > 6: return 'extreme overkill'

            return 'overkill'

        if severity == 'average':

            if score <1: return 'severly under-prepared'
            if score < 3: return 'under-prepared'
            if score < 5: return 'appropriate'

            if score > 6: return 'extreme overkill'

            return 'overkill'

        if severity == 'extreme':

            if score < 3: return 'severly under-prepared'
            if score < 5: return 'under-prepared'

            if score > 7: return 'overkill'

            return 'appropriate'

        return 'n/a'

    def run_game(self):
        self.init()

        ## select interventions
        for round in range(0, 4):
            try:
                print('Round ' + str(round + 1) + ' of ' + str(4) + ' deck size:' + str(len(self.current_deck)))
                if len(self.selected_interventions) > 0:
                    print('Interventions selected')
                    self.print_selected_interventions()

                current_options = self.get_round_cards()

                entry_index = 1
                for entry in current_options:
                    text = ''

                    text += str(entry_index) + '. '

                    if False:
                        text += str(entry) + ' '

                    card = self.get_intervention_card(entry)

                    text += (card['type'] + ' ' + card['name']).ljust(40, ' ')
                    text += '  EP:' + str(card['EP']).rjust(2, ' ')
                    text += '  BP:' + str(card['BP']).rjust(2, ' ')
                    text += '  FP:' + str(card['FP']).rjust(2, ' ')
                    text += '  DP:' + str(card['DP']).rjust(2, ' ')
                    text += '  HP:' + str(card['HP']).rjust(2, ' ')

                    print(text)
                    entry_index += 1

                key = input('>')

                input_index = int(key) - 1

                if input_index >= 0 and input_index < len(current_options):
                    card = self.get_intervention_card(current_options[input_index])
                    text = ''
                    text += (card['type'] + ' ' + card['name']).ljust(40, ' ')

                    print('You choose: ' + text)
                    self.select_intervention(current_options[input_index])
            except Exception as e:
                print(exception_to_string(e))

        ##your interventions
        print('\n')
        print('Interventions selected')
        self.print_selected_interventions()

        events = {}
        events['EP'] = {'name': 'Economic'}
        events['BP'] = {'name': 'Biodiversity'}
        events['FP'] = {'name': 'Flood'}
        events['DP'] = {'name': 'Drought'}
        events['HP'] = {'name': 'Extreme Temp'}

        prot = self.get_protection()

        for event in events:
            text = '\t'
            text += events[event]['name']

            text += ' '

            severity = random.choice(['minor', 'average', 'extreme'])

            text = (text + severity + ' event! ').ljust(40,' ')

            text += 'response: ' + str(prot[event]) + ' ' + self.get_response(severity, prot[event])

            print(text)


inst = ARSINOEReslienceGame()

inst.run_game()

