import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'dart:convert';

class SyncService {
  final _db = DatabaseService();
  final _api = ApiClient();

  void init() {
    _startSyncRadar();
  }

  void _startSyncRadar() {
    Connectivity().onConnectivityChanged.listen((List<ConnectivityResult> results) {
      if (results.isNotEmpty && results.first != ConnectivityResult.none) {
        _syncPendingData();
      }
    });
  }

  Future<void> _syncPendingData() async {
    final db = await _db.database;
    
    final List<Map<String, dynamic>> pendingWorks = await db.query('works', where: 'sync_status = ?', whereArgs: [0]);
    for (var work in pendingWorks) {
      try {
        final res = await _api.post('/job', {
          'carInfo': work['car_info'],
          'laborPrice': work['labor_price'],
          'partsPrice': work['parts_price'],
          'totalPrice': work['total_price'],
          'status': work['status'],
        });
        if (res.statusCode == 201) {
          await db.update('works', {'sync_status': 1}, where: 'id = ?', whereArgs: [work['id']]);
        }
      } catch (e) {
        print('Sync work failed: $e');
      }
    }

    final List<Map<String, dynamic>> pendingSettings = await db.query('workshop_settings', where: 'sync_status = ?', whereArgs: [0]);
    for (var setting in pendingSettings) {
      try {
        final res = await _api.put('/workshop/${setting['id']}', {
          'name': setting['name'],
          'address': setting['address'],
          'phone': setting['phone'],
        });
        if (res.statusCode == 200) {
          await db.update('workshop_settings', {'sync_status': 1}, where: 'id = ?', whereArgs: [setting['id']]);
        }
      } catch (e) {
        print('Sync settings failed: $e');
      }
    }
  }
}
