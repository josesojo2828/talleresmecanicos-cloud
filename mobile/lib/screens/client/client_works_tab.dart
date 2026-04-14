import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'dart:convert';
import 'package:intl/intl.dart';

class ClientWorksTab extends StatefulWidget {
  const ClientWorksTab({super.key});

  @override
  State<ClientWorksTab> createState() => _ClientWorksTabState();
}

class _ClientWorksTabState extends State<ClientWorksTab> {
  final _api = ApiClient();
  bool _isLoading = true;
  List<dynamic> _works = [];

  @override
  void initState() {
    super.initState();
    _loadWorks();
  }

  Future<void> _loadWorks() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.get('/work');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _works = data['body']?['data'] ?? data['data'] ?? [];
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error cargando trabajos cliente: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadWorks,
          child: CustomScrollView(
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.all(24),
                sliver: SliverToBoxAdapter(
                  child: _buildHeader(),
                ),
              ),
              if (_isLoading)
                const SliverFillRemaining(child: Center(child: CircularProgressIndicator()))
              else if (_works.isEmpty)
                SliverFillRemaining(child: _buildEmptyState())
              else
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => _buildWorkCard(_works[index]),
                      childCount: _works.length,
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

  Widget _buildHeader() {
    return FadeInDown(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'ÓRDENES DE TRABAJO',
            style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: -0.5),
          ),
          Text(
            'Historial de servicios realizados',
            style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildWorkCard(dynamic work) {
    return FadeInUp(
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatusBadge(work['status'] ?? 'PENDIENTE'),
                Text(
                  'ID: ${work['publicId'] ?? '---'}',
                  style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF94A3B8), fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              work['title'] ?? 'Sin Título',
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A)),
            ),
            const SizedBox(height: 12),
            _buildInfoRow(LucideIcons.building_2, work['workshop']?['name'] ?? 'Taller Mecánico'),
            const SizedBox(height: 8),
            _buildInfoRow(LucideIcons.calendar, DateFormat('dd MMM, yyyy').format(DateTime.parse(work['createdAt']))),
            const Divider(height: 32, color: Color(0xFFF1F5F9)),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Costo de obra',
                  style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF64748B)),
                ),
                Text(
                  '${work['currency'] ?? 'USD'} ${work['laborPrice'] ?? '0'}',
                  style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: const Color(0xFF94A3B8)),
        const SizedBox(width: 8),
        Text(text, style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFF64748B))),
      ],
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    String label;
    switch (status) {
      case 'COMPLETED': color = const Color(0xFF10B981); label = 'COMPLETADO'; break;
      case 'IN_PROGRESS': color = const Color(0xFF3B82F6); label = 'EN PROCESO'; break;
      default: color = const Color(0xFFF59E0B); label = 'PENDIENTE';
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
      child: Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: color, letterSpacing: 0.5)),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(LucideIcons.wrench, size: 48, color: Color(0xFFCBD5E1)),
          const SizedBox(height: 16),
          Text('No tienes trabajos todavía', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600, color: const Color(0xFF94A3B8))),
        ],
      ),
    );
  }
}
