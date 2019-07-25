from functools import wraps


class Plus:
    def __init__(self):
        self.action_func_map = {}

    def action(self, name):
        def decorate(f):
            self.action_func_map[name] = f
            @wraps(f)
            def wrappers(*args, **kwds):
                print(args, kwds)
                return f(*args, **kwds)
            return wrappers
        return decorate


notion_plus = Plus()

action = notion_plus.action

from .demo1 import *
#from .demo2 import *