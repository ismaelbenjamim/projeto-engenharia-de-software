from drf_base64.fields import Base64FileField
from rest_framework import serializers

from ivh_inventario.doador.apis.serializers import CRUDDoadorSerializer, EntradaDoador
from ivh_inventario.doador.models import Doador
from ivh_inventario.entrada.models import Entrada
from ivh_inventario.item.api.serializers import ItemSerializer
from ivh_inventario.item.models import Item
from ivh_inventario.usuario.api.serializers import CRUDUsuarioSerializer
from ivh_inventario.usuario.models import Usuario


'''
Serializers relacionados ao app de entrada 
'''


class CRUDEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrada
        fields = '__all__'

class GETEntradaSerializer(serializers.ModelSerializer):
    usuario = serializers.SerializerMethodField()
    item = ItemSerializer()

    class Meta:
        model = Entrada
        fields = '__all__'

    def get_usuario(self, obj):
        if obj.usuario:
            return obj.usuario.username  # supondo que o modelo Usuario tenha um campo nome

        return None


class POSTEntradaSerializer_novo_item(serializers.Serializer):
    is_novo_item = serializers.BooleanField()
    dt_entrada = serializers.DateField("Data de entrada")
    quantidade = serializers.IntegerField(default=1)
    usuario = serializers.SlugRelatedField(queryset=Usuario.objects.all(), slug_field="uuid")
    item = ItemSerializer()
    is_doacao = serializers.BooleanField()
    doc_fisc = Base64FileField(required=False)
    validade = serializers.DateField(required=False)
    val_unit = serializers.DecimalField(required=False, max_digits=15, decimal_places=2)
    val_total = serializers.DecimalField(required=False, max_digits=15, decimal_places=2)
    fornecedor = serializers.CharField(required=False)
    tipo_unit = serializers.CharField(required=False)
    doador = EntradaDoador(required=False)

    def create(self, validated_data=None):
        data = dict(self.validated_data)
        doador = data.get('doador')
        if doador:
            doador = dict(doador)
            filtro_doador = Doador.objects.get_or_create(cnpj_cpf=doador['cnpj_cpf'], nome=doador['nome'])
            data['doador'] = filtro_doador[0]

        item_obj = data['item']
        item = Item.objects.create(**item_obj)
        item.save()

        data['item'] = item
        data.pop('is_novo_item')

        entrada = Entrada.objects.create(**data)
        item.estoque_atual = entrada.quantidade
        item.save()
        return CRUDEntradaSerializer(instance=entrada).data


class POSTEntradaSerializer(serializers.Serializer):
    is_novo_item = serializers.BooleanField()
    dt_entrada = serializers.DateField("Data de entrada")
    quantidade = serializers.IntegerField(default=1)
    usuario = serializers.SlugRelatedField(queryset=Usuario.objects.all(), slug_field="uuid")
    item = serializers.SlugRelatedField(queryset=Item.objects.all(), slug_field="uuid")
    is_doacao = serializers.BooleanField()
    doc_fisc = Base64FileField(required=False)
    validade = serializers.DateField(required=False)
    val_unit = serializers.DecimalField(required=False, max_digits=15, decimal_places=2)
    val_total = serializers.DecimalField(required=False, max_digits=15, decimal_places=2)
    fornecedor = serializers.CharField(required=False)
    tipo_unit = serializers.CharField(required=False)
    doador = EntradaDoador(required=False)

    def create(self, validated_data=None):
        data = dict(self.validated_data)

        doador = data.get('doador')
        if doador:
            doador = dict(doador)
            filtro_doador = Doador.objects.get_or_create(cnpj_cpf=doador['cnpj_cpf'], nome=doador['nome'])
            data['doador'] = filtro_doador[0]
        data.pop('is_novo_item')

        entrada = Entrada.objects.create(**data)
        verifica_estoque = Item.objects.filter(uuid=entrada.item.uuid)
        if verifica_estoque:
            nova_quantidade = verifica_estoque.get()
            nova_quantidade.estoque_atual = int(verifica_estoque.get().estoque_atual) + int(data['quantidade'])
            nova_quantidade.save()
        return CRUDEntradaSerializer(instance=entrada).data

