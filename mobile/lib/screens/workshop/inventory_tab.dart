import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/screens/workshop/part_detail_screen.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_search.dart';

class InventoryTab extends StatefulWidget {
  const InventoryTab({super.key});

  @override
  State<InventoryTab> createState() => _InventoryTabState();
}

class _InventoryTabState extends State<InventoryTab> {
  final _db = DatabaseService();
  List<Map<String, dynamic>> _parts = [];
  List<Map<String, dynamic>> _filteredParts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadInventory();
  }

  Future<void> _loadInventory() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query('inventory', orderBy: 'name ASC');
    setState(() { _parts = maps; _filteredParts = maps; _isLoading = false; });
  }

  void _filterParts(String query) {
    setState(() {
      _filteredParts = _parts.where((part) {
        final name = part['name']?.toString().toLowerCase() ?? "";
        final category = part['category']?.toString().toLowerCase() ?? "";
        return name.contains(query.toLowerCase()) || category.contains(query.toLowerCase());
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
              FadeInDown(child: KineticHeader(title: 'Logística / Repuestos', subtitle: 'Gestión Stock', color: const Color(0xFF3B82F6), trailing: IconButton.filled(onPressed: () {}, icon: const Icon(LucideIcons.package_plus), style: IconButton.styleFrom(backgroundColor: const Color(0xFF0F172A))))),
              const SizedBox(height: 24),
              KineticSearch(onChanged: _filterParts, hint: 'Filtrar repuestos, aceites, frenos...', icon: LucideIcons.package_search),
              const SizedBox(height: 16),
              Expanded(child: _buildInventoryList()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInventoryList() {
    if (_isLoading) return const Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6)));
    if (_filteredParts.isEmpty) return const Center(child: Text('Sin existencias bajo este radar.'));

    return ListView.separated(
      itemCount: _filteredParts.length,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final part = _filteredParts[index];
        final qty = part['quantity'] ?? 0;
        final isLow = qty < 5;

        return FadeInUp(
          delay: Duration(milliseconds: index * 50),
          child: InkWell(
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => PartDetailScreen(part: part))),
            borderRadius: BorderRadius.circular(24),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.slate.shade100)),
              child: Row(
                children: [
                  Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
                    child: Icon(LucideIcons.package, color: isLow ? Colors.redAccent : const Color(0xFF3B82F6), size: 20),
                  ),
                  const SizedBox(width: 16),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(part['name'] ?? 'Repuesto', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                    Text('Stock: $qty unidades • \$${part['price']}', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: const Color(0xFF3B82F6))),
                  ])),
                  const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFF94A3B8)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
