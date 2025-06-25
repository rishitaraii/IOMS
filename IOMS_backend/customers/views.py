from django.shortcuts import render
from .models import Customer
from .serializers import CustomerSerializer
from rest_framework import viewsets, filters

# Create your views here.
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('-id')
    serializer_class = CustomerSerializer
    search_fields = ['name', 'email']