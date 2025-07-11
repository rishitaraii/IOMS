# Generated by Django 5.2.3 on 2025-06-25 08:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0013_remove_orderitem_total_items_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orders',
            name='status',
            field=models.CharField(choices=[('Cancelled', 'Cancelled'), ('Delivered', 'Delivered'), ('Processing', 'Processing'), ('Shipped', 'Shipped'), ('Pending', 'Pending')], default='Pending', max_length=20),
        ),
    ]
