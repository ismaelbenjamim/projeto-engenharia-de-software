from rest_framework import serializers

from ivh_inventario.doador.models import Doador


class CRUDDoadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doador
        fields = '__all__'


class DoadorSerializer(serializers.Serializer):
    nome = serializers.CharField(required=False, allow_null=True)
    identificador = serializers.CharField(required=False, allow_null=True)
