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
    def gerar_token_super(self):
        usuario = Usuario(
            username='usuario_teste',
            is_superuser=True
        )
        usuario.save()
        Token.objects.get_or_create(user=usuario)
        token_user = Token.objects.get(user=usuario)
        return str(token_user)

    def test_get_estoque_sem_parametros(self, client):
        token = self.gerar_token()

        response = client.get(
            path=f'{SITE_DOMINIO}/api/estoques/estoque/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200

    def test_get_estoque_com_parametros(self, client):
        token = self.gerar_token()
        parametro = 'estoque_atual'
        valor = '1'
        response = client.get(
            path=f'{SITE_DOMINIO}/api/estoques/estoque/?{parametro}={valor}',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200


    def test_post_estoque_super_user(self, client):
        token = self.gerar_token_super()

        item = Item.objects.create(
            is_bem_de_consumo=True,
            grupo="limpeza",
            cod="UM",
            descricao="TESTE",
        )
        item.save()

        response = client.post(
            path=f'{SITE_DOMINIO}/api/estoques/estoque/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                "estoque_atual": 1,
                "item": item.uuid
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 201

    def test_post_estoque_user(self, client):
        token = self.gerar_token()

        item = Item.objects.create(
            is_bem_de_consumo=True,
            grupo="limpeza",
            cod="UM",
            descricao="TESTE",
        )
        item.save()

        response = client.post(
            path=f'{SITE_DOMINIO}/api/estoques/estoque/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                "estoque_atual": 1,
                "item": item.uuid
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200

    def test_put_estoque_user(self, client):
        token = self.gerar_token_super()


        item = Item.objects.create(
            is_bem_de_consumo=True,
            grupo="limpeza",
            cod="UM",
            descricao="TESTE",
        )

        estoque = Estoque.objects.create(
            estoque_atual=1,
            item=item
        )
        item.save()

        response = client.put(
            path=f'{SITE_DOMINIO}/api/estoques/estoque/{estoque.uuid}/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                "estoque_atual": 2,
                "item": item.uuid
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200





