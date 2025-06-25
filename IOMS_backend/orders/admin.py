from django.contrib import admin
from .models import Orders, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer', 'status', 'date', 'total_items', 'total_price')
    inlines = [OrderItemInline]
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity')
   
admin.site.register(Orders, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)