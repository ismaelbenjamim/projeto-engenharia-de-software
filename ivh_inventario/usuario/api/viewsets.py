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
from ivh_inventario.core.utils.organiza_documentacao import documentacao
from ivh_inventario.usuario.api.serializers import UsuarioLoginSerializer, UsuarioCadastroSerializer, \
    CRUDUsuarioSerializer, TrocarSenhaSerializer, EsqueceuSenhaSerializer, RedefinicaoSenhaSerializer, \
    CRUDNotificacaoSerializer
from ivh_inventario.usuario.models import Usuario, Notificacao


class UsuarioLoginViewSet(ObtainAuthToken):
    serializer_class = UsuarioLoginSerializer
    usuario = None

    docs = documentacao(
        metodo='post',
        operation_summary='Login de usuário',
        operation_description='Autenticação de usuários',
        request_body=UsuarioLoginSerializer,
        response201=UsuarioLoginSerializer

    )

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
    http_method_names = ['get', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    docs_list = documentacao(
        metodo='get',
        operation_summary='List de usuário',
        operation_description='API para listar os usuários',
        response200=CRUDUsuarioSerializer
    )
    docs_read = documentacao(
        metodo='get',
        operation_summary='Read de usuário',
        operation_description='API para buscar usuário específico',
        response200=CRUDUsuarioSerializer
    )

    docs_put = documentacao(
        metodo='put',
        operation_summary='Put de usuário',
        operation_description='API para modificar um usuário',
        response200=CRUDUsuarioSerializer
    )
    docs_patch = documentacao(
        metodo='patch',
        operation_summary='Patch de usuário',
        operation_description='API para modificar parcialmente um usuário',
        response200=CRUDUsuarioSerializer
    )
    docs_delete = documentacao(
        metodo='delete',
        operation_summary='Delete de usuário',
        operation_description='API para deletar um usuário',
        response200=CRUDUsuarioSerializer
    )

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params
        for campo in self.request.query_params:
            try:
                valor = params.get(f'{campo}')
                queryset = queryset.filter(**{campo: valor})
            except:
                pass

        return queryset

    @swagger_auto_schema(**docs_list['get'])
    def list(self, request, *args, **kwargs):
        if not self.request.user.is_superuser:
            usuario = Usuario.objects.get(pk=self.request.user.pk)
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)
        else:
            return super().list(request, *args, **kwargs)

    @swagger_auto_schema(**docs_read['get'])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(**docs_put['put'])
    def update(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # forcibly invalidate the prefetch cache on the instance.
                instance._prefetched_objects_cache = {}
            response = serializer.data
            del response['password']
            return Response(response)
        else:
            return Response({'msg': 'Usuário precisa ser coordenador para utilizar funcionalidade'})

    @swagger_auto_schema(**docs_patch['patch'])
    def partial_update(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            kwargs['partial'] = True
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # forcibly invalidate the prefetch cache on the instance.
                instance._prefetched_objects_cache = {}
            response = serializer.data
            del response['password']
            return Response(response)
        else:
            return Response({'msg': 'Usuário precisa ser coordenador para utilizar funcionalidade'})

    @swagger_auto_schema(**docs_delete['delete'])
    def destroy(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            return super().destroy(request, *args, **kwargs)
        else:
            return Response({'msg': 'Usuário precisa ser coordenador para utilizar funcionalidade'})

class UsuarioCadastroViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioCadastroSerializer
    http_method_names = ['post']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    docs = documentacao(
        metodo='post',
        operation_summary='Cadastro de usuário',
        operation_description='API para o cadastro de usuário',
        request_body=UsuarioCadastroSerializer,
        response200=UsuarioCadastroSerializer,

    )

    @swagger_auto_schema(**docs['post'])
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

    docs = documentacao(
        metodo='post',
        operation_summary='Trocar a senha',
        operation_description='API para trocar a senha do usuário',
        request_body=TrocarSenhaSerializer,
        response201=TrocarSenhaSerializer
    )

    @swagger_auto_schema(**docs['post'])
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

    docs = documentacao(
        metodo='post',
        operation_summary='Esqueceu a senha',
        operation_description='Api para quando o usuário esquecer a senha ',
        request_body=EsqueceuSenhaSerializer,
        response200=EsqueceuSenhaSerializer.Response()
    )

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

    docs = documentacao(
        metodo='post',
        operation_summary='Redefinir a senha',
        operation_description='API para redefinir a senha do usuário',
        request_body=RedefinicaoSenhaSerializer,
        response200=EsqueceuSenhaSerializer.Response()
    )

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


class UsuarioNotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.all()
    serializer_class = CRUDNotificacaoSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    docs_list = documentacao(
        metodo='get',
        operation_summary='List de notificação',
        operation_description='API para listar notifições',
        response200=CRUDNotificacaoSerializer
    )
    docs_read = documentacao(
        metodo='get',
        operation_summary='Read de notificação',
        operation_description='API para buscar notificação específica',
        response200=CRUDNotificacaoSerializer
    )
    docs_post = documentacao(
        metodo='post',
        operation_summary='Create de notificação',
        operation_description='API para adicionar uma nova notificação',
        request_body=CRUDNotificacaoSerializer,
        response200=CRUDNotificacaoSerializer
    )
    docs_put = documentacao(
        metodo='put',
        operation_summary='Put de notificação',
        operation_description='API para modificar uma notificação',
        response200=CRUDNotificacaoSerializer
    )
    docs_patch = documentacao(
        metodo='patch',
        operation_summary='Patch de notificação',
        operation_description='API para modificar parcialmente uma notificação',
        response200=CRUDNotificacaoSerializer
    )
    docs_delete = documentacao(
        metodo='delete',
        operation_summary='Delete de notificação',
        operation_description='API para deletar uma notificação',
        response200=CRUDNotificacaoSerializer
    )

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        for campo in self.request.query_params:
            try:
                valor = params.get(f'{campo}')
                queryset = queryset.filter(**{campo: valor})
            except:
                pass

        return queryset

    @swagger_auto_schema(**docs_list['get'])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(**docs_read['get'])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(**docs_post['post'])
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(**docs_patch['patch'])
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_put['put'])
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(**docs_delete['delete'])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)






