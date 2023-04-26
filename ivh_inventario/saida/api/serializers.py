from rest_framework import serializers

from ivh_inventario.item.api.serializers import ItemSerializer
from ivh_inventario.saida.models import Saida
from ivh_inventario.usuario.api.serializers import UsuarioSerializer


class CRUDSaidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saida
        fields = '__all__'




class GETSaidaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()
    item = ItemSerializer()
    class Meta:
        model = Saida
        fields = '__all__'
