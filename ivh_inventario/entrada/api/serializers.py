from rest_framework import serializers

from ivh_inventario.entrada.models import Entrada
from ivh_inventario.item.api.serializers import ItemSerializer
from ivh_inventario.item.models import Item
from ivh_inventario.usuario.models import Usuario


class CRUDEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrada
        fields = '__all__'


class POSTEntradaSerializer(serializers.Serializer):
    dt_entrada = serializers.DateField("Data de entrada")
    quantidade = serializers.IntegerField(default=1)
    usuario = serializers.SlugRelatedField(queryset=Usuario.objects.all(), slug_field="uuid")
    item = ItemSerializer()

    def create(self, validated_data=None):
        data = dict(self.validated_data)
        item_obj = data['item']
        item = Item.objects.create(**item_obj)
        data['item'] = item
        entrada = Entrada.objects.create(**data)
        return CRUDEntradaSerializer(instance=entrada).data

