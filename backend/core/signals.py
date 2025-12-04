from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .gemini_service import get_cooking_recommendation

@receiver(post_save, sender=Order)
@receiver(post_save, sender=Order)
@receiver(post_save, sender=Order)
def update_cooking_status(sender, instance, created, update_fields=None, **kwargs):
    # Avoid recursion: if we are only updating status, do nothing
    if update_fields and 'status' in update_fields and len(update_fields) == 1:
        return

    print(f"Signal triggered for Order #{instance.id} (Created: {created}, Status: {instance.status})")
    
    # Check for clubbing opportunity
    try:
        from .models import OrderItem
        # Query OrderItem directly
        new_order_items = OrderItem.objects.filter(order=instance)
        
        if not new_order_items.exists():
            print(f"No items in order #{instance.id}, skipping clubbing check.")
        else:
            # Simplified clubbing: match if ANY item matches an active order's item
            # In a real app, you might want exact match of all items or complex grouping
            
            # Find other active orders for this restaurant that are waiting to start cooking
            active_orders = Order.objects.filter(
                restaurant=instance.restaurant,
                status__icontains="Start cooking"
            ).exclude(id=instance.id)
            
            for active_order in active_orders:
                # Check if they have overlapping items
                active_items = active_order.items.all()
                
                # Check for intersection of menu_items
                new_menu_items = set(item.menu_item_id for item in new_order_items)
                active_menu_items = set(item.menu_item_id for item in active_items)
                
                if new_menu_items.intersection(active_menu_items):
                    print(f"Found matching active Order #{active_order.id} with status: {active_order.status}")
                    
                    # Parse time from active order
                    import re
                    import datetime
                    from django.utils import timezone
                    
                    match = re.search(r"(\d+)\s*minutes?", active_order.status)
                    if match:
                        minutes_wait = int(match.group(1))
                        
                        # Calculate when the active order is supposed to start
                        # active_order.created_at is UTC. 
                        # We assume "Start cooking in X mins" was relative to active_order.created_at
                        
                        target_start_time = active_order.created_at + datetime.timedelta(minutes=minutes_wait)
                        now = timezone.now()
                        
                        remaining_time = target_start_time - now
                        remaining_minutes = int(remaining_time.total_seconds() / 60)
                        
                        if remaining_minutes > 0:
                            new_status = f"Start cooking in {remaining_minutes} minutes (Clubbed with #{active_order.id})"
                        else:
                            new_status = f"Start cooking immediately (Clubbed with #{active_order.id})"
                            
                        instance.status = new_status
                        instance.save(update_fields=['status'])
                        print(f"Order #{instance.id} clubbed. New Status: {new_status}")
                        return # Skip Gemini call
                        
    except Exception as e:
        print(f"Error in clubbing logic: {e}")

    # If not clubbed, proceed with Gemini
    try:
        recommendation = get_cooking_recommendation(instance.id)
        print(f"Recommendation received: {recommendation}")
        
        if recommendation and not recommendation.startswith("Error"):
            short_status = recommendation.split('.')[0].split('\n')[0].strip()
            
            if not short_status:
                short_status = "Advice generated"

            if len(short_status) > 255:
                short_status = short_status[:252] + "..."
            
            instance.status = short_status
            instance.save(update_fields=['status'])
            print(f"Order #{instance.id} status updated to: {short_status}")
    except Exception as e:
        print(f"Error in signal: {e}")
