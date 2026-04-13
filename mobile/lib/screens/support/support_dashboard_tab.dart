import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_chart.dart';

class SupportDashboardTab extends StatefulWidget {
  const SupportDashboardTab({super.key});

  @override
  State<SupportDashboardTab> createState() => _SupportDashboardTabState();
}

class _SupportDashboardTabState extends State<SupportDashboardTab> {
  final _db = DatabaseService();
  int _workshopCount = 0;
  List<FlSpot> _chartData = [];

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final db = await _db.database;
    final countRes = await db.rawQuery('SELECT COUNT(*) as total FROM workshops_list');
    setState(() {
      _workshopCount = (countRes.first['total'] as int?) ?? 0;
      _chartData = [const FlSpot(0, 5), const FlSpot(1, 4), const FlSpot(2, 6), const FlSpot(3, 8), const FlSpot(4, 7), const FlSpot(5, 9)];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(
                child: KineticHeader(
                  title: 'Auditoría Nacional', 
                  subtitle: 'Telemetría Flota',
                  trailing: IconButton(
                    icon: const Icon(LucideIcons.layout_list, color: Color(0xFF64748B)),
                    onPressed: () => Navigator.pushNamed(context, '/directory'),
                  ),
                )
              ),
              const SizedBox(height: 32),
              _buildNetworkStatus(),
              const SizedBox(height: 24),
              _buildFleetMiniStats(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNetworkStatus() {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(32), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20)]),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('TERMINALES ACTIVAS', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2)),
            const Icon(LucideIcons.radio, color: Color(0xFF3B82F6), size: 14),
          ]),
          const SizedBox(height: 8),
          Text('$_workshopCount', style: GoogleFonts.outfit(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
          const SizedBox(height: 24),
          SizedBox(height: 100, child: KineticFinanceChart(data: _chartData, color: const Color(0xFF3B82F6))),
        ]),
      ),
    );
  }

  Widget _buildFleetMiniStats() {
    return Row(children: [
      // FIX: Using Material Icons for maximum compatibility
      Expanded(child: _buildMiniStat('REPORTES', '124', Icons.warning_amber_rounded, Colors.orange)),
      const SizedBox(width: 16),
      Expanded(child: _buildMiniStat('AUDITORÍAS', '48', LucideIcons.shield_check, const Color(0xFF10B981))),
    ]);
  }

  Widget _buildMiniStat(String label, String value, IconData icon, Color color) {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFF1F5F9))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 12),
          Text(value, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
          Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1.5)),
        ]),
      ),
    );
  }
}
