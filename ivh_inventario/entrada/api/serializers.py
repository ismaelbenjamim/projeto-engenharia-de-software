from rest_framework import serializers

from ivh_inventario.entrada.models import Entrada


class CRUDEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrada
        fields = '__all__'


