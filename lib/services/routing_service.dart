import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';

class RoutingService {
  final String _baseUrl = 'http://router.project-osrm.org/route/v1/driving';

  Future<RouteData> getRoute(LatLng start, LatLng end) async {
    final url =
        '$_baseUrl/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&overview=full&geometries=polyline';

    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['routes'] == null || (data['routes'] as List).isEmpty) {
          throw Exception('No route found');
        }

        final route = data['routes'][0];
        final geometry = route['geometry'];
        final duration = route['duration']; // Seconds
        final distance = route['distance']; // Meters
        final legs = route['legs'][0];
        final steps = legs['steps'] as List;

        // Decode polyline using the package
        // Note: decodePolyline returns List<PointLatLng>
        final polylinePoints = PolylinePoints.decodePolyline(geometry);
        final routePoints = polylinePoints
            .map((point) => LatLng(point.latitude, point.longitude))
            .toList();

        // Parse steps for turn-by-turn
        final instructions = steps.map<RouteInstruction>((step) {
          final maneuver = step['maneuver'];
          return RouteInstruction(
            instruction: '${maneuver['type']} ${maneuver['modifier'] ?? ''}',
            distance: step['distance'].toDouble(),
            duration: step['duration'].toDouble(),
            name: step['name'] ?? '',
          );
        }).toList();

        return RouteData(
          points: routePoints,
          duration: duration.toDouble(),
          distance: distance.toDouble(),
          instructions: instructions,
        );
      } else {
        throw Exception('Failed to load route');
      }
    } catch (e) {
      throw Exception('Error fetching route: $e');
    }
  }
}

class RouteData {
  final List<LatLng> points;
  final double duration;
  final double distance;
  final List<RouteInstruction> instructions;

  RouteData({
    required this.points,
    required this.duration,
    required this.distance,
    required this.instructions,
  });
}

class RouteInstruction {
  final String instruction;
  final double distance;
  final double duration;
  final String name;

  RouteInstruction({
    required this.instruction,
    required this.distance,
    required this.duration,
    required this.name,
  });
}
