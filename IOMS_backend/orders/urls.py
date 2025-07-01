# orders/urls.py

from django.urls import path
from .views import OrderListView, OrderDetailView, OrderCreateView, OrderUpdateView, OrderDeleteView

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),               # GET /api/orders/
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),  # GET /api/orders/5/
    path('create/', OrderCreateView.as_view(), name='order-create'),    # POST
    path('<int:pk>/update/', OrderUpdateView.as_view(), name='order-update'),  # PUT
    path('<int:pk>/delete/', OrderDeleteView.as_view(), name='order-delete'),  # DELETE
]