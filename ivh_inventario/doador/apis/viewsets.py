from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from ivh_inventario.doador.apis.serializers import CRUDDoadorSerializer
from ivh_inventario.doador.models import Doador

'''
    Criacao das viewsets do model de Doador
    '''


class CRUDDoadorViewSet(viewsets.ModelViewSet):
    queryset = Doador.objects.all()
    serializer_class = CRUDDoadorSerializer
    http_method_names = ['post', 'get', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
