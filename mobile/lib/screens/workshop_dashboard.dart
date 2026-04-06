import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/workshop_service.dart';

class WorkshopDashboard extends StatefulWidget {
  const WorkshopDashboard({super.key});

  @override
  State<WorkshopDashboard> createState() => _WorkshopDashboardState();
}

class _WorkshopDashboardState extends State<WorkshopDashboard> {
  final _workshopService = WorkshopService();
  Map<String, dynamic>? _data;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    
    final result = await _workshopService.getFinanceStats();
    
    if (mounted) {
      setState(() {
        if (result['success']) {
          _data = result['data'];
        }
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF10B981)),
        ),
      );
    }

    final stats = _data?['stats'];
    final recentJobs = _data?['recentTransactions'] as List? ?? [];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      bottomNavigationBar: _buildBottomNav(),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          color: const Color(0xFF10B981),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                const SizedBox(height: 32),
                _buildStatsRow(stats),
                const SizedBox(height: 32),
                _buildSectionTitle('TRABAJOS RECIENTES', 'Ver todos'),
                const SizedBox(height: 16),
                _buildJobList(recentJobs),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      currentIndex: 0,
      selectedItemColor: const Color(0xFF10B981),
      unselectedItemColor: const Color(0xFF94A3B8),
      showSelectedLabels: false,
      showUnselectedLabels: false,
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.white,
      elevation: 0,
      items: const [
        BottomNavigationBarItem(icon: Icon(LucideIcons.layout_dashboard), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(LucideIcons.wrench), label: 'Trabajos'),
        BottomNavigationBarItem(icon: Icon(LucideIcons.package), label: 'Stock'),
        BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: 'Perfil'),
      ],
    );
  }

  Widget _buildHeader() {
    return FadeInDown(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'TALLER MECÁNICO',
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFF10B981),
                  letterSpacing: 2,
                ),
              ),
              Text(
                'Estado Real',
                style: GoogleFonts.outfit(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFF0F172A),
                  letterSpacing: -1,
                ),
              ),
            ],
          ),
          _buildActionButton(LucideIcons.bell),
        ],
      ),
    );
  }

  Widget _buildActionButton(IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.slate.shade100),
      ),
      child: Icon(icon, size: 20, color: const Color(0xFF64748B)),
    );
  }

  Widget _buildStatsRow(Map<String, dynamic>? stats) {
    final earnings = stats?['totalIncome']?.toString() ?? '0';
    final parts = stats?['totalParts']?.toString() ?? '0';
    
    return FadeInUp(
      delay: const Duration(milliseconds: 200),
      child: Row(
        children: [
          _buildStatCard('GANANCIAS', '\$$earnings', LucideIcons.dollar_sign, const Color(0xFF10B981)),
          const SizedBox(width: 16),
          _buildStatCard('GUSTOS REP', '\$$parts', LucideIcons.package, const Color(0xFF3B82F6)),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 18),
            ),
            const SizedBox(height: 16),
            Text(value, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
            Text(title, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, String action) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2)),
        Text(action, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF10B981))),
      ],
    );
  }

  Widget _buildJobList(List jobs) {
    if (jobs.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Text(
            'No hay trabajos recientes\n registrados hoy.',
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(color: Colors.slate.shade400, fontSize: 14, fontWeight: FontWeight.w500),
          ),
        ),
      );
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: jobs.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final job = jobs[index];
        return FadeInRight(
          delay: Duration(milliseconds: 300 + (index * 100)),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.slate.shade100),
            ),
            child: Row(
              children: [
                Container(
                  width: 50, height: 50,
                  decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(14)),
                  child: const Icon(LucideIcons.car, color: Color(0xFF64748B), size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(job['car'] ?? 'Trabajo Gral', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                      Text(job['client'] ?? 'Cliente Desconocido', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8))),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('\$${job['amount']?.toString() ?? '0'}', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
                    Text('Completed', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF10B981))),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
