import datetime

from django.db.models import Q
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ivh_inventario.core.utils.organiza_documentacao import documentacao
from ivh_inventario.core.utils.relatorio_xls import gerar_planilha
from ivh_inventario.item.models import Item
from ivh_inventario.saida.api.serializers import CRUDSaidaSerializer, GETSaidaSerializer
from ivh_inventario.saida.models import Saida


class CRUDSaidaViewSet(viewsets.ModelViewSet):
    queryset = Saida.objects.all().filter(is_ultimo=True).order_by('-dt_saida')
    serializer_class = CRUDSaidaSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    docs_list = documentacao(
        metodo='get',
        operation_summary='List de saída',
        operation_description='Api para trazer a lista de saídas',
        response200=CRUDSaidaSerializer
    )
    docs_read = documentacao(
        metodo='get',
        operation_summary='Read de saída',
        operation_description='Api para trazer uma saída específica',
        response200=CRUDSaidaSerializer
    )
    docs_post = documentacao(
        metodo='post',
        operation_summary='Create de saída',
        operation_description='Api para criar uma nova saída',
        request_body=CRUDSaidaSerializer,
        response201=CRUDSaidaSerializer,

    )
    docs_put = documentacao(
        metodo='put',
        operation_summary='Put de saída',
        operation_description='Api para modificiar uma saída',
        response200=CRUDSaidaSerializer
    )
    docs_patch = documentacao(
        metodo='patch',
        operation_summary='Patch de saída',
        operation_description='Api para modificar parcialmente uma saída',
        response200=CRUDSaidaSerializer
    )
    docs_delete = documentacao(
        metodo='delete',
        operation_summary='Delete de saída',
        operation_description='Api para deletar uma saída',
        response200=CRUDSaidaSerializer
    )

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params
        for campo in self.request.query_params:
            try:
                valor = params.get(f'{campo}')
                queryset = queryset.filter(**{campo: valor})
            except:
                queryset = self.queryset

        return queryset

    @swagger_auto_schema(**docs_list['get'])
    def list(self, request, *args, **kwargs):
        self.serializer_class = GETSaidaSerializer
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(**docs_read['get'])
    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = GETSaidaSerializer
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(**docs_patch['patch'])
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_list['get'])
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_delete['delete'])
    def destroy(self, request, *args, **kwargs):
        filtro = Saida.objects.filter(uuid=kwargs.get('pk'))
        if filtro:
            filtro = filtro.get()
            if filtro.is_ultimo:
                item = Item.objects.get(uuid=filtro.item.uuid)
                item.estoque_atual += filtro.quantidade
                if item.estoque_atual < 0:
                    item.estoque_atual = 0
                item.save()
                return super().destroy(request, *args, **kwargs)
            else:
                return Response({'msg': "item não é o último"}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(**docs_post['post'])
    def create(self, request, *args, **kwargs):
        quantidade = int(request.data.get('quantidade'))
        uuid_item = request.data.get('item')

        estoque_filtro = Item.objects.filter(uuid=uuid_item)
        usuario = self.request.user
        request.data['usuario'] = usuario.pk

        if estoque_filtro:
            estoque = estoque_filtro.get()
            estoque_atual = int(estoque.estoque_atual)
            if estoque_atual - quantidade < 0:
                return Response({"msg": "A quantidade retirada não pode ser maior que a presente no estoque atual"}, status=status.HTTP_400_BAD_REQUEST)
            if estoque_atual - quantidade >= 0:
                estoque.estoque_atual = estoque_atual - quantidade
                estoque.save(update_fields=['estoque_atual'])
            if quantidade == 0:
                return Response({"msg": "A quantidade tem que ser maior que zero"}, status=status.HTTP_400_BAD_REQUEST)
            return super().create(request, *args, **kwargs)
        return Response({"msg": "o item não está presente no estoque atual"}, status=status.HTTP_400_BAD_REQUEST)


class SaidasXLSViewSet(viewsets.ModelViewSet):
    queryset = Saida.objects.all()
    serializer_class = CRUDSaidaSerializer
    http_method_names = ['get']

    def get_queryset(self):
        queryset = self.queryset
        data_inicio = self.request.query_params.get('dt_ini')
        data_fim = self.request.query_params.get('dt_fim')

        if data_inicio and data_fim:
            queryset = queryset.filter(dt_saida__gte=data_inicio, dt_saida__lte=data_fim)
        queryset = queryset.filter(is_ultimo=True)

        return queryset

    def list(self, request, *args, **kwargs):
        usuario = self.request.user

        gerar_planilha(model=self.get_queryset(), dt_ini=self.request.query_params.get('dt_ini'), dt_fim=self.request.query_params.get('dt_fim'), tipo="Saídas", usuario=usuario)

        return Response({'msg': 'e-mail com planilha enviado com sucesso'})


class SaidaUpdateViewSet(viewsets.ModelViewSet):
    queryset = Saida.objects.all()
    serializer_class = CRUDSaidaSerializer
    http_method_names = ['post']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):
        filtro_saida = Saida.objects.filter(uuid=self.request.data.get('saida_pai'))
        if filtro_saida:
            filtro_saida = filtro_saida.get()
            if filtro_saida.is_ultimo is False:
                return Response({"msg": "Você não pode alterar essa saída"}, status=status.HTTP_400_BAD_REQUEST)

            campos = [field.name for field in Saida._meta.get_fields() if field.name != 'saida_pai' if
                      field.name != 'is_ultimo' if field.name != 'saida']

            filtro_saida.is_ultimo = False
            filtro_saida.save()

            self.request.data['saida_pai'] = filtro_saida.uuid

            quantidade = self.request.data.get('quantidade')
            if quantidade:
                item_busca = Item.objects.get(uuid=filtro_saida.item.uuid)
                item_busca.estoque_atual = item_busca.estoque_atual + filtro_saida.quantidade - quantidade
                item_busca.save()

            for campo in campos:
                if not self.request.data.get(f'{campo}'):
                    if campo == 'item':
                        uuid = filtro_saida.__getattribute__(campo).uuid
                        self.request.data[f'{campo}'] = uuid
                    elif campo == 'usuario':
                        uuid = filtro_saida.__getattribute__(campo).uuid
                        self.request.data[f'{campo}'] = uuid
                    else:
                        self.request.data[f'{campo}'] = filtro_saida.__getattribute__(campo)

            return super().create(request, *args, **kwargs)
        else:
            return Response({"msg": "Não existe essa saída"}, status=status.HTTP_400_BAD_REQUEST)




