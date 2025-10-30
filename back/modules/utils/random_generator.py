from random import choice
import string
def get_random_string(length):
    return "".join([choice(string.ascii_uppercase) for i in range(length)])
