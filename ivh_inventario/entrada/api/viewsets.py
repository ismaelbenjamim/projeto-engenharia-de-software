import datetime
import uuid

from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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

    def create(self, request, *args, **kwargs):
        self.serializer_class = POSTEntradaSerializer

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item = Item(
            is_doacao=request.data.get('is_doacao'),
            descricao=request.data.get('descricao'),
            is_bem_de_consumo=request.data.get('is_bem_de_consumo'),
            grupo=request.data.get('grupo'),
            cod=request.data.get('cod'),
            doc_fisc=request.data.get('doc_fisc'),
            validade=request.data.get('validade'),
            val_unit=request.data.get('val_unit'),
            val_total=request.data.get('val_total'),
            fornecedor=request.data.get('fornecedor'),
            tipo_unit=request.data.get('tipo_unit')
        )
        item.save()

        request.data['item'] = item.pk
        request.data['dt_entrada'] = datetime.date.today()
        request.data['usuario'] = self.request.user.pk
        entrada = Entrada(
            item=item,
            dt_entrada=request.data.get('dt_entrada'),
            usuario=self.request.user,
            quantidade=request.data.get('quantidade')
        )
        entrada.save()
        estoque = Estoque(
            estoque_atual=request.data.get('quantidade'),
            item=item
        )
        estoque.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

