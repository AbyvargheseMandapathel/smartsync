from django.contrib import admin
from .models import CustomUser, Restaurant, Menu, Order, OrderItem, Favourite

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'user_type', 'is_superuser', 'is_staff')
    list_filter = ('user_type', 'is_superuser', 'is_staff')
    search_fields = ('username', 'email')


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'phone_number', 'latitude', 'longitude')
    search_fields = ('name', 'owner__username')
    list_filter = ('owner',)


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'veg_or_non_veg', 'price', 'is_available')
    list_filter = ('veg_or_non_veg', 'restaurant')
    search_fields = ('name', 'restaurant__name')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'restaurant', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'restaurant')
    search_fields = ('customer__username', 'restaurant__name')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'menu_item', 'quantity', 'price')
    search_fields = ('order__id', 'menu_item__name')


@admin.register(Favourite)
class FavouriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'restaurant', 'created_at')
    search_fields = ('user__username', 'restaurant__name')
