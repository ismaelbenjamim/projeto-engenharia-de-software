from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from ivh_inventario.item.api.serializers import ItemSerializer
from ivh_inventario.item.models import Item


class CRUDItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        queryset = super().get_queryset()
        for param, value in self.request.query_params.items():
            if hasattr(Item, param):
                filter_kwargs = {param: value}
                queryset = queryset.filter(**filter_kwargs)
        return queryset


