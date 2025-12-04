from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'menu', views.MenuViewSet, basename='menu')
router.register(r'restaurants', views.RestaurantViewSet, basename='restaurant')
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('', views.index, name='index'),
    path('', include(router.urls)),
]
