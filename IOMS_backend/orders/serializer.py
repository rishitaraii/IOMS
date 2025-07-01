from rest_framework import serializers
from .models import Orders, OrderItem
from customers.serializers import CustomerSerializer
from inventory.serializers import ProductSerializer 
from inventory.models import Product 
from customers.models import Customer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    order = serializers.IntegerField(source='order.order_id', read_only=True)

    
    class Meta:
        model = OrderItem
        fields = ['order','product', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), write_only=True
    )  
    customer_details = CustomerSerializer(source='customer', read_only=True)  
    total_items = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Orders
        fields = ['order_id', 'customer','customer_details', 'date', 'status', 'total_items', 'total_price', 'items']

