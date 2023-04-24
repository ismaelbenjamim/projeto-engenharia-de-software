
import pytest

from ivh_inventario.estoque.models import Estoque
from ivh_inventario.item.models import Item
from ivh_inventario.settings import SITE_DOMINIO
from ivh_inventario.usuario.models import Usuario
from rest_framework.authtoken.models import Token



@pytest.mark.django_db
class TestesEntrada:
    def gerar_token(self):
        usuario = Usuario(
            username='usuario_teste'
        )
        usuario.save()
        Token.objects.get_or_create(user=usuario)
        token_user = Token.objects.get(user=usuario)
        return str(token_user)

    def test_get_saida_sem_parametros(self, client):
        token = self.gerar_token()

        response = client.get(
            path=f'{SITE_DOMINIO}/api/saidas/saida/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200

    def test_get_saida_com_parametros(self, client):
        token = self.gerar_token()
        parametro = 'fornecedor'
        valor = 'teste'
        response = client.get(
            path=f'{SITE_DOMINIO}/api/saidas/saida/?{parametro}={valor}',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200

    def test_post_saida(self, client):
        token = self.gerar_token()



        item = Item.objects.create(
            is_bem_de_consumo=True,
            grupo="limpeza",
            cod="UM",
            descricao="TESTE",
        )
        item.save()

        estoque = Estoque.objects.create(
            estoque_atual=1,
            item=item
        )
        estoque.save()

        response = client.post(
            path=f'{SITE_DOMINIO}/api/saidas/saida/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                "quantidade": 1,
                "item": item.uuid,
                "erro_saida": False,
                "descricao": "teste",
                "is_ultimo": True,
                "saida_pai": None,
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 201

    def test_post_saida_fracasso(self, client):
        token = self.gerar_token()



        item = Item.objects.create(
            is_bem_de_consumo=True,
            grupo="limpeza",
            cod="UM",
            descricao="TESTE",
        )
        item.save()

        estoque = Estoque.objects.create(
            estoque_atual=1,
            item=item
        )
        estoque.save()

        response = client.post(
            path=f'{SITE_DOMINIO}/api/saidas/saida/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                "quantidade": 10,
                "item": item.uuid,
                "erro_saida": False,
                "descricao": "teste",
                "is_ultimo": True,
                "saida_pai": None,
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 400


    def test_get_saida_xls(self, client):
        token = self.gerar_token()

        response = client.get(
            path=f'{SITE_DOMINIO}/api/saidas/saida-xls/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200
