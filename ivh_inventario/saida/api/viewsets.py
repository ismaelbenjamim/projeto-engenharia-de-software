from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from ivh_inventario.saida.api.serializers import CRUDSaidaSerializer
from ivh_inventario.saida.models import Saida


class CRUDSaidaViewSet(viewsets.ModelViewSet):
    queryset = Saida.objects.all()
    serializer_class = CRUDSaidaSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
