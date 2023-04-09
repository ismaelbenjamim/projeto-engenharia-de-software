from uuid import uuid4

from django.db import models

from ivh_inventario.doador.models import Doador
from ivh_inventario.item.models import Item
from ivh_inventario.usuario.models import Usuario


class Entrada(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    dt_entrada = models.DateField("Data de entrada")
    quantidade = models.IntegerField("Quantidade", default=1)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
    doc_fisc = models.FileField(verbose_name="Documento fiscal", blank=True, null=True)
    is_doacao = models.BooleanField()
    validade = models.DateField(blank=True, null=True)
    val_unit = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    val_total = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    fornecedor = models.CharField(max_length=200, null=True, blank=True)
    tipo_unit = models.CharField(max_length=10, null=True, blank=True)
    doador = models.ForeignKey(Doador, on_delete=models.CASCADE, null=True, blank=True)

