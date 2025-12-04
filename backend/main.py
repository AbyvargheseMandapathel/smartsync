import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn
import requests
import polyline
import math
import random
from enum import Enum

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Enums & Constants ---
class MissionState(str, Enum):
    IDLE = "IDLE"
    TO_PICKUP = "TO_PICKUP"
    AT_PICKUP = "AT_PICKUP"
    TO_DROPOFF = "TO_DROPOFF"
    COMPLETED = "COMPLETED"

# Locations
START_LAT = 8.5241
START_LNG = 76.9366
PICKUP_LAT = 8.5241  # Restaurant (Same as start for simplicity, or slightly different)
PICKUP_LNG = 76.9366
DROPOFF_LAT = 8.5350 # Customer
DROPOFF_LNG = 76.9450

# --- Data Models ---
class AgentLocation(BaseModel):
    agent_id: str
    latitude: float
    longitude: float
    is_active: bool = True
    last_updated: Optional[datetime] = None
    status: MissionState = MissionState.IDLE
    estimated_time_remaining: int = 0 # Seconds
    traffic_condition: str = "Low" # Low, Moderate, Heavy

class StatusUpdate(BaseModel):
    agent_id: str
    is_active: bool

class LocationUpdate(BaseModel):
    agent_id: str
    latitude: float
    longitude: float

class AgentListResponse(BaseModel):
    agents: List[AgentLocation]

# --- In-Memory Database ---
agents_db = {
    "agent_1": AgentLocation(
        agent_id="agent_1",
        latitude=START_LAT,
        longitude=START_LNG,
        is_active=True,
        last_updated=datetime.now(),
        status=MissionState.IDLE
    )
}

# --- Simulation Logic ---
route_points: List[tuple] = [] 
current_route_index = 0
current_congestion_delay = 0.0 # Seconds to wait per step

def fetch_route(start_lat, start_lng, end_lat, end_lng):
    """Fetches route from OSRM and decodes it."""
    global route_points, current_route_index, current_congestion_delay
    
    url = f"http://router.project-osrm.org/route/v1/driving/{start_lng},{start_lat};{end_lng},{end_lat}?overview=full&geometries=polyline"
    headers = {'User-Agent': 'SmartSyncDelivery/1.0'}
    
    try:
        print(f"Fetching route: {start_lat},{start_lng} -> {end_lat},{end_lng}")
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data['routes']:
                geometry = data['routes'][0]['geometry']
                route_points = polyline.decode(geometry)
                current_route_index = 0
                
                # Simulate Traffic: Randomly assign a congestion level
                traffic_roll = random.random()
                if traffic_roll < 0.6:
                    current_congestion_delay = 0.0 # Low Traffic (Normal speed)
                    agents_db["agent_1"].traffic_condition = "Low"
                elif traffic_roll < 0.9:
                    current_congestion_delay = 0.5 # Moderate Traffic (Slower)
                    agents_db["agent_1"].traffic_condition = "Moderate"
                else:
                    current_congestion_delay = 1.5 # Heavy Traffic (Very slow)
                    agents_db["agent_1"].traffic_condition = "Heavy"
                
                print(f"Route fetched: {len(route_points)} points. Traffic: {agents_db['agent_1'].traffic_condition}")
                return True
            else:
                print("No route found.")
        else:
            print(f"Failed to fetch route: {response.status_code}")
    except Exception as e:
        print(f"Error fetching route: {e}")
    return False

async def simulation_loop():
    """Simulates agent mission lifecycle."""
    global current_route_index
    
    agent = agents_db["agent_1"]
    
    # Initial State: Start moving to Pickup immediately for demo
    agent.status = MissionState.TO_PICKUP
    fetch_route(agent.latitude, agent.longitude, DROPOFF_LAT, DROPOFF_LNG) # Actually moving to dropoff for the demo flow
    # Ideally: IDLE -> (Order Accepted) -> TO_PICKUP -> AT_PICKUP -> TO_DROPOFF
    # For this demo, let's simulate: TO_DROPOFF directly (as if picked up)
    
    while True:
        # Dynamic Sleep based on Traffic
        await asyncio.sleep(1.0 + current_congestion_delay)
        
        if not agent.is_active:
            continue

        if agent.status == MissionState.TO_DROPOFF or agent.status == MissionState.TO_PICKUP:
            if route_points and current_route_index < len(route_points):
                lat, lng = route_points[current_route_index]
                agent.latitude = lat
                agent.longitude = lng
                agent.last_updated = datetime.now()
                
                # Calculate ETA
                remaining_steps = len(route_points) - current_route_index
                step_time = 1.0 + current_congestion_delay
                agent.estimated_time_remaining = int(remaining_steps * step_time)
                
                print(f"Agent moving. ETA: {agent.estimated_time_remaining}s. Traffic: {agent.traffic_condition}")
                current_route_index += 1
            else:
                # Reached Destination
                if agent.status == MissionState.TO_PICKUP:
                    print("Arrived at Pickup.")
                    agent.status = MissionState.AT_PICKUP
                    await asyncio.sleep(5) # Wait at restaurant
                    agent.status = MissionState.TO_DROPOFF
                    # Fetch route to Dropoff
                    fetch_route(agent.latitude, agent.longitude, DROPOFF_LAT, DROPOFF_LNG)
                elif agent.status == MissionState.TO_DROPOFF:
                    print("Arrived at Dropoff. Mission Completed.")
                    agent.status = MissionState.COMPLETED
                    agent.estimated_time_remaining = 0
                    # Stop or Reset?
                    # Let's reset for continuous demo
                    await asyncio.sleep(10)
                    agent.latitude = START_LAT
                    agent.longitude = START_LNG
                    agent.status = MissionState.TO_PICKUP
                    fetch_route(START_LAT, START_LNG, DROPOFF_LAT, DROPOFF_LNG)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(simulation_loop())

# --- API Endpoints ---

@app.get("/api/delivery/locations/", response_model=AgentListResponse)
async def get_all_agents():
    return AgentListResponse(agents=list(agents_db.values()))

@app.get("/api/delivery/location/{agent_id}/", response_model=AgentLocation)
async def get_single_agent(agent_id: str):
    agent = agents_db.get(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@app.post("/api/delivery/status/")
async def update_agent_status(update: StatusUpdate):
    agent = agents_db.get(update.agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent.is_active = update.is_active
    agent.last_updated = datetime.now()
    return {"message": f"Agent {update.agent_id} status updated to {update.is_active}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
