import datetime
from uuid import uuid4

from django.core.validators import MinValueValidator
from django.db import models

from ivh_inventario.item.models import Item
from ivh_inventario.usuario.models import Usuario


class Saida(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    dt_saida = models.DateField(default=datetime.date.today(), null=True, blank=True)
    quantidade = models.IntegerField("Quantidade", validators=[MinValueValidator(0)])
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    erro_saida = models.BooleanField(default=False)
    descricao = models.TextField(null=True, blank=True)
    is_ultimo = models.BooleanField(default=True)
    saida_pai = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

