# Generated by Django 2.1.2 on 2019-07-02 13:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('umap', '0023_remove_tilelayerwms_wms_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tilelayerwms',
            name='wms_provider',
        ),
    ]