# Customers/urls.py

from django.urls import path
from .views import CustomerListView, CustomerDetailView, CustomerCreateView, CustomerUpdateView, CustomerDeleteView

urlpatterns = [
    path('', CustomerListView.as_view(), name='order-list'),               # GET /api/orders/
    path('<int:pk>/', CustomerDetailView.as_view(), name='order-detail'),  # GET /api/orders/5/
    path('create/', CustomerCreateView.as_view(), name='order-create'),    # POST
    path('<int:pk>/update/', CustomerUpdateView.as_view(), name='order-update'),  # PUT
    path('<int:pk>/delete/', CustomerDeleteView.as_view(), name='order-delete'),  # DELETE
]