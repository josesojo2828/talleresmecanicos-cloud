import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/widgets/kinetic_card.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/screens/workshop/edit_part_screen.dart';

class PartDetailScreen extends StatefulWidget {
  final Map<String, dynamic> part;
  const PartDetailScreen({super.key, required this.part});

  @override
  State<PartDetailScreen> createState() => _PartDetailScreenState();
}

class _PartDetailScreenState extends State<PartDetailScreen> {
  late Map<String, dynamic> _part;
  bool _isSummary = true;

  @override
  void initState() {
    super.initState();
    _part = widget.part;
  }

  @override
  Widget build(BuildContext context) {
    final qty = (_part['quantity'] as num?)?.toDouble() ?? 0.0;
    final price = (_part['price'] as num?)?.toDouble() ?? 0.0;
    final totalValue = qty * price;

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverPadding(
            padding: const EdgeInsets.all(24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildInsightGrid(price, qty, totalValue),
                const SizedBox(height: 24),
                _buildSpecificationsSection(),
                const SizedBox(height: 24),
                _buildStatusSection(),
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 180,
      backgroundColor: Colors.white,
      pinned: true,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(LucideIcons.chevron_left, color: Color(0xFF0F172A)),
        onPressed: () => Navigator.pop(context),
      ),
      actions: [
        _buildMenuButton('RESUMEN', _isSummary, () => setState(() => _isSummary = true)),
        _buildMenuButton('AJUSTES', !_isSummary, () {
           Navigator.push(context, MaterialPageRoute(builder: (_) => EditPartScreen(part: _part))).then((val) {
             if (val != null) setState(() => _part = val);
           });
        }),
        const SizedBox(width: 16),
      ],
      flexibleSpace: FlexibleSpaceBar(
        centerTitle: false,
        titlePadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(6)),
                  child: const Icon(LucideIcons.package, size: 10, color: Colors.white),
                ),
                const SizedBox(width: 8),
                Text('INVENTARIO DE REPUESTOS', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: const Color(0xFF10B981), letterSpacing: 0.5)),
              ],
            ),
            Text('SKU: ${_part['sku'] ?? 'N/A'}', style: GoogleFonts.outfit(fontSize: 8, color: const Color(0xFF64748B), fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuButton(String label, bool active, VoidCallback onTap) {
    return Center(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          margin: const EdgeInsets.only(left: 8),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: active ? const Color(0xFFF1F5F9) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: active ? const Color(0xFFCBD5E1) : Colors.transparent),
          ),
          child: Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: active ? const Color(0xFF0F172A) : const Color(0xFF94A3B8))),
        ),
      ),
    );
  }

  Widget _buildInsightGrid(double price, double qty, double totalValue) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _buildInsightCard('PRECIO UNITARIO', '\$$price', LucideIcons.dollar_sign, const Color(0xFF0F172A), isDark: true)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                children: [
                  _buildInsightCard('STOCK ACTUAL', '${qty.toInt()} UNIDADES', LucideIcons.trending_up, Colors.white),
                  const SizedBox(height: 16),
                  _buildInsightCard('PATRIMONIO EN ARTÍCULO', '\$${totalValue.toInt()}', LucideIcons.trending_up, Colors.white),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildInsightCard(String label, String value, IconData icon, Color bg, {bool isDark = false}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(24),
        border: bg == Colors.white ? Border.all(color: const Color(0xFFF1F5F9)) : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: isDark ? Colors.white.withOpacity(0.1) : const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
            child: Icon(icon, color: isDark ? const Color(0xFF10B981) : const Color(0xFF64748B), size: 16),
          ),
          const SizedBox(height: 16),
          Text(label, style: GoogleFonts.outfit(fontSize: 8, fontWeight: FontWeight.w900, color: isDark ? Colors.white38 : const Color(0xFF94A3B8), letterSpacing: 1)),
          Text(value, style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        ],
      ),
    );
  }

  Widget _buildSpecificationsSection() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32), border: Border.all(color: const Color(0xFFF1F5F9))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(_part['name']?.toUpperCase() ?? 'REPUESTO', style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
          const SizedBox(height: 16),
          _buildDetailRow(LucideIcons.info, 'FICHA TÉCNICA / DESCRIPCIÓN', _part['description'] ?? 'Sin descripción registrada.'),
          const Divider(height: 48),
          _buildHeading(LucideIcons.layers, 'ESPECIFICACIONES'),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildSmallDetail('MARCA / PROVEEDOR', 'ORIGINAL')),
              Expanded(child: _buildSmallDetail('CATEGORÍA', _part['category']?['name']?.toUpperCase() ?? 'MOTOR')),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusSection() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.05), borderRadius: BorderRadius.circular(24)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('ESTATUS CONTABLE', style: GoogleFonts.outfit(fontSize: 8, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
              Text('ACTIVO / DISPONIBLE', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF10B981))),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
            child: const Icon(LucideIcons.shopping_cart, color: Color(0xFF10B981), size: 18),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(children: [Icon(icon, size: 12, color: const Color(0xFF94A3B8)), const SizedBox(width: 8), Text(label, style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1))]),
        const SizedBox(height: 12),
        Text(value, style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFF64748B), height: 1.5)),
      ],
    );
  }

  Widget _buildHeading(IconData icon, String title) {
    return Row(children: [Icon(icon, size: 14, color: const Color(0xFF94A3B8)), const SizedBox(width: 8), Text(title, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1))]);
  }

  Widget _buildSmallDetail(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(right: 8),
      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: GoogleFonts.outfit(fontSize: 7, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
          const SizedBox(height: 4),
          Text(value, style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
        ],
      ),
    );
  }
}
