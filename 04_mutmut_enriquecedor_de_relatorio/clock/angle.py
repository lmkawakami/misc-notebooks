from clock.utils import hours_hand, minutes_hand

def between(hour, minutes):
    return abs(hours_hand(hour, minutes) - minutes_hand(hour, minutes))
