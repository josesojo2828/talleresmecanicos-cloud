import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/pdf_service.dart';
import 'package:workshops_mobile/widgets/kinetic_card.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';

class JobDetailScreen extends StatelessWidget {
  final Map<String, dynamic> job;
  const JobDetailScreen({super.key, required this.job});

  @override
  Widget build(BuildContext context) {
    final pdfService = PdfService();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('DETALLES DE REPARACIÓN', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A), elevation: 0,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => pdfService.generateJobInvoice(job),
        backgroundColor: const Color(0xFF10B981),
        icon: const Icon(LucideIcons.file_text, color: Colors.white),
        label: Text('EXPORTAR FACTURA', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            // FIX: check instead of check_circle
            FadeInDown(child: KineticStatusHeader(title: job['status'] ?? 'Pendiente', subtitle: 'ORDEN #${job['id']?.toString().substring(0,6) ?? 'ID'}', icon: LucideIcons.check, statusColor: const Color(0xFF10B981))),
            const SizedBox(height: 24),
            FadeInUp(delay: const Duration(milliseconds: 200), child: KineticCard(title: 'Información del Bólido', icon: LucideIcons.car, children: [
              KineticDataRow(label: 'Vehículo', value: job['car_info'] ?? 'No especificado'),
              KineticDataRow(label: 'Fecha de Ingreso', value: job['created_at']?.split('T').first ?? 'Reciente'),
            ])),
            const SizedBox(height: 16),
            FadeInUp(delay: const Duration(milliseconds: 400), child: KineticCard(title: 'Presupuesto Técnico', icon: LucideIcons.receipt_text, children: [
              KineticDataRow(label: 'Mano de Obra', value: '\$${job['labor_price'] ?? 0}'),
              KineticDataRow(label: 'Insumos e Repuestos', value: '\$${job['parts_price'] ?? 0}'),
              const Divider(height: 32),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text('TOTAL FINAL', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 18)),
                Text('\$${job['total_price'] ?? 0}', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 18, color: const Color(0xFF10B981))),
              ]),
            ])),
            const SizedBox(height: 48),
            if (job['sync_status'] == 0) FadeIn(child: _buildSyncAlert()),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }

  Widget _buildSyncAlert() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
      child: Row(children: [
        const Icon(LucideIcons.cloud_off, color: Colors.orange, size: 18),
        const SizedBox(width: 12),
        Expanded(child: Text('Esta ficha reside solo en el bólido local. Pendiente de Hangares Centrales.', style: GoogleFonts.outfit(fontSize: 11, color: Colors.orange.shade900, fontWeight: FontWeight.w600))),
      ]),
    );
  }
}
