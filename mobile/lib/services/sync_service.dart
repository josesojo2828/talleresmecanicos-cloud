import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class SyncService {
  static final SyncService _instance = SyncService._internal();
  factory SyncService() => _instance;
  SyncService._internal();

  final _dbService = DatabaseService();
  final _apiClient = ApiClient();
  Timer? _timer;

  void startSync() {
    _timer = Timer.periodic(const Duration(seconds: 30), (timer) async {
      final connectivity = await Connectivity().checkConnectivity();
      if (!connectivity.contains(ConnectivityResult.none)) {
        await _syncPendingData();
      }
    });
  }

  Future<void> _syncPendingData() async {
    final db = await _dbService.database;

    // 1. Sincronizar Trabajos (Orders)
    final List<Map<String, dynamic>> pendingWorks = await db.query('works', where: 'sync_status = 0');
    for (var work in pendingWorks) {
      try {
        final response = await _apiClient.post('/work', {
          'carInfo': work['car_info'],
          'laborPrice': work['labor_price'],
          'partsPrice': work['parts_price'],
          'totalPrice': work['total_price'],
          'status': work['status'],
          'clientId': work['client_id'],
        });
        if (response.statusCode == 201) {
          await db.update('works', {'sync_status': 1}, where: 'id = ?', whereArgs: [work['id']]);
          print('Work synced: ${work['car_info']}');
        }
      } catch (e) {
        print('Sync work failed: $e');
      }
    }

    // 2. Sincronizar Inventario (Parts)
    final List<Map<String, dynamic>> pendingParts = await db.query('inventory', where: 'sync_status = 0');
    for (var part in pendingParts) {
      try {
        final response = await _apiClient.post('/inventory', {
          'name': part['name'],
          'quantity': part['quantity'],
          'price': part['price'],
          'category': part['category'],
        });
        if (response.statusCode == 201) {
          await db.update('inventory', {'sync_status': 1}, where: 'id = ?', whereArgs: [part['id']]);
          print('Part synced: ${part['name']}');
        }
      } catch (e) {
        print('Sync part failed: $e');
      }
    }

    // 3. Sincronizar Identidad del Taller (Settings)
    final List<Map<String, dynamic>> pendingSettings = await db.query('workshop_settings', where: 'sync_status = 0');
    if (pendingSettings.isNotEmpty) {
      final settings = pendingSettings.first;
      final prefs = await SharedPreferences.getInstance();
      final workshopId = prefs.getString('workshop_id');
      
      if (workshopId != null) {
        try {
          final response = await _apiClient.put('/workshop/$workshopId', {
            'name': settings['name'],
            'address': settings['address'],
            'phone': settings['phone'],
            'logo': settings['logo'],
          });
          if (response.statusCode == 200) {
            await db.update('workshop_settings', {'sync_status': 1}, where: 'id = ?', whereArgs: [settings['id']]);
            print('Workshop Identity synced: ${settings['name']}');
          }
        } catch (e) {
          print('Sync workshop settings failed: $e');
        }
      }
    }
  }

  void stopSync() {
    _timer?.cancel();
  }
}
