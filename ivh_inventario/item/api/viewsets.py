from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ivh_inventario.core.utils.relatorio_xls import gerar_planilha
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
                if param == 'descricao':
                    filter_kwargs = {f'{param}__icontains': value}
                else:
                    filter_kwargs = {param: value}
                queryset = queryset.filter(**filter_kwargs)
        return queryset

    def create(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            return super().create(request, *args, **kwargs)
        return Response({"msg": "você precisa ser coodernador para utilizar essa funcionalidade"})

    def partial_update(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            return super().partial_update(request, *args, **kwargs)
        return Response({"msg": "você precisa ser coodernador para utilizar essa funcionalidade"})

    def update(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            return super().update(request, *args, **kwargs)
        return Response({"msg": "você precisa ser coodernador para utilizar essa funcionalidade"})

    def destroy(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            return super().destroy(request, *args, **kwargs)
        return Response({"msg": "você precisa ser coodernador para utilizar essa funcionalidade"})


class ItemGruposAPI(APIView):
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        return Response([grupo[0] for grupo in Item.GRUPO], status=status.HTTP_200_OK)


class ItemXLSViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    http_method_names = ['get']

    def get_queryset(self):
        queryset = self.queryset
        queryset = queryset.filter(estoque_atual__gte=0)
        return queryset

    def list(self, request, *args, **kwargs):
        usuario = self.request.user

        gerar_planilha(model=self.get_queryset(), tipo="estoque_atual", usuario=usuario)

        return Response({'msg': 'e-mail com planilha enviado com sucesso'})
