# Generated by Django 3.2.16 on 2023-03-10 22:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doador', '0003_rename_cpf_cnpj_doador_identificador'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doador',
            name='identificador',
            field=models.CharField(max_length=200, unique=True, verbose_name='cpf/cnpj'),
        ),
    ]