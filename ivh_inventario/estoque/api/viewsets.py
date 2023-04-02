from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from ivh_inventario.core.utils.organiza_documentacao import documentacao
from ivh_inventario.estoque.api.serializers import CRUDEstoqueSerializer
from ivh_inventario.estoque.models import Estoque
from ivh_inventario.item.models import Item


class CRUDEstoqueViewSet(viewsets.ModelViewSet):
    queryset = Estoque.objects.all()
    serializer_class = CRUDEstoqueSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    docs_list = documentacao(
        metodo='get',
        operation_summary='List de estoque',
        operation_description='API para listar o estoque',
        query_serializer=CRUDEstoqueSerializer.EstoqueParams,
        response200=CRUDEstoqueSerializer.EstoqueGet
    )
    docs_read = documentacao(
        metodo='get',
        operation_summary='Read de estoque',
        operation_description='API para buscar um item no estoque específico',
        response200=CRUDEstoqueSerializer.EstoqueGet
    )
    docs_post = documentacao(
        metodo='post',
        operation_summary='Create de estoque',
        operation_description='API para adicionar um novo item ao estoque',
        request_body=CRUDEstoqueSerializer,
        response200=CRUDEstoqueSerializer
    )
    docs_put = documentacao(
        metodo='put',
        operation_summary='Put de estoque',
        operation_description='API para modificar um objeto do estoque',
        response200=CRUDEstoqueSerializer
    )
    docs_patch = documentacao(
        metodo='patch',
        operation_summary='Patch de estoque',
        operation_description='API para modificcar parcialmente um objeto do estoque',
        response200=CRUDEstoqueSerializer
    )
    docs_delete = documentacao(
        metodo='delete',
        operation_summary='Delete de estoque',
        operation_description='API para deletar um objeo no estoque',
        response200=CRUDEstoqueSerializer
    )


    def get_queryset(self):
        queryset = super().get_queryset()

        is_doacao = self.request.query_params.get('is_doacao')
        is_bem_de_consumo = self.request.query_params.get('is_bem_de_consumo')
        grupo = self.request.query_params.get('grupo')


        if is_doacao:
            queryset = queryset.filter(item__is_doacao=is_doacao)
        if is_bem_de_consumo:
            queryset = queryset.filter(item__is_bem_de_consumo=is_bem_de_consumo)
        if grupo:
            queryset = queryset.filter(item__grupo=grupo)

        return queryset

    @swagger_auto_schema(**docs_list['get'])
    def list(self, request, *args, **kwargs):
        self.serializer_class = self.serializer_class.EstoqueGet
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(**docs_read['get'])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(**docs_post['post'])
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(**docs_put['put'])
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_patch['patch'])
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_delete['delete'])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)



