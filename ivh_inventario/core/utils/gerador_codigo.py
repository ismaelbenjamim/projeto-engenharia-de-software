import random
import string


def geracao_codigo():
    codigo = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(10))
    return codigo
