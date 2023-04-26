from uuid import uuid4

from django.db import models

from ivh_inventario.doador.models import Doador


class Item(models.Model):
    GRUPO = (
        ("equipamento", "equipamento"),
        ("gêneros alimentícios", "gêneros alimentícios"),
        ("higiene pessoal","higiene pessoal"),
        ("limpeza", "limpeza"),
        ("medicamento", "medicamento"),
        ("não identificado", "não identificado")
    )
    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    is_bem_de_consumo = models.BooleanField()
    grupo = models.CharField(max_length=200, choices=GRUPO)
    cod = models.CharField(max_length=50, unique=True)
    descricao = models.TextField()
    estoque_atual = models.IntegerField(blank=True, null=True, default=0)

    def __str__(self):
        return f"{self.cod} - {self.descricao}"
