import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'dart:convert';
import 'package:intl/intl.dart';

class ClientDashboardTab extends StatefulWidget {
  const ClientDashboardTab({super.key});

  @override
  State<ClientDashboardTab> createState() => _ClientDashboardTabState();
}

class _ClientDashboardTabState extends State<ClientDashboardTab> {
  final _api = ApiClient();
  bool _isLoading = true;
  Map<String, dynamic> _stats = {};
  List<dynamic> _recentWorks = [];
  List<dynamic> _upcomingAppointments = [];

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.get('/dashboard/client-stats');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final body = data['body'] ?? data;
        setState(() {
          _stats = body['summary'] ?? {};
          _recentWorks = body['recentWorks'] ?? [];
          _upcomingAppointments = body['upcomingAppointments'] ?? [];
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error dashboard cliente: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadDashboard,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                const SizedBox(height: 32),
                _buildStatsGrid(),
                const SizedBox(height: 32),
                _buildSectionHeader('TRABAJOS RECIENTES', LucideIcons.wrench),
                const SizedBox(height: 16),
                _buildRecentWorks(),
                const SizedBox(height: 32),
                _buildSectionHeader('PRÓXIMAS CITAS', LucideIcons.calendar_clock),
                const SizedBox(height: 16),
                _buildUpcomingAppointments(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return FadeInDown(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'MI GARAJE',
            style: GoogleFonts.outfit(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF0F172A),
              letterSpacing: -0.5,
            ),
          ),
          Text(
            'Estado de tus vehículos y servicios',
            style: GoogleFonts.outfit(
              fontSize: 14,
              color: const Color(0xFF64748B),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid() {
    return Row(
      children: [
        Expanded(child: _buildStatCard('Activos', _stats['activeWorks']?.toString() ?? '0', LucideIcons.wrench, Colors.blue)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard('Citas', _stats['upcomingAppointments']?.toString() ?? '0', LucideIcons.calendar, Colors.green)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard('Total', _stats['totalWorks']?.toString() ?? '0', LucideIcons.history, Colors.orange)),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
              child: Icon(icon, size: 16, color: color),
            ),
            const SizedBox(height: 12),
            Text(value, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
            Text(label, style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF94A3B8), fontWeight: FontWeight.bold, letterSpacing: 0.5)),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 14, color: const Color(0xFF94A3B8)),
        const SizedBox(width: 8),
        Text(
          title,
          style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2),
        ),
      ],
    );
  }

  Widget _buildRecentWorks() {
    if (_isLoading) return const Center(child: CircularProgressIndicator());
    if (_recentWorks.isEmpty) return _buildEmptyState('No hay trabajos registrados todavía.');

    return Column(
      children: _recentWorks.map((work) {
        return FadeInLeft(
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF1F5F9)),
            ),
            child: Row(
              children: [
                const Icon(LucideIcons.wrench, color: Color(0xFF3B82F6), size: 20),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(work['title'] ?? 'Sin Título', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                      Text(work['workshop']?['name'] ?? 'Taller Mecánico', style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF64748B))),
                    ],
                  ),
                ),
                _buildStatusBadge(work['status'] ?? 'PENDIENTE'),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildUpcomingAppointments() {
    if (_isLoading) return const Center(child: CircularProgressIndicator());
    if (_upcomingAppointments.isEmpty) return _buildEmptyState('No tienes citas agendadas.');

    return Column(
      children: _upcomingAppointments.map((app) {
        DateTime date = DateTime.parse(app['dateTime']);
        return FadeInLeft(
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF1F5F9)),
            ),
            child: Row(
              children: [
                const Icon(LucideIcons.calendar, color: Color(0xFF10B981), size: 20),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(DateFormat('dd MMMM, HH:mm', 'es').format(date), style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                      Text(app['workshop']?['name'] ?? 'Taller Mecánico', style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF64748B))),
                    ],
                  ),
                ),
                const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFFCBD5E1)),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    String label;
    switch (status) {
      case 'COMPLETED': color = const Color(0xFF10B981); label = 'Completado'; break;
      case 'IN_PROGRESS': color = const Color(0xFF3B82F6); label = 'En Proceso'; break;
      default: color = const Color(0xFFF59E0B); label = 'Pendiente';
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
      child: Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: color)),
    );
  }

  Widget _buildEmptyState(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(24)),
      child: Column(
        children: [
          const Icon(LucideIcons.search_x, color: Color(0xFF94A3B8), size: 32),
          const SizedBox(height: 12),
          Text(message, style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
