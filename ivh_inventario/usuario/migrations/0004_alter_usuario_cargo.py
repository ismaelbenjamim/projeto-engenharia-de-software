# Generated by Django 3.2.16 on 2023-04-22 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuario', '0003_notificacao'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='cargo',
            field=models.CharField(choices=[('coordenador', 'coordenador'), ('colaborador', 'colaborador')], max_length=100),
        ),
    ]