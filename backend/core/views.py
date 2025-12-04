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

from .models import Favourite
from .serializers import FavouriteSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class FavouriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavouriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favourite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        restaurant_id = request.data.get('restaurant_id')
        if not restaurant_id:
            return Response({'error': 'restaurant_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)

        favourite, created = Favourite.objects.get_or_create(user=request.user, restaurant=restaurant)

        if not created:
            favourite.delete()
            return Response({'status': 'removed', 'restaurant_id': restaurant_id}, status=status.HTTP_200_OK)
        
        serializer = self.get_serializer(favourite)
        return Response({'status': 'added', 'data': serializer.data}, status=status.HTTP_201_CREATED)

from .gemini_service import get_cooking_recommendation
from rest_framework.decorators import api_view

@api_view(['POST'])
def recommend_cooking_time(request, order_id):
    recommendation = get_cooking_recommendation(order_id)
    return Response({'recommendation': recommendation})
