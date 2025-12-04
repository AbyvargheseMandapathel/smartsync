import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/api_service.dart';
import 'navigation_screen.dart';

class IncomingOrderScreen extends StatefulWidget {
  const IncomingOrderScreen({super.key});

  @override
  State<IncomingOrderScreen> createState() => _IncomingOrderScreenState();
}

class _IncomingOrderScreenState extends State<IncomingOrderScreen> {
  final ApiService _apiService = ApiService();
  List<Map<String, dynamic>> _otherAgents = [];
  
  // Mock Locations
  final LatLng _pickupLocation = LatLng(8.5241, 76.9366); // Trivandrum (approx)
  final LatLng _dropoffLocation = LatLng(8.5350, 76.9450);
  final LatLng _myLocation = LatLng(8.5200, 76.9300); // Slightly away

  @override
  void initState() {
    super.initState();
    _fetchAgents();
  }

  Future<void> _fetchAgents() async {
    final agents = await _apiService.getAllAgents();
    if (mounted) {
      setState(() {
        _otherAgents = agents;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50], // Light background
      appBar: AppBar(
        title: const Text('Incoming Order', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Map Section (Fixed Height)
          SizedBox(
            height: 280,
            child: FlutterMap(
              options: MapOptions(
                initialCenter: _pickupLocation,
                initialZoom: 13.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.smartsync_delivery',
                ),
                MarkerLayer(
                  markers: [
                    // Pickup Marker (Green)
                    Marker(
                      point: _pickupLocation,
                      width: 60,
                      height: 60,
                      child: const Column(
                        children: [
                          Icon(Icons.store, color: Colors.green, size: 40),
                          Text("Pickup", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10)),
                        ],
                      ),
                    ),
                    // Dropoff Marker (Red)
                    Marker(
                      point: _dropoffLocation,
                      width: 60,
                      height: 60,
                      child: const Column(
                        children: [
                          Icon(Icons.location_on, color: Colors.red, size: 40),
                          Text("Dropoff", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10)),
                        ],
                      ),
                    ),
                    // My Location (Blue)
                    Marker(
                      point: _myLocation,
                      width: 60,
                      height: 60,
                      child: const Column(
                        children: [
                          Icon(Icons.navigation, color: Colors.blue, size: 40),
                          Text("Me", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10)),
                        ],
                      ),
                    ),
                    // Other Agents (Grey)
                    ..._otherAgents.map((agent) {
                      return Marker(
                        point: LatLng(agent['latitude'], agent['longitude']),
                        width: 40,
                        height: 40,
                        child: const Icon(Icons.delivery_dining, color: Colors.grey, size: 30),
                      );
                    }),
                  ],
                ),
              ],
            ),
          ),
          
          // Scrollable Content
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Header
                    const Text(
                      'New Delivery Request',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.deepPurple,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Accept within 30s to secure this order',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 20),

                    // Order Card
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          _buildInfoRow(Icons.store, 'Restaurant', 'Burger King', '123 Main St, Springfield'),
                          const Divider(height: 1, indent: 20, endIndent: 20),
                          _buildInfoRow(Icons.person, 'Customer', 'John Doe', '456 Elm St, Springfield'),
                          const Divider(height: 1, indent: 20, endIndent: 20),
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Estimated Earnings', style: TextStyle(fontSize: 16, color: Colors.grey)),
                                const Text('\$15.50', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.green)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 30),

                    // Action Buttons
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {},
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              side: const BorderSide(color: Colors.redAccent, width: 2),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                            ),
                            child: const Text('Decline', style: TextStyle(fontSize: 18, color: Colors.redAccent, fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const NavigationScreen()),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.deepPurple,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                              elevation: 4,
                            ),
                            child: const Text('Accept Order', style: TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20), // Bottom padding
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.deepPurple.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.deepPurple, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 4),
                Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text(subtitle, style: const TextStyle(fontSize: 14, color: Colors.black54)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
