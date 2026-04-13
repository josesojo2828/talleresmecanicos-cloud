import 'dart:convert';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class WorkshopService {
  final ApiClient _api = ApiClient();
  final DatabaseService _db = DatabaseService();

  // Módulo de Dashboard Offline-First
  Future<Map<String, dynamic>?> getDashboardData() async {
    // 1. Siempre intentamos devolver lo que ya está en Boxes (Cache Local)
    final cacheData = await _db.getFinanceCache();
    
    // 2. Si hay conexión, refrescamos enBoxes para la próxima y para mostrar ahora
    final connectivityResult = await Connectivity().checkConnectivity();
    if (!connectivityResult.contains(ConnectivityResult.none)) {
      try {
        final response = await _api.get('/workshop/finance/stats');
        if (response.statusCode == 200) {
          final freshData = jsonDecode(response.body)['body'];
          await _db.saveFinanceCache(freshData);
          return freshData; // Devolvemos data fresca si pudimos conectar
        }
      } catch (e) {
        // Silenciamos error de red, seguimos con el cache
        print('Error de sincronización silenciosa: $e');
      }
    }

    return cacheData; // Devolvemos cache si no hay red o falló el fetch
  }

  // Módulo de Directorio Público
  Future<List<dynamic>> getWorkshops({String? country, String? city}) async {
    try {
      String query = '';
      if (country != null) query += '?country=$country';
      if (city != null) query += '${query.isEmpty ? '?' : '&'}city=$city';

      final response = await _api.get('/public/workshops$query');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return decoded['body']?['data'] ?? decoded['data'] ?? [];
      }
      return [];
    } catch (e) {
      print('Error cargando directorio: $e');
      return [];
    }
  }

  Future<List<dynamic>> getCountries() async {
    try {
      final response = await _api.get('/public/locations/countries');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return decoded['body']?['data'] ?? decoded['data'] ?? [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<List<dynamic>> getCities(String country) async {
    try {
      final response = await _api.get('/public/locations/cities?country=$country');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return decoded['body']?['data'] ?? decoded['data'] ?? [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // --- CRUD local pendiente de sincronización ---
  // Podemos implementar el guardado de órdenes offline acá...

  Future<bool> createAppointment(String workshopId, DateTime dateTime, String description) async {
    try {
      final response = await _api.post('/appointment', {
        'workshopId': workshopId,
        'dateTime': dateTime.toIso8601String(),
        'description': description,
      });
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error creando cita: $e');
      return false;
    }
  }
}
