from django.urls import path
from . import views

urlpatterns = [
    path('location/', views.update_location, name='update_location'),
    path('location/<str:agent_id>/', views.get_location, name='get_location'),
    path('locations/', views.get_all_locations, name='get_all_locations'),
    path('locations/<str:agent_id>/', views.get_location, name='get_location_plural'),
    path('status/', views.update_status, name='update_status'),
]
