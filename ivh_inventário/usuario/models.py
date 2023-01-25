from uuid import uuid4

from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    CARGO = (
        ("coordenador", "coordenador"),
        ("auxiliar financeiro", "auxiliar financeiro"),
        ("auxiliar administrativo", "auxiliar administrativo"),
        ("colaborador", "colaborador")
    )

    uuid = models.UUIDField(unique=True, default=uuid4, primary_key=True, editable=False)
    email = models.EmailField(('email'), unique=False)
    cargo = models.CharField(max_length=100, choices=CARGO)

