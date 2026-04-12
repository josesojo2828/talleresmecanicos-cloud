import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sqflite/sqflite.dart';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:workshops_mobile/screens/support/workshop_detail_screen.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_search.dart';
import 'dart:convert';

class SupportWorkshopsTab extends StatefulWidget {
  const SupportWorkshopsTab({super.key});

  @override
  State<SupportWorkshopsTab> createState() => _SupportWorkshopsTabState();
}

class _SupportWorkshopsTabState extends State<SupportWorkshopsTab> {
  final _api = ApiClient();
  final _db = DatabaseService();
  List<Map<String, dynamic>> _workshops = [];
  List<Map<String, dynamic>> _filteredWorkshops = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadWorkshops();
  }

  Future<void> _loadWorkshops() async {
    setState(() => _isLoading = true);
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query('workshops_list');
    if (maps.isNotEmpty) {
      if (mounted) setState(() { _workshops = maps; _filteredWorkshops = maps; _isLoading = false; });
    }

    try {
      final response = await _api.get('/workshop');
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        final List data = responseData['data'] ?? [];
        final List<Map<String, dynamic>> updatedList = [];
        for (var w in data) {
          final mapped = {
            'id': w['id'].toString(), 'name': w['name'], 'slug': w['slug'],
            'owner_name': w['user']?['firstName'] ?? 'Sin dueño',
            'status': w['status'] ?? 'ACTIVE',
            'address': w['address'] ?? 'Sin dirección'
          };
          updatedList.add(mapped);
          await db.insert('workshops_list', mapped, conflictAlgorithm: ConflictAlgorithm.replace);
        }
        if (mounted) setState(() { _workshops = updatedList; _filteredWorkshops = updatedList; _isLoading = false; });
      }
    } catch (e) {
      print('Load workshops failed: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _filterWorkshops(String query) {
    setState(() {
      _filteredWorkshops = _workshops.where((w) {
        final name = w['name']?.toString().toLowerCase() ?? "";
        final slug = w['slug']?.toString().toLowerCase() ?? "";
        return name.contains(query.toLowerCase()) || slug.contains(query.toLowerCase());
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(child: const KineticHeader(title: 'Seguridad / Fleet', subtitle: 'Terminales en Red', color: const Color(0xFF3B82F6))),
              const SizedBox(height: 24),
              KineticSearch(onChanged: _filterWorkshops, hint: 'Buscar taller o slug @...', icon: LucideIcons.shield),
              const SizedBox(height: 16),
              Expanded(child: _buildWorkshopList()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWorkshopList() {
    if (_filteredWorkshops.isEmpty && !_isLoading) return const Center(child: Text('Sin terminales en el radar.'));

    return RefreshIndicator(
      onRefresh: _loadWorkshops,
      color: const Color(0xFF3B82F6),
      child: ListView.separated(
        itemCount: _filteredWorkshops.length,
        separatorBuilder: (context, index) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final w = _filteredWorkshops[index];
          final isActive = w['status'] == 'ACTIVE' || w['status'] == 'APPROVED';

          return FadeInUp(
            delay: Duration(milliseconds: index * 50),
            child: InkWell(
              onTap: () async {
                await Navigator.push(context, MaterialPageRoute(builder: (_) => WorkshopDetailScreen(workshop: w)));
                _loadWorkshops();
              },
              borderRadius: BorderRadius.circular(24),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), 
                  // FIX: Border.all with named color
                  border: Border.all(color: const Color(0xFFF1F5F9))),
                child: Row(
                  children: [
                    CircleAvatar(backgroundColor: isActive ? const Color(0xFF10B981).withOpacity(0.1) : Colors.redAccent.withOpacity(0.1), child: Icon(LucideIcons.warehouse, color: isActive ? const Color(0xFF10B981) : Colors.redAccent, size: 20)),
                    const SizedBox(width: 16),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(w['name'] ?? 'Taller', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                      Text('Responsable: ${w['owner_name']}', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8))),
                    ])),
                    const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFF94A3B8)),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
