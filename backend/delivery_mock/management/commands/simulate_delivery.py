import time
import random
from django.core.management.base import BaseCommand
from delivery_mock.models import MockLocation

class Command(BaseCommand):
    help = 'Simulates delivery agent movement'

    def add_arguments(self, parser):
        parser.add_argument('--interval', type=int, default=2, help='Update interval in seconds')

    def handle(self, *args, **options):
        interval = options['interval']
        
        # Trivandrum coordinates
        base_lat = 8.5241
        base_lon = 76.9366
        
        # Initialize 10 agents if they don't exist
        agents = []
        for i in range(1, 11):
            agent_id = f'agent_{i:03d}'
            # Random start within ~5km (approx 0.045 degrees)
            start_lat = base_lat + random.uniform(-0.045, 0.045)
            start_lon = base_lon + random.uniform(-0.045, 0.045)
            
            location, created = MockLocation.objects.get_or_create(
                agent_id=agent_id,
                defaults={
                    'latitude': start_lat, 
                    'longitude': start_lon,
                    'is_active': True
                }
            )
            agents.append(agent_id)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created {agent_id} at {start_lat}, {start_lon}'))

        self.stdout.write(self.style.SUCCESS(f'Starting simulation for {len(agents)} agents near Trivandrum'))

        try:
            while True:
                for agent_id in agents:
                    # Fetch fresh object to check status
                    try:
                        location = MockLocation.objects.get(agent_id=agent_id)
                    except MockLocation.DoesNotExist:
                        continue

                    if not location.is_active:
                        # self.stdout.write(f'{agent_id} is stopped (call received)')
                        continue

                    # Simulate small movement
                    lat = location.latitude + random.uniform(-0.0005, 0.0005)
                    lon = location.longitude + random.uniform(-0.0005, 0.0005)

                    location.latitude = lat
                    location.longitude = lon
                    location.save()

                self.stdout.write(f'Updated locations for active agents')
                time.sleep(interval)
        except KeyboardInterrupt:
            self.stdout.write(self.style.SUCCESS('Simulation stopped'))
