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

  Future<Map<String, dynamic>?> getFullDashboardStats() async {
    try {
      print('########## API CALL START: /my-workshop/dashboard-stats');
      final response = await _api.get('/my-workshop/dashboard-stats').timeout(const Duration(seconds: 10));
      print('########## API RESPONSE STATUS: ${response.statusCode}');
      if (response.statusCode == 200) {
        return jsonDecode(response.body)['body'];
      }
      return null;
    } catch (e) {
      print('########## API ERROR/TIMEOUT: $e');
      return null;
    }
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

  Future<bool> createAppointment(String workshopId, DateTime dateTime, String description, {String status = 'PENDING'}) async {
    try {
      final response = await _api.post('/appointment', {
        'workshopId': workshopId,
        'dateTime': dateTime.toIso8601String(),
        'description': description,
        'status': status,
      });
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error creando cita: $e');
      return false;
    }
  }

  Future<bool> createAppointmentStatus(DateTime dateTime, String description, String status) async {
    try {
      // El backend deduce el workshopId del token del usuario taller
      final response = await _api.post('/appointment', {
        'dateTime': dateTime.toIso8601String(),
        'description': description,
        'status': status,
      });
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error creando entrada de cita: $e');
      return false;
    }
  }

  Future<bool> updateAppointment(String id, Map<String, dynamic> data) async {
    try {
      final response = await _api.put('/appointment/$id', data);
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      print('Error actualizando cita: $e');
      return false;
    }
  }

  // --- Módulo Gestión de Perfil de Taller ---

  Future<Map<String, dynamic>?> getMyWorkshop() async {
    try {
      final response = await _api.get('/my-workshop');
      if (response.statusCode == 200) {
        return jsonDecode(response.body)['body'];
      }
      return null;
    } catch (e) {
      print('Error obteniendo taller: $e');
      return null;
    }
  }

  Future<bool> updateWorkshop(Map<String, dynamic> data) async {
    try {
      final response = await _api.put('/my-workshop', data);
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      print('Error actualizando taller: $e');
      return false;
    }
  }

  // --- Módulo Inventario / Partes ---

  Future<List<dynamic>> getInventory() async {
    try {
      final response = await _api.get('/part');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        // El backend de partes parece devolver { body: { data: [...] } }
        return decoded['body']?['data'] ?? [];
      }
      return [];
    } catch (e) {
      print('Error cargando inventario: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>?> getPartById(String id) async {
    try {
      final response = await _api.get('/part/$id');
      if (response.statusCode == 200) {
        return jsonDecode(response.body)['body'];
      }
      return null;
    } catch (e) {
      print('Error cargando detalle de parte: $e');
      return null;
    }
  }

  Future<bool> createPart(Map<String, dynamic> data) async {
    try {
      final response = await _api.post('/part', data);
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error creando parte: $e');
      return false;
    }
  }

  Future<bool> updatePart(String id, Map<String, dynamic> data) async {
    try {
      final response = await _api.put('/part/$id', data);
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      print('Error actualizando parte: $e');
      return false;
    }
  }

  Future<List<dynamic>> getPartCategories() async {
    try {
      final response = await _api.get('/part/category/all');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return decoded['body']?['data'] ?? [];
      }
      return [];
    } catch (e) {
      print('Error cargando categorías: $e');
      return [];
    }
  }

  Future<List<dynamic>> getAppointments() async {
    try {
      final response = await _api.get('/appointment');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return decoded['body']?['data'] ?? [];
      }
      return [];
    } catch (e) {
      print('Error cargando citas: $e');
      return [];
    }
  }
}
