# Generated by Django 3.2.16 on 2023-02-04 21:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item', '0002_alter_item_tipo_unit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='doc_fisc',
            field=models.FileField(blank=True, null=True, upload_to='', verbose_name='Documento fiscal'),
        ),
    ]
