import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/screens/workshop/part_detail_screen.dart';
import 'package:workshops_mobile/screens/workshop/edit_part_screen.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_search.dart';

class InventoryTab extends StatefulWidget {
  const InventoryTab({super.key});

  @override
  State<InventoryTab> createState() => _InventoryTabState();
}

class _InventoryTabState extends State<InventoryTab> {
  final _workshopService = WorkshopService();
  List<dynamic> _parts = [];
  List<dynamic> _filteredParts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadInventory();
  }

  Future<void> _loadInventory() async {
    setState(() => _isLoading = true);
    final data = await _workshopService.getInventory();
    if (mounted) {
      setState(() {
        _parts = data;
        _filteredParts = data;
        _isLoading = false;
      });
    }
  }

  void _filterParts(String query) {
    setState(() {
      _filteredParts = _parts.where((part) {
        final name = (part['name'] ?? "").toString().toLowerCase();
        final sku = (part['sku'] ?? "").toString().toLowerCase();
        final category = (part['category']?['name'] ?? "").toString().toLowerCase();
        return name.contains(query.toLowerCase()) || 
               sku.contains(query.toLowerCase()) || 
               category.contains(query.toLowerCase());
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadInventory,
          color: const Color(0xFF3B82F6),
          child: CustomScrollView(
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.all(24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    FadeInDown(
                      child: KineticHeader(
                        title: 'LOGÍSTICA / REPUESTOS', 
                        subtitle: 'Gestión de Stock Centralizado',
                        color: const Color(0xFF3B82F6),
                        trailing: IconButton.filled(
                          onPressed: () => Navigator.push(
                            context, 
                            MaterialPageRoute(builder: (_) => const EditPartScreen())
                          ).then((_) => _loadInventory()),
                          icon: const Icon(LucideIcons.package_plus, size: 20),
                          style: IconButton.styleFrom(
                            backgroundColor: const Color(0xFF0F172A),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    KineticSearch(
                      onChanged: _filterParts, 
                      hint: 'Filtrar por nombre, SKU o categoría...', 
                      icon: LucideIcons.package_search
                    ),
                    const SizedBox(height: 24),
                  ]),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                sliver: _isLoading 
                  ? const SliverFillRemaining(child: Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6))))
                  : _filteredParts.isEmpty
                    ? SliverFillRemaining(
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(LucideIcons.package_x, size: 48, color: const Color(0xFFCBD5E1)),
                              const SizedBox(height: 16),
                              Text('No hay repuestos en stock', style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      )
                    : SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) => _buildInventoryItem(index),
                          childCount: _filteredParts.length,
                        ),
                      ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInventoryItem(int index) {
    final part = _filteredParts[index];
    final qty = (part['quantity'] as num?)?.toDouble() ?? 0.0;
    final isLow = qty < 5;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: FadeInUp(
        delay: Duration(milliseconds: index * 50),
        child: InkWell(
          onTap: () => Navigator.push(
            context, 
            MaterialPageRoute(builder: (_) => PartDetailScreen(part: part))
          ).then((_) => _loadInventory()),
          borderRadius: BorderRadius.circular(24),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white, 
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFF1F5F9))
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12), 
                  decoration: BoxDecoration(
                    color: isLow ? Colors.red.withOpacity(0.05) : const Color(0xFFF1F5F9), 
                    borderRadius: BorderRadius.circular(16)
                  ),
                  child: Icon(
                    LucideIcons.package, 
                    color: isLow ? Colors.redAccent : const Color(0xFF3B82F6), 
                    size: 20
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start, 
                    children: [
                      Text(
                        part['name'] ?? 'Repuesto', 
                        style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))
                      ),
                      Text(
                        'SKU: ${part['sku'] ?? 'N/A'} • ${part['category']?['name'] ?? 'Gral'}', 
                        style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 0.5)
                      ),
                    ]
                  )
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '\$${part['price'] ?? '0'}', 
                      style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))
                    ),
                    Text(
                      '${qty.toInt()} UND', 
                      style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: isLow ? Colors.redAccent : const Color(0xFF10B981))
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
