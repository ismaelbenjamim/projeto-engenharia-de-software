import json

import pytest

from ivh_inventario.settings import SITE_DOMINIO
from ivh_inventario.usuario.models import Usuario
from rest_framework.authtoken.models import Token


@pytest.mark.django_db
class TestesEntrada:
    def gerar_token_super(self):
        usuario = Usuario(
            username='usuario_teste',
            is_superuser=True
        )
        usuario.save()
        Token.objects.get_or_create(user=usuario)
        token_user = Token.objects.get(user=usuario)
        return str(token_user)

    def test_get_usuario_sem_parametros(self, client):
        token = self.gerar_token_super()

        response = client.get(
            path=f'{SITE_DOMINIO}/api/usuarios/usuario/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200

    def test_cadastro_usuario_super(self, client):
        token = self.gerar_token_super()
        response = client.post(
            path=f'{SITE_DOMINIO}/api/usuarios/cadastro/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                'username': 'teste',
                'email': 'teste@teste.com',
                'password': 'teste',
                'cargo': 'coordenador'
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 201

    def test_cadastro_usuario(self, client):
        response = client.post(
            path=f'{SITE_DOMINIO}/api/usuarios/cadastro/',
            content_type="application/json",
            data={
                'username': 'teste',
                'email': 'teste@teste.com',
                'password': 'teste',
                'cargo': 'coordenador'
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 401
