import 'dart:convert';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class SalesService {
  final ApiClient _api = ApiClient();
  final DatabaseService _db = DatabaseService();

  // Registrar venta/trabajo Offline
  Future<void> createWorkOrder(Map<String, dynamic> saleData) async {
    final database = await _db.database;
    await database.insert('works', {
      ...saleData,
      'id': DateTime.now().millisecondsSinceEpoch.toString(), // ID provisional local
      'created_at': DateTime.now().toIso8601String(),
      'sync_status': 0 // 0: Pendiente de sincronizar
    });
  }

  // Ver ventas Offline-First
  Future<List<Map<String, dynamic>>> getSalesHistory() async {
    final database = await _db.database;
    return await database.query('works', orderBy: 'created_at DESC');
  }

  // Podemos agregar lógica de "sync single order" si vuelve la red al instante
}
