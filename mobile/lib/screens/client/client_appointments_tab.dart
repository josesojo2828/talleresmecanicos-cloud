import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'dart:convert';
import 'package:intl/intl.dart';

class ClientAppointmentsTab extends StatefulWidget {
  const ClientAppointmentsTab({super.key});

  @override
  State<ClientAppointmentsTab> createState() => _ClientAppointmentsTabState();
}

class _ClientAppointmentsTabState extends State<ClientAppointmentsTab> {
  final _api = ApiClient();
  bool _isLoading = true;
  List<dynamic> _appointments = [];

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.get('/appointment');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _appointments = data['body']?['data'] ?? data['data'] ?? [];
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error cargando citas cliente: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadAppointments,
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
              else if (_appointments.isEmpty)
                SliverFillRemaining(child: _buildEmptyState())
              else
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => _buildAppointmentCard(_appointments[index]),
                      childCount: _appointments.length,
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
            'MIS CITAS',
            style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: -0.5),
          ),
          Text(
            'Gestión de turnos en talleres',
            style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildAppointmentCard(dynamic app) {
    DateTime date = DateTime.parse(app['dateTime']);
    return FadeInUp(
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
              child: Column(
                children: [
                  Text(DateFormat('dd').format(date), style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
                  Text(DateFormat('MMM').format(date).toUpperCase(), style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF3B82F6))),
                ],
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    app['workshop']?['name'] ?? 'Taller Mecánico',
                    style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A)),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(LucideIcons.clock, size: 12, color: Color(0xFF94A3B8)),
                      const SizedBox(width: 4),
                      Text(DateFormat('HH:mm').format(date), style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFF64748B))),
                      const SizedBox(width: 12),
                      _buildStatusDot(app['status'] ?? 'PENDIENTE'),
                    ],
                  ),
                ],
              ),
            ),
            const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFFCBD5E1)),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusDot(String status) {
    Color color;
    switch (status) {
      case 'CONFIRMED': color = const Color(0xFF10B981); break;
      case 'CANCELLED': color = Colors.redAccent; break;
      default: color = const Color(0xFFF59E0B);
    }
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(LucideIcons.calendar, size: 48, color: Color(0xFFCBD5E1)),
          const SizedBox(height: 16),
          Text('No tienes citas agendadas', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600, color: const Color(0xFF94A3B8))),
        ],
      ),
    );
  }
}
