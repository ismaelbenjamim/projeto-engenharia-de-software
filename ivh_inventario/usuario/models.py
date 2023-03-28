from uuid import uuid4

from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

from ivh_inventario.core.utils.gerador_codigo import geracao_codigo


class Usuario(AbstractUser):
    CARGO = (
        ("coordenador", "coordenador"),
        ("auxiliar financeiro", "auxiliar financeiro"),
        ("auxiliar administrativo", "auxiliar administrativo"),
        ("colaborador", "colaborador")
    )

    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    email = models.EmailField('Email', unique=False)
    cargo = models.CharField(max_length=100, choices=CARGO)
    cod_redefinicao = models.CharField("Código de redefinição de senha", max_length=10, default=geracao_codigo)


class Notificacao(models.Model):
    TIPO_NOTIFICACAO = (
        ('ADMINS', 'Administradores'),
        ('USUARIOS', 'Usuários'),
        ('TODOS', 'Todos'),
        ('PRIVADA', 'Privada')
    )
    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    tipo_notificacao = models.CharField('Tipo de notificação',
                                        choices=TIPO_NOTIFICACAO, max_length=50, default='USUARIOS')
    titulo = models.CharField('Título', max_length=200)
    descricao = models.TextField('Descrição', null=True, blank=True)
    destino = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True, blank=True)

    def full_clean(self, exclude=None, validate_unique=True):
        super().full_clean(exclude=None, validate_unique=True)
        if self.tipo_notificacao != "PRIVADA" and self.destino:
            raise ValidationError({
                'destino': 'Não é possível adicionar destino se o tipo_notificacao não for privada'
            })
