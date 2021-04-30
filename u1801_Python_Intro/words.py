# def print_upper_words(str_list):
  # """A function to print items in a list in uppercase"""
def print_upper_words(str_list, must_start_with):
  """A function to print items in a list in uppercase if they start with given letters"""

  # for str in str_list:
  #   print(str.upper())

  for str in str_list:
    if str[0].lower() in must_start_with:
      print(str.upper())


# str_list = ['kamil', 'memik', 'kamiletto', 'pamukella', 'ECMAScript', 'eatery']
# print_upper_words(str_list)


# this should print "HELLO", "HEY", "YO", and "YES"
print_upper_words(["hello", "hey", "goodbye", "yo", "yes"], must_start_with={"h", "y"})