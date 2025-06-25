from django.contrib import admin
from .models import Product
# Register your models here.
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'price', 'stock_quantity', 'status', 'is_low_stock')
    list_filter = ('status',)
    search_fields = ('name', 'sku')
admin.site.register(Product)