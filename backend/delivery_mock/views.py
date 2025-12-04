import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import MockLocation

@require_http_methods(["GET"])
def get_all_locations(request):
    locations = MockLocation.objects.all()
    data = []
    for loc in locations:
        data.append({
            'agent_id': loc.agent_id,
            'latitude': loc.latitude,
            'longitude': loc.longitude,
            'is_active': loc.is_active,
            'last_updated': loc.last_updated
        })
    return JsonResponse({'agents': data})

@csrf_exempt
@require_http_methods(["POST"])
def update_status(request):
    try:
        data = json.loads(request.body)
        agent_id = data.get('agent_id')
        is_active = data.get('is_active')

        if agent_id is None or is_active is None:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        try:
            location = MockLocation.objects.get(agent_id=agent_id)
            location.is_active = is_active
            location.save()
            return JsonResponse({'message': f'Agent {agent_id} status updated to {is_active}'})
        except MockLocation.DoesNotExist:
            return JsonResponse({'error': 'Agent not found'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def update_location(request):
    try:
        data = json.loads(request.body)
        agent_id = data.get('agent_id')
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        if not all([agent_id, latitude, longitude]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        location, created = MockLocation.objects.update_or_create(
            agent_id=agent_id,
            defaults={'latitude': latitude, 'longitude': longitude}
        )
        
        return JsonResponse({
            'message': 'Location updated successfully',
            'agent_id': location.agent_id,
            'latitude': location.latitude,
            'longitude': location.longitude,
            'last_updated': location.last_updated
        })
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_location(request, agent_id):
    try:
        location = MockLocation.objects.get(agent_id=agent_id)
        return JsonResponse({
            'agent_id': location.agent_id,
            'latitude': location.latitude,
            'longitude': location.longitude,
            'last_updated': location.last_updated
        })
    except MockLocation.DoesNotExist:
        return JsonResponse({'error': 'Agent not found'}, status=404)
