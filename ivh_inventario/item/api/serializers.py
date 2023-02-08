from drf_base64.fields import Base64FileField
from rest_framework import serializers

from ivh_inventario.item.models import Item


class ItemSerializer(serializers.ModelSerializer):
    doc_fisc = Base64FileField()
    class Meta:
        model = Item
        fields = '__all__'
