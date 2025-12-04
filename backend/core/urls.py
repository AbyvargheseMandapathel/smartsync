from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'menu', views.MenuViewSet, basename='menu')
router.register(r'restaurants', views.RestaurantViewSet, basename='restaurant')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'favourites', views.FavouriteViewSet, basename='favourite')

urlpatterns = [
    path('', views.index, name='index'),
    path('orders/<int:order_id>/recommend-cooking-time/', views.recommend_cooking_time, name='recommend-cooking-time'),
    path('', include(router.urls)),
]
