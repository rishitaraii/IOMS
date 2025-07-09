from django.urls import path
from .views import LoginView, RefreshAccessView

urlpatterns = [
    path('token/', LoginView.as_view(), name='token_login'),
    path('token/refresh/', RefreshAccessView.as_view(), name='token_refresh'),
]
