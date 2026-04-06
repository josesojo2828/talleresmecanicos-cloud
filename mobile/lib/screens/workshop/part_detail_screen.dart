import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/widgets/kinetic_card.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';

class PartDetailScreen extends StatelessWidget {
  final Map<String, dynamic> part;
  const PartDetailScreen({super.key, required this.part});

  @override
  Widget build(BuildContext context) {
    final qty = part['quantity'] ?? 0;
    final isLow = qty < 5;

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: Text('FICHA TÉCNICA REPUESTO', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A), elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            FadeInDown(child: KineticStatusHeader(title: part['category']?.toUpperCase() ?? 'Insumos', subtitle: part['name'] ?? 'Repuesto', icon: LucideIcons.boxes, statusColor: isLow ? Colors.redAccent : const Color(0xFF10B981))),
            const SizedBox(height: 24),
            FadeInUp(delay: const Duration(milliseconds: 200), child: KineticCard(title: 'Telemetría de Almacén', icon: LucideIcons.hard_drive, color: isLow ? Colors.redAccent : const Color(0xFF10B981), children: [
              KineticDataRow(label: 'Stock Actual', value: '$qty UNIDADES', valueColor: isLow ? Colors.redAccent : const Color(0xFF0F172A)),
              KineticDataRow(label: 'ID de Inventario', value: part['id']?.toString().substring(0,8) ?? 'SKU-000'),
            ])),
            const SizedBox(height: 16),
            FadeInUp(delay: const Duration(milliseconds: 400), child: KineticCard(title: 'Valor Comercial', icon: LucideIcons.tag, children: [
              KineticDataRow(label: 'Precio de Venta', value: '\$${part['price'] ?? 0}', valueColor: const Color(0xFF10B981)),
              KineticDataRow(label: 'Moneda', value: 'Dólares (USD)'),
            ])),
          ],
        ),
      ),
    );
  }
}
