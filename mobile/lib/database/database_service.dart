import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  static Database? _database;

  factory DatabaseService() => _instance;
  DatabaseService._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'workshop_v5_support.db');
    return await openDatabase(
      path,
      version: 3,
      onCreate: (db, version) async {
        await db.execute('CREATE TABLE finance_cache (id TEXT PRIMARY KEY, data TEXT, last_updated TEXT)');
        await db.execute('CREATE TABLE inventory (id TEXT PRIMARY KEY, name TEXT, sku TEXT, price REAL, quantity INTEGER, category TEXT, currency TEXT, description TEXT, sync_status INTEGER DEFAULT 1)');
        await db.execute('CREATE TABLE works (id TEXT PRIMARY KEY, client_id TEXT, workshop_client_id TEXT, title TEXT, car_info TEXT, client_name TEXT, client_phone TEXT, labor_price REAL, parts_price REAL, total_price REAL, currency TEXT, status TEXT, created_at TEXT, sync_status INTEGER DEFAULT 1)');
        await db.execute('CREATE TABLE clients (id TEXT PRIMARY KEY, first_name TEXT, last_name TEXT, phone TEXT, email TEXT, sync_status INTEGER DEFAULT 1)');
        await db.execute('CREATE TABLE workshop_settings (id TEXT PRIMARY KEY, name TEXT, slug TEXT, address TEXT, phone TEXT, logo_url TEXT, sync_status INTEGER DEFAULT 1)');
        await db.execute('CREATE TABLE support_stats_cache (id TEXT PRIMARY KEY, data TEXT, last_updated TEXT)');
        await db.execute('CREATE TABLE workshops_list (id TEXT PRIMARY KEY, name TEXT, slug TEXT, owner_name TEXT, status TEXT, is_active INTEGER DEFAULT 1)');
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          try {
            await db.execute('ALTER TABLE works ADD COLUMN title TEXT');
            await db.execute('ALTER TABLE works ADD COLUMN client_name TEXT');
            await db.execute('ALTER TABLE works ADD COLUMN client_phone TEXT');
            await db.execute('ALTER TABLE works ADD COLUMN currency TEXT');
            await db.execute('ALTER TABLE inventory ADD COLUMN sku TEXT');
            await db.execute('ALTER TABLE inventory ADD COLUMN currency TEXT');
            await db.execute('ALTER TABLE inventory ADD COLUMN description TEXT');
          } catch (e) {}
        }
        if (oldVersion < 3) {
           try {
             await db.execute('ALTER TABLE works ADD COLUMN workshop_client_id TEXT');
           } catch (e) {}
        }
      },
    );
  }

  Future<void> saveFinanceCache(Map<String, dynamic> data) async {
    final db = await database;
    await db.insert(
      'finance_cache',
      {
        'id': 'main_finance',
        'data': jsonEncode(data),
        'last_updated': DateTime.now().toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<Map<String, dynamic>?> getFinanceCache() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'finance_cache',
      where: 'id = ?',
      whereArgs: ['main_finance'],
    );
    if (maps.isNotEmpty) {
      return jsonDecode(maps.first['data']);
    }
    return null;
  }

  Future<void> saveSupportStats(Map<String, dynamic> data) async {
    final db = await database;
    await db.insert('support_stats_cache', {'id': 'global_stats', 'data': jsonEncode(data), 'last_updated': DateTime.now().toIso8601String()}, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<Map<String, dynamic>?> getSupportStats() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query('support_stats_cache', where: 'id = ?', whereArgs: ['global_stats']);
    return maps.isNotEmpty ? jsonDecode(maps.first['data']) : null;
  }
}
