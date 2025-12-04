import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/routing_service.dart';
import '../services/api_service.dart';

class NavigationScreen extends StatefulWidget {
  const NavigationScreen({super.key});

  @override
  State<NavigationScreen> createState() => _NavigationScreenState();
}

class _NavigationScreenState extends State<NavigationScreen> {
  final RoutingService _routingService = RoutingService();
  final ApiService _apiService = ApiService();
  
  List<LatLng> _routePoints = [];
  List<RouteInstruction> _instructions = [];
  bool _isLoading = true;
  double _duration = 0;
  double _distance = 0;
  String _trafficStatus = "Moderate"; 
  Color _trafficColor = Colors.orange;

  // Real-time agent location
  LatLng _currentLocation = LatLng(8.5241, 76.9366); // Initial (Trivandrum)
  final LatLng _destination = LatLng(8.5350, 76.9450); // Target
  Timer? _locationTimer;

  @override
  void initState() {
    super.initState();
    _fetchRoute();
    _startLocationUpdates();
  }

  @override
  void dispose() {
    _locationTimer?.cancel();
    super.dispose();
  }

  void _startLocationUpdates() {
    // Poll every 1 second for smoother updates
    _locationTimer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      final agentData = await _apiService.getAgentLocation("agent_1");
      if (agentData != null) {
        setState(() {
          _currentLocation = agentData.location;
          
          // Update ETA and Traffic from backend simulation
          _duration = agentData.etaSeconds.toDouble();
          _trafficStatus = "${agentData.trafficCondition} Traffic";
          
          if (agentData.trafficCondition == "Heavy") {
            _trafficColor = Colors.red;
          } else if (agentData.trafficCondition == "Moderate") {
            _trafficColor = Colors.orange;
          } else {
            _trafficColor = Colors.green;
          }
        });
      }
    });
  }

  Future<void> _fetchRoute() async {
    try {
      // Fetch route from CURRENT location to DESTINATION
      final routeData = await _routingService.getRoute(_currentLocation, _destination);
      setState(() {
        _routePoints = routeData.points;
        _instructions = routeData.instructions;
        _duration = routeData.duration;
        _distance = routeData.distance;
        _isLoading = false;
        
        if (_duration > 600) {
           _trafficStatus = "Heavy Traffic";
           _trafficColor = Colors.red;
        } else {
           _trafficStatus = "Moderate Traffic";
           _trafficColor = Colors.orange;
        }
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      print("Error fetching route: $e");
    }
  }

  String _formatDuration(double seconds) {
    final minutes = (seconds / 60).round();
    return '$minutes min';
  }

  String _formatDistance(double meters) {
    if (meters >= 1000) {
      return '${(meters / 1000).toStringAsFixed(1)} km';
    }
    return '${meters.round()} m';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Navigation'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          FlutterMap(
            options: MapOptions(
              initialCenter: _currentLocation,
              initialZoom: 15.0,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.example.smartsync_delivery',
              ),
              if (_routePoints.isNotEmpty)
                PolylineLayer(
                  polylines: [
                    Polyline(
                      points: _routePoints,
                      strokeWidth: 5.0,
                      color: Colors.blue,
                    ),
                  ],
                ),
              MarkerLayer(
                markers: [
                  // Agent Marker (Moving)
                  Marker(
                    point: _currentLocation,
                    width: 60,
                    height: 60,
                    child: const Icon(
                      Icons.delivery_dining, // Delivery scooter icon
                      color: Colors.deepPurple,
                      size: 40,
                    ),
                  ),
                  // Destination Marker
                  Marker(
                    point: _destination,
                    width: 60,
                    height: 60,
                    child: const Icon(
                      Icons.location_on,
                      color: Colors.red,
                      size: 40,
                    ),
                  ),
                ],
              ),
            ],
          ),
          if (_isLoading)
            const Center(child: CircularProgressIndicator())
          else ...[
            // Top Banner: Next Instruction
            if (_instructions.isNotEmpty)
              Positioned(
                top: 16,
                left: 16,
                right: 16,
                child: Card(
                  color: Colors.deepPurple,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        const Icon(Icons.turn_right, color: Colors.white, size: 32),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _instructions.length > 1 && _instructions[1].name.isNotEmpty 
                                    ? _instructions[1].name 
                                    : "Proceed",
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                _instructions.length > 1 
                                    ? '${_instructions[1].instruction} in ${_formatDistance(_instructions[1].distance)}'
                                    : 'Arriving soon',
                                style: const TextStyle(color: Colors.white70),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            
            // Bottom Sheet: Trip Info
            Positioned(
              bottom: 24,
              left: 24,
              right: 24,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _formatDuration(_duration),
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green,
                                ),
                              ),
                              Text(
                                '${_formatDistance(_distance)} • $_trafficStatus',
                                style: TextStyle(
                                  color: _trafficColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.redAccent,
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            ),
                            child: const Text('Exit', style: TextStyle(color: Colors.white)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
