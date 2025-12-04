// Paste this replacing your existing ApiService (keep your AgentData unchanged)
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:latlong2/latlong.dart';
import 'dart:io' show HttpOverrides, HttpClient, SecurityContext; // used only for non-web

class AgentData {
  final LatLng location;
  final int etaSeconds;
  final String trafficCondition;

  AgentData({
    required this.location,
    required this.etaSeconds,
    required this.trafficCondition,
  });
}

class ApiService {
  String get _baseUrl =>
      'http://127.0.0.1:8000/api/delivery';

  ApiService({bool allowBadCertificateForDev = false}) {
    // For development only (mobile/desktop). DOES NOT WORK on Web.
    if (allowBadCertificateForDev && !kIsWeb) {
      HttpOverrides.global = _MyHttpOverrides();
      print('⚠️ HttpOverrides enabled - allowBadCertificateForDev=true (DEV ONLY)');
    }
  }

  // More robust GET with logging, exponential backoff
  Future<http.Response> _getWithRetries(
    String url, {
    int maxAttempts = 3,
    Duration timeoutDuration = const Duration(seconds: 10),
  }) async {
    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        final response = await http
            .get(
              Uri.parse(url),
              headers: {
                'Accept': 'application/json',
              },
            )
            .timeout(timeoutDuration);
        return response;
      } on TimeoutException catch (te) {
        if (attempt < maxAttempts) {
          final backoff = Duration(milliseconds: 500 * (1 << (attempt - 1)));
          // print('GET timeout, retrying after ${backoff.inMilliseconds}ms...');
          await Future.delayed(backoff);
          continue;
        }
        rethrow;
      } catch (e) {
        if (attempt >= maxAttempts) rethrow;
        final backoff = Duration(milliseconds: 500 * (1 << (attempt - 1)));
        await Future.delayed(backoff);
      }
    }
    throw Exception('Unreachable code in _getWithRetries');
  }

  Future<AgentData?> getAgentLocation(String agentId) async {
    final url = '$_baseUrl/location/$agentId/';
    try {
      final response = await _getWithRetries(url);
      print('Status: ${response.statusCode}');
      print('Content-Type: ${response.headers['content-type']}');
      // quick HTML guard
      final body = response.body ?? '';
      if (body.trimLeft().startsWith('<')) {
        // clearly HTML returned (ngrok / server error page)
        print('❌ Server returned HTML, not JSON. First 200 chars:\n${body.substring(0, body.length.clamp(0, 200))}');
        return null;
      }

      if (response.statusCode != 200) {
        print('Non-200 status: ${response.statusCode}. Body: $body');
        return null;
      }

      // extra safety: only try decode if content-type looks like JSON
      final contentType = response.headers['content-type'] ?? '';
      if (!contentType.contains('application/json') && !contentType.contains('json')) {
        // print('Warning: content-type not JSON: $contentType. Attempting decode anyway.');
      }

      final data = json.decode(body);
      if (data == null || data['latitude'] == null || data['longitude'] == null) {
        // print('Missing lat/lng in JSON: $data');
        return null;
      }

      return AgentData(
        location: LatLng((data['latitude'] as num).toDouble(), (data['longitude'] as num).toDouble()),
        etaSeconds: (data['estimated_time_remaining'] is num) ? (data['estimated_time_remaining'] as num).toInt() : 0,
        trafficCondition: data['traffic_condition']?.toString() ?? 'Unknown',
      );
    } catch (e, st) {
      print('Exception in getAgentLocation: ${e.runtimeType} - $e');
      // print(st);
      return null;
    }
  }

  Future<bool> updateAgentStatus(String agentId, bool isActive) async {
    final url = '$_baseUrl/status/';
    const timeoutDuration = Duration(seconds: 10);

    final payload = json.encode({'agent_id': agentId, 'is_active': isActive});

    try {
      final response = await http
          .post(
            Uri.parse(url),
            headers: {
              'Content-Type': 'application/json',
            },
            body: payload,
          )
          .timeout(timeoutDuration);

      print('updateAgentStatus: status=${response.statusCode}, body=${response.body}');
      return response.statusCode == 200;
    } on TimeoutException catch (te) {
      print('updateAgentStatus timed out: $te');
      return false;
    } catch (e, st) {
      print('updateAgentStatus: Exception type: ${e.runtimeType}');
      print('updateAgentStatus: message: $e');
      //print('Stack: $st');
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> getAllAgents() async {
    final url = '$_baseUrl/locations/';

    try {
      final response = await _getWithRetries(url);
      print('getAllAgents: status=${response.statusCode}');
      print('getAllAgents body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data == null || data['agents'] == null) return [];
        return List<Map<String, dynamic>>.from(data['agents']);
      } else {
        print('getAllAgents: Non-200: ${response.statusCode}');
        return [];
      }
    } on TimeoutException catch (te) {
      print('getAllAgents timed out: $te');
      return [];
    } catch (e, st) {
      print('getAllAgents: Exception type: ${e.runtimeType}');
      print('getAllAgents: message: $e');
      print('Stack: $st');
      return [];
    }
  }
}

// Simple HttpOverrides to accept bad certs (DEV ONLY)
class _MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    final client = super.createHttpClient(context);
    client.badCertificateCallback = (_, __, ___) => true;
    return client;
  }
}
