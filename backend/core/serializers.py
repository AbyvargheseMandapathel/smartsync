from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

from .models import Menu, Restaurant

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'user_type')

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'restaurant', 'name', 'ingredients', 'veg_or_non_veg', 'preparation_time', 'price', 'is_available']
        read_only_fields = ['restaurant']

    def create(self, validated_data):
        # This will need to be handled in the view to assign the correct restaurant
        return super().create(validated_data)

class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'owner', 'owner_name', 'name', 'address', 'phone_number', 'menu_items']
        read_only_fields = ['owner']

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'quantity', 'price']
        read_only_fields = ['price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_name', 'restaurant', 'restaurant_name', 'status', 'total_amount', 'delivery_address', 'created_at', 'items']
        read_only_fields = ['customer', 'total_amount', 'created_at', 'status']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        total = 0
        for item_data in items_data:
            menu_item = item_data['menu_item']
            quantity = item_data['quantity']
            price = menu_item.price
            OrderItem.objects.create(order=order, menu_item=menu_item, quantity=quantity, price=price)
            total += price * quantity
        
        order.total_amount = total
        order.save()
        return order
