# Generated by Django 2.1.2 on 2020-02-17 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('umap', '0032_auto_20190829_1018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='map',
            name='edit_status',
            field=models.SmallIntegerField(choices=[(1, 'Everyone can edit'), (2, 'Only editors can edit'), (3, 'Only owner can edit')], default=2, verbose_name='edit status'),
        ),
        migrations.AlterField(
            model_name='map',
            name='share_status',
            field=models.SmallIntegerField(choices=[(1, 'Public: everyone'), (2, 'Hidden: anyone with link'), (3, 'Private: editors only')], default=1, verbose_name='share status'),
        ),
    ]