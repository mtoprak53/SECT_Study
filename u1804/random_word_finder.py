from wordfinder import WordFinder

class SpecialWordFinder(WordFinder):
  """
  A subclass of WordFinder class which eliminates empty lines and comment lines
  """

  def __init__(self, path):
    super().__init__(path)
    self.words_list = self.read_file()

    
  def read_file(self):
    """returns only words, no empty or comment lines"""

    wl = super().read_file()
    swl = [w.strip() for w in wl if w !='' and w[0] != '#']
    return swl