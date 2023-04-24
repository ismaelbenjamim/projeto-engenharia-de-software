from rest_framework import serializers

from ivh_inventario.doador.models import Doador


class CRUDDoadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doador
        fields = '__all__'

class EntradaDoador(serializers.Serializer):
    nome = serializers.CharField()
    cnpj_cpf = serializers.CharField()

class DoadorSerializer(serializers.Serializer):
    nome = serializers.CharField(required=False, allow_null=True)
    identificador = serializers.CharField(required=False, allow_null=True)
