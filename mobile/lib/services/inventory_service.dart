import 'dart:convert';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class InventoryService {
  final ApiClient _api = ApiClient();
  final DatabaseService _db = DatabaseService();

  // Obtener stock Offline-First
  Future<List<Map<String, dynamic>>> getParts() async {
    final database = await _db.database;
    
    // 1. Siempre le mostramos lo que tenemos en mano (Local)
    final List<Map<String, dynamic>> localParts = await database.query('inventory');
    
    // 2. Si hay señal, refrescamos para el futuro
    final connectivityResult = await Connectivity().checkConnectivity();
    if (!connectivityResult.contains(ConnectivityResult.none)) {
      try {
        final response = await _api.get('/workshop/inventory'); // Ajustar endpoint según backend
        if (response.statusCode == 200) {
          final List freshData = jsonDecode(response.body);
          for (var item in freshData) {
            await database.insert('inventory', {
              'id': item['id'], 'name': item['name'], 'price': item['price'], 'quantity': item['quantity']
            }, conflictAlgorithm: ConflictAlgorithm.replace);
          }
        }
      } catch (e) { print('Sync silent inventory failed: $e'); }
    }
    
    return localParts;
  }

  // Agregar repuesto Offline
  Future<void> addPartOffline(Map<String, dynamic> partData) async {
    final database = await _db.database;
    await database.insert('inventory', {
      'id': DateTime.now().millisecondsSinceEpoch.toString(), // ID provisional local
      ...partData,
      'sync_status': 0 // 0: Pendiente de subir
    });
  }
}
