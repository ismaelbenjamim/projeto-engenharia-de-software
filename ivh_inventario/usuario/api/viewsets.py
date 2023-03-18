from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ivh_inventario.core.utils.email import enviar_email_template
from ivh_inventario.core.utils.gerador_codigo import geracao_codigo
from ivh_inventario.usuario.api.serializers import UsuarioLoginSerializer, UsuarioCadastroSerializer, \
    CRUDUsuarioSerializer, TrocarSenhaSerializer, EsqueceuSenhaSerializer, RedefinicaoSenhaSerializer
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

    @swagger_auto_schema(**docs['post'])
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.usuario = serializer.validated_data['user']
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

    def list(self, request, *args, **kwargs):
        if not self.request.user.is_superuser:
            usuario = Usuario.objects.get(pk=self.request.user.pk)
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)
        else:
            return super().list(request, *args, **kwargs)

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


class TrocarSenhaViewSet(APIView):
    http_method_names = ['post']
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=TrocarSenhaSerializer)
    def post(self, request):
        serializer = TrocarSenhaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = self.request.user
        validar_senha = usuario.check_password(serializer.data['senha_antiga'])

        if validar_senha:
            usuario.set_password(serializer.data['senha_nova'])
            usuario.save()

            return Response({'mensagem': "Senha alterada com sucesso!"}, status=status.HTTP_200_OK)
        else:
            return Response({'mensagem': "A senha antiga está incorreta!"}, status=status.HTTP_400_BAD_REQUEST)


class EsqueceuSenhaViewSet(APIView):
    http_method_names = ['post']

    docs = {
        "post": {
            "operation_summary": "Esqueceu a senha",
            "operation_description": "Esquecimento de senha de usuário",
            "request_body": EsqueceuSenhaSerializer,
            "responses": {
                "200": EsqueceuSenhaSerializer.Response()
            }
        }
    }

    @swagger_auto_schema(**docs['post'])
    def post(self, request):
        serializer = EsqueceuSenhaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.validated_data['username']
        if usuario:
            enviar_email_template(
                usuario=usuario,
                titulo="[IVH Inventario] Redefinição de senha",
                html="esqueci_senha",
                dados={
                    "usuario": usuario,
                    "codigo": usuario.cod_redefinicao
                }
            )
            return Response({'mensagem': "E-mail de redefinição de senha enviado"}, status=status.HTTP_200_OK)
        else:
            Response({'mensagem': "Usuário com este username não encontrado"}, status=status.HTTP_400_BAD_REQUEST)


class RedefinirSenhaViewSet(APIView):
    http_method_names = ['post']

    docs = {
        "post": {
            "operation_summary": "Redefinir a senha",
            "operation_description": "Redefinição de senha de usuário",
            "request_body": RedefinicaoSenhaSerializer,
            "responses": {
                "200": EsqueceuSenhaSerializer.Response()
            }
        }
    }

    @swagger_auto_schema(**docs['post'])
    def post(self, request):
        serializer = RedefinicaoSenhaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = serializer.validated_data['username']
        if serializer.data['codigo'] == usuario.cod_redefinicao:
            usuario.set_password(serializer.data['senha_nova'])
            usuario.cod_redefinicao = geracao_codigo()
            usuario.save()
            return Response({'mensagem': "Senha alterada com sucesso!"}, status=status.HTTP_200_OK)
        else:
            return Response({'mensagem': "O código de redefinição está incorreta!"}, status=status.HTTP_400_BAD_REQUEST)

