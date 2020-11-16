"""Word Finder: finds random words from a dictionary."""

from random import choice

class WordFinder:
    """
    A class used to read all words from a file

    >>> wf = WordFinder('words.txt')
    235886 words read

    >>> wf.random() in wf.words_list
    True
        
    """

    def __init__(self, path):
        self.path = path
        self.words_list = self.read_file()
        print(f"{len(self.words_list)} words read")
        

    def read_file(self):
        """reads all words from the file and returns them in a list."""

        wl = []
        with open(self.path) as f:
            for line in f:
                wl.append(line.strip())
        return wl


    def random(self):
        """returns a random word from the words list"""

        return choice(self.words_list)