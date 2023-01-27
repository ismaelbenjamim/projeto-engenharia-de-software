import datetime

from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ivh_inventario.estoque.models import Estoque
from ivh_inventario.saida.api.serializers import CRUDSaidaSerializer
from ivh_inventario.saida.models import Saida


class CRUDSaidaViewSet(viewsets.ModelViewSet):
    queryset = Saida.objects.all()
    serializer_class = CRUDSaidaSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):
        quantidade = int(request.data.get('quantidade'))
        uuid_item = request.data.get('item')

        estoque_filtro = Estoque.objects.filter(item=uuid_item)
        usuario = self.request.user
        request.data['usuario'] = usuario.pk
        request.data['dt_saida'] = datetime.date.today()

        if estoque_filtro:
            estoque = estoque_filtro.get()
            estoque_atual = int(estoque.estoque_atual)
            if estoque_atual - quantidade == 0:
                estoque.delete()
            if estoque_atual - quantidade < 0:
                return Response({"msg": "A quantidade retirada não pode ser maior que a presente no estoque atual"}, status=status.HTTP_400_BAD_REQUEST)
            if estoque_atual - quantidade > 0:
                estoque.estoque_atual = estoque_atual - quantidade
                estoque.save(update_fields=['estoque_atual'])
            if quantidade == 0:
                return Response({"msg": "A quantidade tem que ser maior que zero"}, status=status.HTTP_400_BAD_REQUEST)
            return super().create(request, *args, **kwargs)
        return Response({"msg": "o item não está mais presente no estoque atual"}, status=status.HTTP_400_BAD_REQUEST)
