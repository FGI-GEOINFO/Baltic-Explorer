# Generated by Django 2.1.2 on 2020-02-18 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('umap', '0034_auto_20200218_2040'),
    ]

    operations = [
        migrations.AddField(
            model_name='latviacs',
            name='annalCheck',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='latviacs',
            name='fuluCheck',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='latviacs',
            name='fuveCheck',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='latviacs',
            name='mytrCheck',
            field=models.BooleanField(default=True),
        ),
    ]
