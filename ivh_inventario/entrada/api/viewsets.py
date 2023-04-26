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
    POSTEntradaSerializer_novo_item, GETEntradaSerializer, EntradaUpdateSerializer
from ivh_inventario.entrada.models import Entrada
from ivh_inventario.item.models import Item


'''
Viewsets relacionadas ao app de entrada
'''


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
        response200=GETEntradaSerializer

    )
    docs_read = documentacao(
        metodo='get',
        operation_summary='Read de entradas',
        operation_description='API para ler apenas uma entrada',
        response200=GETEntradaSerializer
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
        self.serializer_class = GETEntradaSerializer
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(**docs_post['post'])
    def create(self, request, *args, **kwargs):
        request.data['usuario'] = self.request.user.pk

        if request.data.get('is_novo_item') is False:
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

        queryset = queryset.filter(is_ultimo=True)

        return queryset

    def list(self, request, *args, **kwargs):
        usuario = self.request.user

        gerar_planilha(model=self.get_queryset(), dt_ini=self.request.query_params.get('dt_ini'), dt_fim=self.request.query_params.get('dt_fim'), tipo="Entradas", usuario=usuario)

        return Response({'msg': 'e-mail com planilha enviado com sucesso'})


class EntradaUpdateViewSet(viewsets.ModelViewSet):
    queryset = Entrada.objects.all()
    serializer_class = EntradaUpdateSerializer
    http_method_names = ['post']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):
        filtro_saida = Entrada.objects.filter(uuid=self.request.data.get('entrada_pai'))
        if filtro_saida:
            filtro_saida = filtro_saida.get()
            if filtro_saida.is_ultimo is False:
                return Response({"msg": "Você não pode alterar essa entrada"}, status=status.HTTP_400_BAD_REQUEST)

            campos = [field.name for field in Entrada._meta.get_fields() if field.name != 'entrada_pai' if
                      field.name != 'is_ultimo' if field.name != 'entrada']

            filtro_saida.is_ultimo = False
            filtro_saida.save()

            self.request.data['entrada_pai'] = filtro_saida.uuid

            for campo in campos:
                if not self.request.data.get(f'{campo}'):
                    if campo == 'item':
                        uuid = filtro_saida.__getattribute__(campo).uuid
                        self.request.data[f'{campo}'] = uuid
                    elif campo == 'usuario':
                        uuid = filtro_saida.__getattribute__(campo).uuid
                        self.request.data[f'{campo}'] = uuid
                    elif campo == 'doc_fisc':
                        doc_fisc = filtro_saida.__getattribute__(campo)
                        if doc_fisc:
                            self.request.data[f'{campo}'] = filtro_saida.__getattribute__(campo)
                    elif campo == 'doador':
                        if filtro_saida.doador:
                            uuid = filtro_saida.__getattribute__(campo).uuid
                            self.request.data[f'{campo}'] = uuid
                    else:
                        self.request.data[f'{campo}'] = filtro_saida.__getattribute__(campo)

            return super().create(request, *args, **kwargs)
        else:
            return Response({"msg": "Não existe essa entrada"}, status=status.HTTP_400_BAD_REQUEST)

