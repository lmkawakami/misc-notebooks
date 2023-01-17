import logging

def hours_hand(hour, minutes):
    base = (hour % 12) * (360//12)
    correction = int((minutes / 60) * (360 // 12))
    logging.debug(level=0, msg="lorem ipsum")
    return base + correction
