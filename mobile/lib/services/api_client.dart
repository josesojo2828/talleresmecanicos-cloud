import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  // Centralizamos la URL base de tu taller
  static const String baseUrl = 'http://10.0.2.2:3001';

  final http.Client _client = http.Client();

  // Helper para armar los headers con el Token de una
  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');
    
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Método POST genérico con inyección de headers
  Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    return await _client.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  // Método GET genérico
  Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    return await _client.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );
  }

  // Método PUT
  Future<http.Response> put(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    return await _client.put(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  // Método DELETE
  Future<http.Response> delete(String endpoint) async {
    final headers = await _getHeaders();
    return await _client.delete(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );
  }
}
