# Generated by Django 3.2.18 on 2023-04-25 23:13

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entrada', '0006_alter_entrada_quantidade'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entrada',
            name='dt_entrada',
            field=models.DateField(blank=True, default=datetime.date(2023, 4, 25), null=True, verbose_name='Data de entrada'),
        ),
    ]
