from django.shortcuts import render
from .models import Product
from .serializers import ProductSerializer
from rest_framework import viewsets, filters
# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['status']