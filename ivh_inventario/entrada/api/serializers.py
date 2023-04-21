from rest_framework import serializers

from ivh_inventario.doador.apis.serializers import CRUDDoadorSerializer
from ivh_inventario.doador.models import Doador
from ivh_inventario.entrada.models import Entrada
from ivh_inventario.estoque.models import Estoque
from ivh_inventario.item.api.serializers import ItemSerializer
from ivh_inventario.item.models import Item
from ivh_inventario.usuario.models import Usuario


class CRUDEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrada
        fields = '__all__'


class POSTEntradaSerializer_novo_item(serializers.Serializer):
    is_novo_item = serializers.BooleanField()
    dt_entrada = serializers.DateField("Data de entrada")
    quantidade = serializers.IntegerField(default=1)
    usuario = serializers.SlugRelatedField(queryset=Usuario.objects.all(), slug_field="uuid")
    item = ItemSerializer()
    is_doacao = serializers.BooleanField()
    doc_fisc = serializers.FileField(required=False)
    validade = serializers.DateField(required=False)
    val_unit = serializers.DecimalField(required=False, max_digits=15, decimal_places=2)
    val_total = serializers.DecimalField(required=False, max_digits=15, decimal_places=2)
    fornecedor = serializers.CharField(required=False)
    tipo_unit = serializers.CharField(required=False)
    doador = CRUDDoadorSerializer(required=False)


    def create(self, validated_data=None):
        data = dict(self.validated_data)

        doador = dict(data['doador'])
        filtro_doador = Doador.objects.filter(cnpj_cpf=doador['cnpj_cpf'])
        if not filtro_doador:
            doador = Doador(
                nome=doador['nome'],
                cnpj_cpf=doador['cnpj_cpf']
            )
            doador.save()
            filtro_doador = doador

        data['doador'] = filtro_doador

        item_obj = data['item']
        item = Item.objects.create(**item_obj)
        item.doador = filtro_doador.get()
        item.save()

        data['item'] = item
        print(data)
        data.pop('is_novo_item')

        entrada = Entrada.objects.create(**data)
        Estoque.objects.create(estoque_atual=data['quantidade'], item=item.get())
        return CRUDEntradaSerializer(instance=entrada).data


class POSTEntradaSerializer(serializers.Serializer):
    is_novo_item = serializers.BooleanField()
    dt_entrada = serializers.DateField("Data de entrada")
    quantidade = serializers.IntegerField(default=1)
    usuario = serializers.SlugRelatedField(queryset=Usuario.objects.all(), slug_field="uuid")
    item = serializers.SlugRelatedField(queryset=Item.objects.all(), slug_field="uuid")
    is_doacao = serializers.BooleanField()
    doc_fisc = serializers.FileField(required=False)
    validade = serializers.DateField(required=False)
    val_unit = serializers.DecimalField(required=False, max_digits=15, decimal_places=2)
    val_total = serializers.DecimalField(required=False, max_digits=15, decimal_places=2)
    fornecedor = serializers.CharField(required=False)
    tipo_unit = serializers.CharField(required=False)
    doador = CRUDDoadorSerializer(required=False)

    def create(self, validated_data=None):
        data = dict(self.validated_data)

        doador = dict(data['doador'])
        filtro_doador = Doador.objects.filter(cnpj_cpf=doador['cnpj_cpf'])
        if not filtro_doador:
            doador = Doador(
                nome=doador['nome'],
                cnpj_cpf=doador['cnpj_cpf']
            )
            doador.save()
            filtro_doador = doador

        data['doador'] = filtro_doador
        print(data)
        data.pop('is_novo_item')

        entrada = Entrada.objects.create(**data)
        item = Item.objects.filter(uuid=data['item'].uuid)
        Estoque.objects.create(estoque_atual=data['quantidade'], item=item.get())
        return CRUDEntradaSerializer(instance=entrada).data

