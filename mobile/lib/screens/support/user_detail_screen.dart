import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'dart:convert';

class UserDetailScreen extends StatefulWidget {
  final Map<String, dynamic> user;
  const UserDetailScreen({super.key, required this.user});

  @override
  State<UserDetailScreen> createState() => _UserDetailScreenState();
}

class _UserDetailScreenState extends State<UserDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _api = ApiClient();
  bool _isTaller = false;
  
  // Data State
  List<dynamic> _appointments = [];
  List<dynamic> _works = [];
  bool _isLoadingCitas = true;
  bool _isLoadingWorks = true;
  int _totalCitas = 0;
  int _totalWorks = 0;

  @override
  void initState() {
    super.initState();
    _isTaller = widget.user['role'] == 'TALLER';
    _tabController = TabController(length: _isTaller ? 4 : 3, vsync: this);
    _loadAllData();
  }

  Future<void> _loadAllData() async {
    await Future.wait([
      _loadAppointments(),
      _loadWorks(),
    ]);
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoadingCitas = true);
    try {
      final filterKey = _isTaller ? 'workshopId' : 'clientId';
      final response = await _api.get('/appointment?$filterKey=${widget.user['id']}');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _appointments = data['body']?['data'] ?? [];
          _totalCitas = data['body']?['meta']?['totalItems'] ?? _appointments.length;
          _isLoadingCitas = false;
        });
      }
    } catch (e) {
      print('Error cargando citas: $e');
      setState(() => _isLoadingCitas = false);
    }
  }

  Future<void> _loadWorks() async {
    setState(() => _isLoadingWorks = true);
    try {
      final filterKey = _isTaller ? 'workshopId' : 'clientId';
      final response = await _api.get('/work?$filterKey=${widget.user['id']}');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _works = data['body']?['data'] ?? [];
          _totalWorks = data['body']?['meta']?['totalItems'] ?? _works.length;
          _isLoadingWorks = false;
        });
      }
    } catch (e) {
      print('Error cargando trabajos: $e');
      setState(() => _isLoadingWorks = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.chevron_left, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'FICHA DE USUARIO',
          style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 1),
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF3B82F6),
          unselectedLabelColor: const Color(0xFF94A3B8),
          indicatorColor: const Color(0xFF3B82F6),
          indicatorSize: TabBarIndicatorSize.label,
          labelStyle: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold),
          tabs: [
            const Tab(text: 'Dashboard'),
            const Tab(text: 'Citas'),
            const Tab(text: 'Trabajos'),
            if (_isTaller) const Tab(text: 'Inventario'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDashboardTab(),
          _buildCitasTab(),
          _buildTrabajosTab(),
          if (_isTaller) _buildInventarioTab(),
        ],
      ),
    );
  }

  Widget _buildDashboardTab() {
    return RefreshIndicator(
      onRefresh: _loadAllData,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(32)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text('ESTADO DE CUENTA', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2)),
                      Icon(LucideIcons.shield_check, color: (widget.user['enabled'] ?? true) ? const Color(0xFF10B981) : Colors.redAccent, size: 16),
                    ]),
                    const SizedBox(height: 12),
                    Text(
                      (widget.user['enabled'] ?? true) ? 'ACTIVO' : 'INACTIVO',
                      style: GoogleFonts.outfit(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 16),
                    const Divider(color: Color(0xFF1E293B)),
                    const SizedBox(height: 16),
                    _buildProfileInfo(LucideIcons.user, 'Nombre', '${widget.user['firstName']} ${widget.user['lastName']}'),
                    const SizedBox(height: 12),
                    _buildProfileInfo(LucideIcons.mail, 'Correo', widget.user['email'] ?? 'Sin email'),
                    const SizedBox(height: 12),
                    _buildProfileInfo(LucideIcons.tag, 'Rol', widget.user['role'] ?? 'CLIENT'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            _buildQuickStats(),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileInfo(IconData icon, String label, String value) {
    return Row(children: [
      Icon(icon, size: 14, color: const Color(0xFF94A3B8)),
      const SizedBox(width: 8),
      Text('$label: ', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.bold)),
      Expanded(child: Text(value, style: GoogleFonts.outfit(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis)),
    ]);
  }

  Widget _buildQuickStats() {
    return Row(children: [
      Expanded(child: _buildMiniStat('TOTAL CITAS', _totalCitas.toString(), LucideIcons.calendar, const Color(0xFF3B82F6))),
      const SizedBox(width: 16),
      Expanded(child: _buildMiniStat('TRABAJOS', _totalWorks.toString(), LucideIcons.wrench, const Color(0xFF10B981))),
    ]);
  }

  Widget _buildMiniStat(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFF1F5F9))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 12),
        Text(value, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
        Text(label, style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
      ]),
    );
  }

  Widget _buildCitasTab() {
    if (_isLoadingCitas) return const Center(child: CircularProgressIndicator());
    if (_appointments.isEmpty) return _buildEmptyPlaceholder('No hay citas registradas.');
    
    return RefreshIndicator(
      onRefresh: _loadAppointments,
      child: ListView.separated(
        padding: const EdgeInsets.all(24),
        itemCount: _appointments.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final a = _appointments[index];
          return _buildInfoCard(
            title: 'Cita con ${a['workshop']?['name'] ?? a['client']?['firstName'] ?? 'Usuario'}',
            subtitle: 'Fecha: ${a['date'] ?? 'Sin fecha'}',
            status: a['status'] ?? 'PENDING',
            icon: LucideIcons.calendar,
          );
        },
      ),
    );
  }

  Widget _buildTrabajosTab() {
    if (_isLoadingWorks) return const Center(child: CircularProgressIndicator());
    if (_works.isEmpty) return _buildEmptyPlaceholder('No hay trabajos en curso.');
    
    return RefreshIndicator(
      onRefresh: _loadWorks,
      child: ListView.separated(
        padding: const EdgeInsets.all(24),
        itemCount: _works.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final w = _works[index];
          return _buildInfoCard(
            title: w['description'] ?? 'Trabajo',
            subtitle: 'Estado: ${w['status']}',
            status: w['status'] ?? 'OPEN',
            icon: LucideIcons.wrench,
          );
        },
      ),
    );
  }

  Widget _buildInfoCard({required String title, required String subtitle, required String status, required IconData icon}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFF1F5F9))),
      child: Row(children: [
        Icon(icon, size: 20, color: const Color(0xFF3B82F6)),
        const SizedBox(width: 16),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 13, color: const Color(0xFF0F172A))),
          Text(subtitle, style: GoogleFonts.outfit(fontSize: 11, color: const Color(0xFF94A3B8))),
        ])),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
          child: Text(status, style: GoogleFonts.outfit(fontSize: 8, fontWeight: FontWeight.w900, color: const Color(0xFF64748B))),
        ),
      ]),
    );
  }

  Widget _buildInventarioTab() => _buildEmptyPlaceholder('Inventario vacío o no disponible.');

  Widget _buildEmptyPlaceholder(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(LucideIcons.ghost, size: 48, color: Color(0xFFCBD5E1)),
          const SizedBox(height: 16),
          Text(message, style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
