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
    
    // --- 1. Sincronizar Trabajos (Works) ---
    final List<Map<String, dynamic>> pendingWorks = await db.query('works', where: 'sync_status = ?', whereArgs: [0]);
    for (var work in pendingWorks) {
      try {
        final res = await _api.post('/work', {
          'title': work['title'] ?? 'Trabajo sin título',
          'clientName': work['client_name'],
          'clientPhone': work['client_phone'],
          'workshopClientId': work['workshop_client_id'], // Nuevo campo
          'vehicleLicensePlate': work['car_info'], // Usamos car_info como patente
          'laborPrice': work['labor_price'],
          'currency': work['currency'] ?? 'USD',
          'status': work['status'] ?? 'OPEN',
          'description': 'Generado desde Kinetic Mobile App',
        });
        
        if (res.statusCode == 201 || res.statusCode == 200) {
          await db.update('works', {'sync_status': 1}, where: 'id = ?', whereArgs: [work['id']]);
          print('########## SYNC SUCCESS: Work ${work['id']}');
        } else {
          print('########## SYNC FAILED (Work): ${res.statusCode} - ${res.body}');
        }
      } catch (e) {
        print('Sync work failed: $e');
      }
    }

    // --- 2. Sincronizar Repuestos (Inventory) ---
    final List<Map<String, dynamic>> pendingParts = await db.query('inventory', where: 'sync_status = ?', whereArgs: [0]);
    for (var part in pendingParts) {
      try {
        final res = await _api.post('/part', {
          'name': part['name'],
          'sku': part['sku'],
          'price': part['price'],
          'quantity': part['quantity'],
          'currency': part['currency'] ?? 'USD',
          'description': part['description'],
        });
        if (res.statusCode == 201 || res.statusCode == 200) {
          await db.update('inventory', {'sync_status': 1}, where: 'id = ?', whereArgs: [part['id']]);
          print('########## SYNC SUCCESS: Part ${part['id']}');
        } else {
          print('########## SYNC FAILED (Part): ${res.statusCode} - ${res.body}');
        }
      } catch (e) {
        print('Sync part failed: $e');
      }
    }

    // --- 3. Perfil del Taller (Workshop Settings) ---
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

    // --- 4. Descargar Clientes (Workshop Clients) ---
    try {
      final res = await _api.get('/workshop-client');
      if (res.statusCode == 200) {
        final List clientsData = jsonDecode(res.body)['data'] ?? [];
        for (var client in clientsData) {
          await db.insert('clients', {
            'id': client['id'],
            'first_name': client['name'],
            'phone': client['phone'],
            'email': client['email'],
            'sync_status': 1
          }, conflictAlgorithm: ConflictAlgorithm.replace);
        }
      }
    } catch (e) {
      print('Download clients failed: $e');
    }
  }
}
