from uuid import uuid4

from django.db import models


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
    cod = models.CharField(max_length=50, blank=True, null=True)
    doc_fisc = models.CharField(max_length=50, blank=True, null=True)
    is_doacao = models.BooleanField()
    validade = models.DateField(blank=True, null=True)
    val_unit = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    val_total = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    fornecedor = models.CharField(max_length=200, null=True, blank=True)
    descricao = models.TextField()
    tipo_unit = models.CharField(max_length=10, null=True, blank=True)
