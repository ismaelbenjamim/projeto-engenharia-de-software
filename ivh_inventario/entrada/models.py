from uuid import uuid4

from django.db import models

from ivh_inventario.item.models import Item
from ivh_inventario.usuario.models import Usuario


class Entrada(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    dt_entrada = models.DateField("Data de entrada")
    quantidade = models.IntegerField("Quantidade", default=1)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
