import requests
import json
import os
from django.conf import settings
from .models import Order, CustomUser
import datetime

def get_cooking_recommendation(order_id):
    try:
        order = Order.objects.get(id=order_id)
        restaurant = order.restaurant
        
        # Get delivery partner location (simplified: find nearest or just use a placeholder)
        # For this MVP, we'll assume a delivery partner is assigned or available nearby
        # In a real scenario, we'd query the DeliveryPartner model
        delivery_partners = CustomUser.objects.filter(user_type='DELIVERYPARTNER', latitude__isnull=False, longitude__isnull=False)
        delivery_partner_loc = "Unknown"
        if delivery_partners.exists():
            dp = delivery_partners.first() # Just pick one for now
            delivery_partner_loc = f"{dp.latitude}, {dp.longitude}"
        else:
            delivery_partner_loc = "5km away (Simulated)"

        restaurant_loc = f"{restaurant.latitude}, {restaurant.longitude}" if restaurant.latitude and restaurant.longitude else "Unknown"
        
        items = order.items.all()
        items_desc = ", ".join([f"{item.quantity}x {item.menu_item.name} (Prep: {item.menu_item.preparation_time}m)" for item in items])
        
        current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        prompt = f"""
        Current Time: {current_time}
        Restaurant Location: {restaurant_loc}
        Delivery Partner Location: {delivery_partner_loc}
        Order Details: {items_desc}
        Traffic Conditions: Moderate (Simulated)
        
        Based on the above, when is the best time to start cooking to ensure the food is fresh when the delivery partner arrives? 
        Please provide a concise recommendation, e.g., "Start cooking in 5 minutes" or "Start immediately". 
        Explain your reasoning briefly.
        """

        api_key = "AIzaSyDNwaBW-LXzu2-3AHItysu87sECZUCaaFI"
        if not api_key:
            return "Error: GEMINI_API_KEY not set."

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        
        payload = {
            "contents": [{
                "role": "user",
                "parts": [{ "text": prompt }]
            }],
            "tools": [] 
        }

        headers = {
            "Content-Type": "application/json"
        }

        print(f"Sending request to Gemini for order {order_id}...")
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        print(f"Gemini response status: {response.status_code}")
        print(f"Gemini response text: {response.text[:200]}...")
        
        if response.status_code == 200:
            try:
                data = response.json()
                full_text = ""
                if 'candidates' in data:
                    for candidate in data['candidates']:
                        if 'content' in candidate and 'parts' in candidate['content']:
                            for part in candidate['content']['parts']:
                                if 'text' in part:
                                    full_text += part['text']
                                            
                return full_text if full_text else "No recommendation generated."

            except Exception as e:
                return f"Error parsing Gemini response: {str(e)}"
        else:
            return f"Error calling Gemini API: {response.status_code} - {response.text}"

    except Order.DoesNotExist:
        return "Order not found."
    except Exception as e:
        return f"An error occurred: {str(e)}"
