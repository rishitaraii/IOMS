from rest_framework import serializers
from .models import Orders, OrderItem
from customers.serializers import CustomerSerializer
from inventory.serializers import ProductSerializer  

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['order_id', 'product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer = CustomerSerializer(read_only=True)

    class Meta:
        model = Orders
        fields = ['order_id', 'customer', 'date', 'status', 'total_items', 'total_price', 'items']
                                                                             