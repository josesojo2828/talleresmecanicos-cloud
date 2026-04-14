import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'dart:convert';

class SupportDashboardTab extends StatefulWidget {
  const SupportDashboardTab({super.key});

  @override
  State<SupportDashboardTab> createState() => _SupportDashboardTabState();
}

class _SupportDashboardTabState extends State<SupportDashboardTab> {
  final _api = ApiClient();
  Map<String, dynamic>? _adminStats;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.get('/admin/dashboard/summary');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _adminStats = data['body'] ?? data;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error al cargar stats de soporte: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF8FAFC),
        body: Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6))),
      );
    }

    // Datos extraídos del dashboard (basado en la estructura del web/screenshot)
    final stats = _adminStats?['stats'] ?? {};
    final countriesCount = stats['countries'] ?? 0;
    final citiesCount = stats['cities'] ?? 0;
    final workshopsCount = stats['workshops'] ?? 0;
    final publicationsCount = stats['publications'] ?? 0;
    
    final activeCities = _adminStats?['activeCities'] as List? ?? [];
    final recentOrders = _adminStats?['recentOrders'] as List? ?? [];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadDashboardData,
          color: const Color(0xFF3B82F6),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                const SizedBox(height: 32),
                _buildMetricsGrid(
                  countries: countriesCount,
                  cities: citiesCount,
                  workshops: workshopsCount,
                  publications: publicationsCount,
                ),
                const SizedBox(height: 32),
                _buildSectionTitle('CIUDADES ACTIVAS', LucideIcons.map_pinned),
                const SizedBox(height: 16),
                _buildActiveCitiesList(activeCities),
                const SizedBox(height: 32),
                _buildSectionTitle('ÓRDENES RECIENTES', LucideIcons.clipboard_list),
                const SizedBox(height: 16),
                _buildRecentOrders(recentOrders),
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
            'HOLA, SOPORTE',
            style: GoogleFonts.outfit(
              fontSize: 28,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF0F172A),
              letterSpacing: -1,
            ),
          ),
          Text(
            'CONSOLA DE GESTIÓN REGIONAL',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF64748B),
              letterSpacing: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricsGrid({required int countries, required int cities, required int workshops, required int publications}) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      childAspectRatio: 1.1,
      children: [
        _buildStatCard('PAÍSES ASIGNADOS', countries.toString(), LucideIcons.globe, const Color(0xFF3B82F6)),
        _buildStatCard('CIUDADES COBERTURA', cities.toString(), LucideIcons.map_pin, const Color(0xFFEF4444)),
        _buildStatCard('TOTAL TALLERES', workshops.toString(), LucideIcons.store, const Color(0xFF10B981)),
        _buildStatCard('PUBLICACIONES', publications.toString(), LucideIcons.file_text, const Color(0xFFF59E0B)),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: GoogleFonts.outfit(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFF0F172A),
                  ),
                ),
                Text(
                  label,
                  style: GoogleFonts.outfit(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF94A3B8),
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon) {
    return FadeInLeft(
      child: Row(
        children: [
          Icon(icon, size: 18, color: const Color(0xFF0F172A)),
          const SizedBox(width: 8),
          Text(
            title,
            style: GoogleFonts.outfit(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF0F172A),
              letterSpacing: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveCitiesList(List cities) {
    if (cities.isEmpty) {
      return _buildEmptyState('No hay ciudades activas registradas.');
    }
    return Column(
      children: cities.map((c) => _buildCityItem(c)).toList(),
    );
  }

  Widget _buildCityItem(dynamic city) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Row(
        children: [
          const Icon(LucideIcons.map_pin, size: 16, color: Color(0xFF64748B)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  city['name'] ?? 'Ciudad',
                  style: GoogleFonts.outfit(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: const Color(0xFF0F172A),
                  ),
                ),
                Text(
                  city['country'] ?? 'Región',
                  style: GoogleFonts.outfit(
                    fontSize: 11,
                    color: const Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ),
          Container(
            width: 8,
            height: 8,
            decoration: const BoxDecoration(
              color: Color(0xFF10B981),
              shape: BoxShape.circle,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentOrders(List orders) {
    if (orders.isEmpty) {
      return _buildEmptyState('Sin registros recientes.');
    }
    return Column(
      children: orders.map((o) => const SizedBox()).toList(), // Aquí irían las órdenes
    );
  }

  Widget _buildEmptyState(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Center(
        child: Text(
          message,
          style: GoogleFonts.outfit(
            color: const Color(0xFF94A3B8),
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
