# Products/urls.py

from django.urls import path
from .views import ProductListView, ProductDetailView, ProductCreateView, ProductUpdateView, ProductDeleteView

urlpatterns = [
    path('', ProductListView.as_view(), name='order-list'),               
    path('<int:pk>/', ProductDetailView.as_view(), name='order-detail'),  
    path('create/', ProductCreateView.as_view(), name='order-create'),    
    path('<int:pk>/update/', ProductUpdateView.as_view(), name='order-update'),  
    path('<int:pk>/delete/', ProductDeleteView.as_view(), name='order-delete'),  
]