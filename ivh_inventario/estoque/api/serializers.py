from rest_framework import serializers

from ivh_inventario.estoque.models import Estoque


class CRUDEstoqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estoque
        fields = '__all__'