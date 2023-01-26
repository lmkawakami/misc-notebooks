from foo import foo

def test_1():
    y = 1
    z = 1
    assert y == z

def test_1():
    assert foo.a == 1

def test_2():
    assert foo.b == 'a'

def test_3():
    assert foo.c['foo'] == ""

def test_4():
    assert foo.d == 1

def test_5():
    assert foo.e == 0

def test_6():
    assert foo.f(foo.a, foo.b, foo.c) == '1a'

def test_7():
    assert foo.g == False

def test_8():
    assert foo.h == False


def test_9():
    assert foo.asd == 456