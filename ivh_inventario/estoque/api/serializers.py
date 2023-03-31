from rest_framework import serializers

from ivh_inventario.estoque.models import Estoque
from ivh_inventario.item.api.serializers import ItemSerializer


class CRUDEstoqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estoque
        fields = '__all__'

    class EstoqueGet(serializers.ModelSerializer):
        item = ItemSerializer()
        class Meta:
            model = Estoque
            fields = '__all__'