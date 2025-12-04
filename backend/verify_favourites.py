import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

def test_backend():
    # 1. Login/Signup to get token
    # Assuming a user exists or we can create one. Let's try to login with a test user.
    # If not, we might need to create one.
    # For simplicity, let's assume 'testuser' exists or create it.
    
    username = 'testuser_fav'
    password = 'testpassword123'
    email = 'testuser_fav@example.com'

    session = requests.Session()

    # Try to create user
    print("Creating user...")
    response = session.post(f'{BASE_URL}/auth/users/', data={'username': username, 'password': password, 'email': email, 'user_type': 'USER'})
    if response.status_code == 201:
        print("User created.")
    elif response.status_code == 400 and 'username' in response.json() and 'already exists' in str(response.json()['username']):
        print("User already exists.")
    else:
        print(f"Error creating user: {response.status_code} {response.text}")
        return

    # Login
    print("Logging in...")
    response = session.post(f'{BASE_URL}/auth/jwt/create/', data={'username': username, 'password': password})
    if response.status_code != 200:
        print(f"Login failed: {response.status_code} {response.text}")
        return
    
    token = response.json()['access']
    headers = {'Authorization': f'JWT {token}'}
    print("Logged in.")

    # 2. Get Restaurants
    print("Fetching restaurants...")
    response = session.get(f'{BASE_URL}/restaurants/', headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch restaurants: {response.status_code} {response.text}")
        return
    
    restaurants = response.json()
    if not restaurants:
        print("No restaurants found. Cannot test favourites.")
        # Try to create a restaurant if none exist (requires restaurant owner user, might be complex)
        # Let's hope there are restaurants.
        return

    restaurant_id = restaurants[0]['id']
    print(f"Testing with restaurant ID: {restaurant_id}")

    # 3. Toggle Favourite (Add)
    print("Toggling favourite (Add)...")
    response = session.post(f'{BASE_URL}/favourites/toggle/', json={'restaurant_id': restaurant_id}, headers=headers)
    if response.status_code != 201:
        print(f"Failed to add favourite: {response.status_code} {response.text}")
        return
    print("Favourite added.")

    # 4. List Favourites
    print("Listing favourites...")
    response = session.get(f'{BASE_URL}/favourites/', headers=headers)
    if response.status_code != 200:
        print(f"Failed to list favourites: {response.status_code} {response.text}")
        return
    
    favourites = response.json()
    fav_ids = [f['restaurant'] for f in favourites]
    if restaurant_id not in fav_ids:
        print(f"Error: Restaurant {restaurant_id} not in favourites list: {fav_ids}")
        return
    print("Verification successful: Restaurant found in favourites.")

    # 5. Toggle Favourite (Remove)
    print("Toggling favourite (Remove)...")
    response = session.post(f'{BASE_URL}/favourites/toggle/', json={'restaurant_id': restaurant_id}, headers=headers)
    if response.status_code != 200:
        print(f"Failed to remove favourite: {response.status_code} {response.text}")
        return
    print("Favourite removed.")

    # 6. List Favourites again
    print("Listing favourites again...")
    response = session.get(f'{BASE_URL}/favourites/', headers=headers)
    favourites = response.json()
    fav_ids = [f['restaurant'] for f in favourites]
    if restaurant_id in fav_ids:
        print(f"Error: Restaurant {restaurant_id} still in favourites list: {fav_ids}")
        return
    print("Verification successful: Restaurant removed from favourites.")

if __name__ == "__main__":
    test_backend()
