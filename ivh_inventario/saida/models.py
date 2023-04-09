from uuid import uuid4

from django.db import models

from ivh_inventario.item.models import Item
from ivh_inventario.usuario.models import Usuario


class Saida(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    dt_saida = models.DateField("Data de saida")
    quantidade = models.IntegerField("Quantidade", default=1)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    erro_saida = models.BooleanField(default=False)
    descricao = models.TextField(null=True, blank=True)
