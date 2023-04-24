import datetime
import uuid

from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ivh_inventario.core.utils.email import enviar_email_template, enviar_email_xls
from ivh_inventario.core.utils.organiza_documentacao import documentacao
from ivh_inventario.core.utils.relatorio_xls import gerar_planilha
from ivh_inventario.doador.models import Doador
from ivh_inventario.entrada.api.serializers import CRUDEntradaSerializer, POSTEntradaSerializer, \
    POSTEntradaSerializer_novo_item, GETEntradaSerializer
from ivh_inventario.entrada.models import Entrada
from ivh_inventario.estoque.models import Estoque
from ivh_inventario.item.models import Item


class CRUDEntradaViewSet(viewsets.ModelViewSet):
    queryset = Entrada.objects.all()
    serializer_class = CRUDEntradaSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    docs_list = documentacao(
        metodo='get',
        operation_summary='List de entradas',
        operation_description='API para listar todas as entradas',
        response200=CRUDEntradaSerializer

    )
    docs_read = documentacao(
        metodo='get',
        operation_summary='Read de entradas',
        operation_description='API para ler apenas uma entrada',
        response200=CRUDEntradaSerializer
    )
    docs_post = documentacao(
        metodo='post',
        operation_summary='Create de entradas',
        operation_description='Api para criar uma nova entrada',
        request_body=POSTEntradaSerializer,
        response201=POSTEntradaSerializer
    )

    docs_put = documentacao(
        metodo='put',
        operation_summary='Put de entradas',
        operation_description='Api para modificar uma entrada',
        response200=CRUDEntradaSerializer
    )

    docs_patch = documentacao(
        metodo='patch',
        operation_summary='Patch de entradas',
        operation_description='Api para modificar parcialmente uma entrada',
        response200=CRUDEntradaSerializer
    )

    docs_delete = documentacao(
        metodo='delete',
        operation_summary='Delete de entradas',
        operation_description='Api para deletar uma entrada',
        response200=CRUDEntradaSerializer
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

    @swagger_auto_schema(**docs_delete['delete'])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(**docs_patch['patch'])
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    @swagger_auto_schema(**docs_put['put'])
    def update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_list['get'])
    def list(self, request, *args, **kwargs):
        self.serializer_class = GETEntradaSerializer
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(**docs_read['get'])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(**docs_post['post'])
    def create(self, request, *args, **kwargs):
        request.data['dt_entrada'] = datetime.date.today()
        request.data['usuario'] = self.request.user.pk

        if request.data['is_novo_item'] is False:
            self.serializer_class = POSTEntradaSerializer
        else:
            self.serializer_class = POSTEntradaSerializer_novo_item
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = serializer.create()
        return Response(response, status=status.HTTP_201_CREATED)


class EntradasXLSViewSet(viewsets.ModelViewSet):
    queryset = Entrada.objects.all()
    serializer_class = CRUDEntradaSerializer
    http_method_names = ['get']

    def get_queryset(self):
        queryset = self.queryset
        data_inicio = self.request.query_params.get('dt_ini')
        data_fim = self.request.query_params.get('dt_fim')

        if data_inicio and data_fim:
            queryset = queryset.filter(dt_entrada__gte=data_inicio, dt_entrada__lte=data_fim)

        return queryset

    def list(self, request, *args, **kwargs):
        usuario = self.request.user

        gerar_planilha(model=self.get_queryset(), dt_ini=self.request.query_params.get('dt_ini'), dt_fim=self.request.query_params.get('dt_fim'), tipo="Entradas", usuario=usuario)

        return Response({'msg': 'e-mail com planilha enviado com sucesso'})
