from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Orders, OrderItem
from inventory.models import Product
from customers.models import Customer
from .serializer import OrderSerializer, OrderItemSerializer

class OrderListView(APIView):
    def get(self, request):
        orders = Orders.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
class OrderDetailView(APIView):
    def get(self, request, pk):
        try:
            order = Orders.objects.get(pk=pk)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
class OrderCreateView(APIView):
    def post(self, request):
        customer_id = request.data.get('customer')
        items_data = request.data.get('items', [])
        status_str = request.data.get('status', 'Pending')

        if not customer_id or not items_data:
            return Response({"error": "Customer and items are required."}, status=400)

        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            return Response({"error": "Customer does not exist."}, status=404)

        order = Orders.objects.create(customer=customer, status=status_str)

        total_items = 0
        total_price = 0

        for item in items_data:
            product_id = item.get('product')
            quantity = item.get('quantity', 1)

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({"error": f"Product {product_id} does not exist."}, status=404)
            
            if product.status == 'inactive':
                return Response({"error": f"{product.name} is inactive and cannot be ordered."}, status=400)


            if product.stock_quantity < quantity:
                return Response({"error": f"Insufficient stock for {product.name}."}, status=400)

            product.stock_quantity -= quantity
            product.save()

            OrderItem.objects.create(order=order, product=product, quantity=quantity)

            total_items += quantity
            total_price += product.price * quantity

        order.total_items = total_items
        order.total_price = total_price
        order.save()

        return Response({"message": "Order created", "order_id": order.order_id}, status=201)


class OrderUpdateView(APIView):
    def put(self, request, pk):
        try:
            order = Orders.objects.get(pk=pk)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

        items_data = request.data.get('items', [])
        status_str = request.data.get('status', order.status)
        customer_id = request.data.get('customer', order.customer.id)

        # Restore stock from previous items
        for item in order.items.all():
            product = item.product
            product.stock_quantity += item.quantity
            product.save()

        # Delete old order items
        order.items.all().delete()

        total_items = 0
        total_price = 0

        for item in items_data:
            product_id = item.get('product')
            quantity = item.get('quantity', 1)

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({"error": f"Product {product_id} does not exist."}, status=404)
            if product.status == 'inactive':
                return Response({"error": f"{product.name} is inactive and cannot be ordered."}, status=400)

            if product.stock_quantity < quantity:
                return Response({"error": f"Insufficient stock for {product.name}."}, status=400)

            product.stock_quantity -= quantity
            product.save()

            OrderItem.objects.create(order=order, product=product, quantity=quantity)

            total_items += quantity
            total_price += product.price * quantity

        order.customer_id = customer_id
        order.status = status_str
        order.total_items = total_items
        order.total_price = total_price
        order.save()

        return Response({"message": "Order updated."}, status=200)


class OrderDeleteView(APIView):
    def delete(self, request, pk):
        try:
            order = Orders.objects.get(pk=pk)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

        # Restore stock
        for item in order.items.all():
            product = item.product
            product.stock_quantity += item.quantity
            product.save()

        order.delete()
        return Response({"message": "Order deleted and stock restored."}, status=204)
