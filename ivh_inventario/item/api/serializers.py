from drf_base64.fields import Base64FileField
from rest_framework import serializers

from ivh_inventario.doador.apis.serializers import DoadorSerializer
from ivh_inventario.item.models import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
