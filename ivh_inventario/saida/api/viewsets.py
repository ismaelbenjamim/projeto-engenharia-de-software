import datetime

from django.db.models import Q
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ivh_inventario.core.utils.organiza_documentacao import documentacao
from ivh_inventario.core.utils.relatorio_xls import gerar_planilha
from ivh_inventario.estoque.models import Estoque
from ivh_inventario.saida.api.serializers import CRUDSaidaSerializer
from ivh_inventario.saida.models import Saida


class CRUDSaidaViewSet(viewsets.ModelViewSet):
    queryset = Saida.objects.all()
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
                queryset = queryset.none()

        return queryset

    @swagger_auto_schema(**docs_list['get'])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(**docs_read['get'])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(**docs_patch['patch'])
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_list['get'])
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_delete['delete'])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(**docs_post['post'])
    def create(self, request, *args, **kwargs):
        quantidade = int(request.data.get('quantidade'))
        uuid_item = request.data.get('item')

        estoque_filtro = Estoque.objects.filter(item=uuid_item)
        usuario = self.request.user
        request.data['usuario'] = usuario.pk
        request.data['dt_saida'] = datetime.date.today()

        if estoque_filtro:
            estoque = estoque_filtro.get()
            estoque_atual = int(estoque.estoque_atual)
            if estoque_atual - quantidade == 0:
                estoque.delete()
            if estoque_atual - quantidade < 0:
                return Response({"msg": "A quantidade retirada não pode ser maior que a presente no estoque atual"}, status=status.HTTP_400_BAD_REQUEST)
            if estoque_atual - quantidade > 0:
                estoque.estoque_atual = estoque_atual - quantidade
                estoque.save(update_fields=['estoque_atual'])
            if quantidade == 0:
                return Response({"msg": "A quantidade tem que ser maior que zero"}, status=status.HTTP_400_BAD_REQUEST)
            return super().create(request, *args, **kwargs)
        return Response({"msg": "o item não está mais presente no estoque atual"}, status=status.HTTP_400_BAD_REQUEST)


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

        return queryset

    def list(self, request, *args, **kwargs):
        usuario = self.request.user

        gerar_planilha(model=self.get_queryset(), dt_ini=self.request.query_params.get('dt_ini'), dt_fim=self.request.query_params.get('dt_fim'), tipo="Saídas", usuario=usuario)

        return Response({'msg': 'e-mail com planilha enviado com sucesso'})