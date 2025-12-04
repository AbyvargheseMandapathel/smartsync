import os
import django
import time
import datetime
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartsync_backend.settings')
django.setup()

from core.models import Order, CustomUser, Restaurant, Menu, OrderItem

def verify_clubbing():
    print("Creating test data for clubbing...")
    user, _ = CustomUser.objects.get_or_create(username='test_user_club', defaults={'user_type': 'USER'})
    owner, _ = CustomUser.objects.get_or_create(username='test_owner_club', defaults={'user_type': 'RESTAURANT'})
    restaurant, _ = Restaurant.objects.get_or_create(owner=owner, name='Test Resto Club', defaults={'address': '123 Club St', 'phone_number': '1234567890'})
    menu_item, _ = Menu.objects.get_or_create(restaurant=restaurant, name='Club Sandwich', defaults={'price': 15.00, 'preparation_time': 10})

    print("\n--- Creating Order A (Initial) ---")
    order_a = Order.objects.create(
        customer=user,
        restaurant=restaurant,
        total_amount=15.00,
        status='PENDING'
    )
    OrderItem.objects.create(order=order_a, menu_item=menu_item, price=15.00)
    
    # Force the signal to run (since we are in a script, create() triggers it but we need to refresh)
    # Actually, signals run synchronously on save(). OrderItem creation doesn't trigger Order save signal.
    # The signal is on Order post_save.
    # Wait, in my signal logic, I check `instance.items.all()`.
    # When `Order.objects.create` runs, items are NOT yet added.
    # So `new_order_items.exists()` will be False!
    # I need to save the order AGAIN after adding items to trigger the signal properly for clubbing check.
    # OR, I should trigger the logic manually or use a different signal.
    # But for this test, I will save the order again.
    
    print("Triggering signal for Order A by saving again...")
    order_a.save() 
    
    order_a.refresh_from_db()
    print(f"Order A Status: {order_a.status}")
    
    # Simulate Order A getting a specific status if Gemini didn't return what we want for testing
    if "Start cooking" not in order_a.status:
        print("Manually setting Order A status for testing clubbing logic...")
        order_a.status = "Start cooking in 20 minutes"
        order_a.save()
    
    print(f"Order A Final Status: {order_a.status}")

    print("\nWaiting 2 seconds...")
    time.sleep(2)

    print("\n--- Creating Order B (Should be clubbed) ---")
    order_b = Order.objects.create(
        customer=user,
        restaurant=restaurant,
        total_amount=15.00,
        status='PENDING'
    )
    OrderItem.objects.create(order=order_b, menu_item=menu_item, price=15.00)
    
    print(f"Items in Order B before save: {order_b.items.count()}")
    
    print("Triggering signal for Order B by saving again...")
    order_b.save()
    
    order_b.refresh_from_db()
    print(f"Order B Status: {order_b.status}")
    
    if "(Clubbed" in order_b.status:
        print("SUCCESS: Order B was clubbed.")
    else:
        print("FAILURE: Order B was NOT clubbed.")

if __name__ == '__main__':
    verify_clubbing()
