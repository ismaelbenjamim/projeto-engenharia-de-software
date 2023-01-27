from rest_framework import serializers

from ivh_inventario.entrada.models import Entrada
from ivh_inventario.item.models import Item


class CRUDEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrada
        fields = '__all__'


class POSTEntradaSerializer(serializers.Serializer):
    quantidade = serializers.IntegerField(required=True, allow_null=False)
    dt_entrada = serializers.DateField(required=False, allow_null=True)
    usuario = serializers.UUIDField(required=False, allow_null=True)
    item = serializers.UUIDField(required=False, allow_null=True)
    is_bem_de_consumo = serializers.BooleanField(required=True, allow_null=False)
    grupo = serializers.CharField(required=True, max_length=200, allow_null=False)
    cod = serializers.CharField(max_length=200, required=False, allow_null=True)
    doc_fiscal = serializers.CharField(max_length=200, required=False, allow_null=True)
    is_doacao = serializers.BooleanField(required=True, allow_null=False)
    validade = serializers.DateField(required=False, allow_null=True)
    val_unit = serializers.DecimalField(max_digits=15, decimal_places=2, required=False, allow_null=True)
    val_total = serializers.DecimalField(max_digits=15, decimal_places=2, required=False, allow_null=True)
    fornecedor = serializers.CharField(max_length=200, required=False, allow_null=True)
    descricao = serializers.CharField(required=True, allow_null=False)
    tipo_unit = serializers.CharField(max_length=200, required=False, allow_null=True)



