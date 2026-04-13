import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_chart.dart';

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  final _db = DatabaseService();
  double _totalIncome = 0;
  int _activeJobs = 0;
  List<FlSpot> _chartData = [];

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final db = await _db.database;
    final income = await db.rawQuery('SELECT SUM(total_price) as total FROM works');
    final count = await db.rawQuery('SELECT COUNT(*) as total FROM works');
    
    setState(() {
      _totalIncome = (income.first['total'] as num?)?.toDouble() ?? 0.0;
      _activeJobs = (count.first['total'] as int?) ?? 0;
      _chartData = [const FlSpot(0, 1), const FlSpot(1, 3), const FlSpot(2, 2), const FlSpot(3, 5), const FlSpot(4, 3.5), const FlSpot(5, 4.5)];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(
                child: KineticHeader(
                  title: 'Telemetría Taller', 
                  subtitle: 'Resumen Diario',
                  trailing: IconButton(
                    icon: const Icon(LucideIcons.layout_list, color: Color(0xFF64748B)),
                    onPressed: () => Navigator.pushNamed(context, '/directory'),
                  ),
                )
              ),
              const SizedBox(height: 32),
              _buildFinanceMainCard(),
              const SizedBox(height: 24),
              Row(children: [
                Expanded(child: _buildMiniStat('TRABAJOS', '$_activeJobs', LucideIcons.wrench, const Color(0xFF3B82F6))),
                const SizedBox(width: 16),
                Expanded(child: _buildMiniStat('PRODUCTOS', '12', LucideIcons.package, const Color(0xFF10B981))),
              ]),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFinanceMainCard() {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(32), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10))]),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('INGRESOS TOTALES', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2)),
            const SizedBox(height: 8),
            Text('\$${_totalIncome.toStringAsFixed(2)}', style: GoogleFonts.outfit(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
            const SizedBox(height: 24),
            SizedBox(height: 100, child: KineticFinanceChart(data: _chartData)),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniStat(String label, String value, IconData icon, Color color) {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), 
          // FIX: Border.all(color: ...)
          border: Border.all(color: const Color(0xFFF1F5F9))),
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
