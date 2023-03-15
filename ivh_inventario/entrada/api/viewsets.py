import datetime
import uuid

from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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

    @swagger_auto_schema(request_body=POSTEntradaSerializer)
    def create(self, request, *args, **kwargs):
        request.data['dt_entrada'] = datetime.date.today()
        request.data['usuario'] = self.request.user.pk

        self.serializer_class = POSTEntradaSerializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = serializer.create()
        return Response(response, status=status.HTTP_201_CREATED)
