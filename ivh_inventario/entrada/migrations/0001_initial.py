# Generated by Django 3.2.16 on 2023-01-26 13:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('item', '0002_alter_item_tipo_unit'),
    ]

    operations = [
        migrations.CreateModel(
            name='Entrada',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('dt_entrada', models.DateField(verbose_name='Data de entrada')),
                ('quantidade', models.IntegerField(default=1, verbose_name='Quantidade')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.item')),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
