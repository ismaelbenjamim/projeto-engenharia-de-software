# Generated by Django 3.2.18 on 2023-04-25 02:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item', '0005_auto_20230408_2051'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='estoque_atual',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]