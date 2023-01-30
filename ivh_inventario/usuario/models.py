from uuid import uuid4

from django.contrib.auth.models import AbstractUser
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
