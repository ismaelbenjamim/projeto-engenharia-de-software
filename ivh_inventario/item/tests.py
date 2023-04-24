import pytest
from rest_framework.authtoken.models import Token

from ivh_inventario.settings import SITE_DOMINIO
from ivh_inventario.usuario.models import Usuario


@pytest.mark.django_db
class TestesEntrada:
    def gerar_token(self):
        usuario = Usuario(
            username='usuario_teste',
        )
        usuario.save()
        Token.objects.get_or_create(user=usuario)
        token_user = Token.objects.get(user=usuario)
        return str(token_user)

    def test_get_item_sem_parametros(self, client):
        token = self.gerar_token()

        response = client.get(
            path=f'{SITE_DOMINIO}/api/itens/item/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200

    def test_get_item_com_parametros(self, client):
        token = self.gerar_token()
        parametro = 'fornecedor'
        valor = 'teste'
        response = client.get(
            path=f'{SITE_DOMINIO}/api/itens/item/?{parametro}={valor}',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200