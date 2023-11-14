# Generated by Django 4.2.5 on 2023-11-14 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('laboratory', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Equipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('category', models.CharField(choices=[('none', 'None'), ('rss32', 'RS232'), ('tcp', 'TCP')], default='none', max_length=10)),
            ],
        ),
    ]