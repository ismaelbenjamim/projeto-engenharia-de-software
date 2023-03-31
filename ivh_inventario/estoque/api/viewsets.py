from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from ivh_inventario.estoque.api.serializers import CRUDEstoqueSerializer
from ivh_inventario.estoque.models import Estoque
from ivh_inventario.item.models import Item


class CRUDEstoqueViewSet(viewsets.ModelViewSet):
    queryset = Estoque.objects.all()
    serializer_class = CRUDEstoqueSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

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
    
    def list(self, request, *args, **kwargs):
        self.serializer_class = self.serializer_class.EstoqueGet
        return super().list(request, *args, **kwargs)


