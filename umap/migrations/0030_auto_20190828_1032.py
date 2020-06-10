# Generated by Django 2.1.2 on 2019-08-28 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('umap', '0029_auto_20190819_1248'),
    ]

    operations = [
        migrations.AddField(
            model_name='latviacs',
            name='method',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='latviacs',
            name='url_annal',
            field=models.CharField(help_text='url to find layer', max_length=300),
        ),
        migrations.AlterField(
            model_name='latviacs',
            name='url_fulu',
            field=models.CharField(help_text='url to find layer', max_length=300),
        ),
        migrations.AlterField(
            model_name='latviacs',
            name='url_fuve',
            field=models.CharField(help_text='url to find layer', max_length=300),
        ),
        migrations.AlterField(
            model_name='latviacs',
            name='url_mytr',
            field=models.CharField(help_text='url to find layer', max_length=300),
        ),
        migrations.AlterField(
            model_name='latviacs',
            name='url_result',
            field=models.CharField(help_text='url to find layer', max_length=300),
        ),
        migrations.AlterField(
            model_name='latviacs',
            name='url_sust',
            field=models.CharField(help_text='url to find layer', max_length=300),
        ),
    ]