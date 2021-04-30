"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """

    def __init__(self, start):
        self.start = start
        self.counter = start

    def __repr__(self):
        return f"<SerialGenerator start={self.start} next={self.counter}>"

    def generate(self):
        """returns the current serial number and increases it by one"""
        res = self.counter
        self.counter += 1
        return res
    
    def reset(self):
        """resets the serial number to its start value"""
        self.counter = self.start