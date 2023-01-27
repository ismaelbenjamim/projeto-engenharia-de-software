from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from ivh_inventario.usuario.models import Usuario


class UsuarioLoginSerializer(serializers.Serializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:

            username = get_object_or_404(Usuario, username=username)

            user = authenticate(username=username, password=password)

            if user:
                if not user.is_active:
                    msg = 'User account is disabled.'
                    raise serializers.ValidationError(msg)
            else:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg)
        else:
            msg = 'Must include "email or username" and "password"'
            raise serializers.ValidationError(msg)

        attrs['user'] = user
        return attrs

    username = serializers.CharField()
    password = serializers.CharField()


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
