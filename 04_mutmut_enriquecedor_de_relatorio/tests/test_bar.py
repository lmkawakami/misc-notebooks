from foo import foo
from foo import bar

def test_0():
    assert bar.bar == "bar"

def test_1():
    assert bar.a == 123