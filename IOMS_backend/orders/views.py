from django.shortcuts import render
from .models import Orders
from rest_framework import viewsets
from .serializer import OrderSerializer

# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.all().order_by('-order_id')
    serializer_class = OrderSerializer
    

