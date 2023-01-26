from django.contrib.auth.hashers import make_password
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ivh_inventario.usuario.api.serializers import UsuarioLoginSerializer, UsuarioCadastroSerializer, \
    CRUDUsuarioSerializer
from ivh_inventario.usuario.models import Usuario


class UsuarioLoginViewSet(ObtainAuthToken):
    serializer_class = UsuarioLoginSerializer
    usuario = None

    docs = {
        "post": {
            "operation_summary": "Login de usuário",
            "operation_description": "Autenticação de usuários",
            "request_body": UsuarioLoginSerializer
        }
    }

    def get_token(self):
        if not self.usuario.is_superuser:
            token = Token.objects.filter(user=self.usuario)
            if token:
                token.delete()
        token, created = Token.objects.get_or_create(user=self.usuario)
        return token

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.usuario = serializer.validated_data['user']
        print(self.usuario.username)
        response = {
            'uuid': self.usuario.pk,
            'username': self.usuario.username,
            'token': self.get_token().key,

        }

        return Response(response)


class CRUDUsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = CRUDUsuarioSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]


class UsuarioCadastroViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioCadastroSerializer
    http_method_names = ['post']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]


    def create(self, request, *args, **kwargs):
        self.serializer_class = UsuarioCadastroSerializer
        usuario_logado = self.request.user
        if usuario_logado.is_superuser:
            senha = self.request.data.get('password')

            if senha:
                request.data['password'] = make_password(senha)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            if serializer.data['cargo'] == 'coordenador':
                usuario = Usuario.objects.get(uuid=serializer.data['uuid'])
                usuario.is_superuser = True
                usuario.save(update_fields=["is_superuser"])
            response = serializer.data
            del response['password']
            return Response(response, status=status.HTTP_201_CREATED, headers=headers)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)





