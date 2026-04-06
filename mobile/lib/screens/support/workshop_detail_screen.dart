import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:workshops_mobile/widgets/kinetic_card.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';

class WorkshopDetailScreen extends StatefulWidget {
  final Map<String, dynamic> workshop;
  const WorkshopDetailScreen({super.key, required this.workshop});

  @override
  State<WorkshopDetailScreen> createState() => _WorkshopDetailScreenState();
}

class _WorkshopDetailScreenState extends State<WorkshopDetailScreen> {
  final _api = ApiClient();
  bool _isUpdating = false;

  Future<void> _updateStatus(String newStatus) async {
    setState(() => _isUpdating = true);
    try {
      final response = await _api.put('/workshop/${widget.workshop['id']}', {'status': newStatus});
      if (response.statusCode == 200) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Terminal $newStatus!')));
          Navigator.pop(context);
        }
      }
    } catch (e) {
      print('Update failed: $e');
    } finally {
      if (mounted) setState(() => _isUpdating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final status = widget.workshop['status'] ?? 'ACTIVE';
    final isActive = status == 'ACTIVE' || status == 'APPROVED';

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: Text('AUDITORÍA DE TERMINAL', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A), elevation: 1,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            FadeInDown(child: KineticStatusHeader(title: 'Terminal Auditable', subtitle: widget.workshop['name'] ?? 'Taller', icon: LucideIcons.shield_check, statusColor: isActive ? const Color(0xFF10B981) : Colors.redAccent)),
            const SizedBox(height: 24),
            FadeInUp(delay: const Duration(milliseconds: 200), child: KineticCard(title: 'Identidad en Red', icon: LucideIcons.globe, color: const Color(0xFF3B82F6), children: [
              KineticDataRow(label: 'Identificación (@)', value: widget.workshop['slug'] ?? 'slug'),
              KineticDataRow(label: 'Ubicación Física', value: widget.workshop['address'] ?? 'Sin dirección'),
              KineticDataRow(label: 'Responsable', value: widget.workshop['owner_name'] ?? 'Auditores'),
            ])),
            const SizedBox(height: 48),
            FadeInUp(delay: const Duration(milliseconds: 400), child: _buildAdminActions()),
          ],
        ),
      ),
    );
  }

  Widget _buildAdminActions() {
    return Column(children: [
      KineticButton(label: 'APROBAR TALLER EN RED', color: const Color(0xFF10B981), textColor: const Color(0xFF0F172A), isLoading: _isUpdating, onPressed: () => _updateStatus('ACTIVE')),
      const SizedBox(height: 12),
      KineticButton(label: 'SUSPENDER TERMINAL', color: Colors.transparent, textColor: Colors.redAccent, isLoading: _isUpdating, onPressed: () => _updateStatus('SUSPENDED')),
    ]);
  }
}
