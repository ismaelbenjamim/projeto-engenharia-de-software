from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.fields import empty
from rest_framework.generics import get_object_or_404

from ivh_inventario.usuario.models import Usuario


class UsuarioLoginSerializer(AuthTokenSerializer):
    pass


class UsuarioCadastroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'uuid',
            'username',
            'email',
            'password',
            'cargo'
        ]


class CRUDUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'


class TrocarSenhaSerializer(serializers.Serializer):
    senha_nova = serializers.CharField(required=True)
    senha_antiga = serializers.CharField(required=True)


class EsqueceuSenhaSerializer(serializers.Serializer):
    username = serializers.SlugRelatedField(required=True, queryset=Usuario.objects.all(), slug_field="username")

    class Response(serializers.Serializer):
        mensagem = serializers.CharField()


class RedefinicaoSenhaSerializer(serializers.Serializer):
    username = serializers.SlugRelatedField(required=True, queryset=Usuario.objects.all(), slug_field="username")
    senha_nova = serializers.CharField(required=True)
    codigo = serializers.CharField(required=True)
