from django.db import models
from uuid import uuid4


class Doador(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False, verbose_name='uuid')
    nome = models.CharField(max_length=200, verbose_name='nome/fornecedor')
    cnpj_cpf = models.CharField(max_length=200, verbose_name='cpf/cnpj', unique=True)
