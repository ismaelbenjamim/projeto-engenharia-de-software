from uuid import uuid4

from django.db import models

from ivh_inventario.item.models import Item


class Estoque(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    estoque_atual = models.IntegerField("Estoque atual", default=1)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
