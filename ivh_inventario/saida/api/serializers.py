from rest_framework import serializers

from ivh_inventario.saida.models import Saida


class CRUDSaidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saida
        fields = '__all__'
