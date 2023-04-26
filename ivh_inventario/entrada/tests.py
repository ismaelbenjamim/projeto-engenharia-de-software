
import pytest

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

    def test_get_entradas_sem_parametros(self, client):
        token = self.gerar_token()

        response = client.get(
            path=f'{SITE_DOMINIO}/api/entradas/entrada/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200

    def test_get_entradas_com_parametros(self, client):
        token = self.gerar_token()
        parametro = 'fornecedor'
        valor = 'teste'
        response = client.get(
            path=f'{SITE_DOMINIO}/api/entradas/entrada/?{parametro}={valor}',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200

    def test_post_entradas_is_novo_item_true(self, client):
        token = self.gerar_token()

        response = client.post(
            path=f'{SITE_DOMINIO}/api/entradas/entrada/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                "is_novo_item": True,
                "quantidade": 1,
                "item": {
                    "is_bem_de_consumo": True,
                    "grupo": "limpeza",
                    "cod": "UM",
                    "descricao": "produto teste"
                },
                "is_doacao": True,
                "validade": "2023-04-23",
                "val_unit": "1",
                "val_total": "1",
                "fornecedor": "teste",
                "tipo_unit": "teste",
                "doador": {
                    "nome": "teste",
                    "cnpj_cpf": "11111111111",
                }
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 201

    def test_post_entradas_is_novo_item_false(self, client):
        token = self.gerar_token()

        item = Item.objects.create(
            is_bem_de_consumo=True,
            grupo="limpeza",
            cod="UM",
            descricao="TESTE",
        )
        item.save()

        response = client.post(
            path=f'{SITE_DOMINIO}/api/entradas/entrada/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                "is_novo_item": False,
                "quantidade": 1,
                "item": item.uuid,
                "is_doacao": True,
                "validade": "2023-04-23",
                "val_unit": "1",
                "val_total": "1",
                "fornecedor": "teste",
                "tipo_unit": "teste",
                "doador": {
                    "nome": "teste",
                    "cnpj_cpf": "11111111111"
                }
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 201

    def test_get_xls(self, client):
        token = self.gerar_token()

        response = client.get(
            path=f'{SITE_DOMINIO}/api/entradas/entrada-xls/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}'
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 200


    def test_post_entradas_fracasso(self, client):
        token = self.gerar_token()

        item = Item.objects.create(
            is_bem_de_consumo=True,
            grupo="limpeza",
            cod="UM",
            descricao="TESTE",
        )
        item.save()

        response = client.post(
            path=f'{SITE_DOMINIO}/api/entradas/entrada/',
            content_type="application/json",
            HTTP_AUTHORIZATION=f'Token {token}',
            data={
                "is_novo_item": True,
                "quantidade": 1,
                "item": item.uuid,
                "is_doacao": True,
                "validade": "2023-04-23",
                "val_unit": "1",
                "val_total": "1",
                "fornecedor": "teste",
                "tipo_unit": "teste",
                "doador": {
                    "nome": "teste",
                    "cnpj_cpf": "11111111111",
                }
            }
        )

        print('\n' + str(response.status_code))
        print(response.json())
        assert response.status_code == 400












