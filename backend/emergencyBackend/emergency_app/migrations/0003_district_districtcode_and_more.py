# Generated by Django 5.1.4 on 2025-01-14 17:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('emergency_app', '0002_alter_naturaldisastermodel_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('country', models.CharField(max_length=100)),
                ('state', models.CharField(choices=[('safe', 'Safe'), ('natural_disaster_incoming', 'Natural disaster incoming'), ('natural_disaster_ongoing', 'Natural disaster ongoing'), ('natural_disaster_ended', 'Natural disaster ended')], default='safe', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='DistrictCode',
            fields=[
                ('district_code', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=250)),
            ],
        ),
        migrations.RemoveField(
            model_name='naturaldisasterincitymodel',
            name='city',
        ),
        migrations.RemoveField(
            model_name='user',
            name='city',
        ),
        migrations.RemoveField(
            model_name='naturaldisasterincitymodel',
            name='natural_disaster',
        ),
        migrations.AddField(
            model_name='user',
            name='district',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='emergency_app.district'),
        ),
        migrations.CreateModel(
            name='NaturalDisasterInDistrict',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField(auto_now=True)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='emergency_app.district')),
                ('natural_disaster', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='emergency_app.naturaldisastermodel')),
            ],
        ),
        migrations.DeleteModel(
            name='CityModel',
        ),
        migrations.DeleteModel(
            name='NaturalDisasterInCityModel',
        ),
    ]
