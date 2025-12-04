from django.http import HttpResponse

from rest_framework import viewsets, permissions
from .models import Menu, Restaurant
from .serializers import MenuSerializer, RestaurantSerializer
from rest_framework.exceptions import PermissionDenied

def index(request):
    return HttpResponse("Hello World from Django!")

class MenuViewSet(viewsets.ModelViewSet):
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return menu items for restaurants owned by the user
        return Menu.objects.filter(restaurant__owner=self.request.user)

    def perform_create(self, serializer):
        # Get the user's first restaurant (for simplicity in this iteration)
        restaurant = Restaurant.objects.filter(owner=self.request.user).first()
        if not restaurant:
            raise PermissionDenied("You must create a restaurant first.")
        serializer.save(restaurant=restaurant)

class RestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Restaurant.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'RESTAURANT':
            # Return orders for all restaurants owned by this user
            return Order.objects.filter(restaurant__owner=user).order_by('-created_at')
        else:
            # Return orders placed by this user
            return Order.objects.filter(customer=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
