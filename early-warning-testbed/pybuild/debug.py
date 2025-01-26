import traceback
import os
import math


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


class Random:
    def __init__(self, value):
        self.seed = 0
        self.currentValue = 0
        self.init(value)

    def init(self, value):
        self.seed = value
        self.currentValue = self.seed

    def next(self):
        self.currentValue += self.seed
        self.currentValue ^= 353562

        return self.currentValue;

    def reset(self):
        self.currentValue = self.seed

    def getInt(self, min, max):
        if (min == max):
            return min

        val = self.next() % 10000

        return math.floor(((val / 10000.0) * (max - min)) + min)

    def getFloat(self, min, max):
        if (min == max):
            return min

        val = self.next() % 10000;

        return (((val / 10000.0) * (max - min)) + min);


random_colour_rand = Random(1234)


def resetRandomColour():
    random_colour_rand.reset()


def createRandomColour():
    letters = '0123456789ABCDEF'
    color = '#'
    for i in range(0, 6):
        color += letters[random_colour_rand.getInt(0, len(letters) - 1)]

    return color;


class logger:
    def log(self, text):
        print(text)

    def exception(self, e):
        self.log(exception_to_string(e))
