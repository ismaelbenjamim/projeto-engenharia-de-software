import datetime
import uuid

from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ivh_inventario.core.utils.organiza_documentacao import documentacao
from ivh_inventario.doador.models import Doador
from ivh_inventario.entrada.api.serializers import CRUDEntradaSerializer, POSTEntradaSerializer
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
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(**docs_read['get'])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(**docs_post['post'])
    def create(self, request, *args, **kwargs):
        request.data['dt_entrada'] = datetime.date.today()
        request.data['usuario'] = self.request.user.pk

        self.serializer_class = POSTEntradaSerializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = serializer.create()
        return Response(response, status=status.HTTP_201_CREATED)
