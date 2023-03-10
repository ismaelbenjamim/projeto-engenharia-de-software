from rest_framework import serializers

from ivh_inventario.doador.models import Doador


class CRUDDoadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doador
        fields = '__all__'

