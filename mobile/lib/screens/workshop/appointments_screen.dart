import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/screens/workshop/create_appointment_screen.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:intl/intl.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  final _workshopService = WorkshopService();
  bool _isLoading = true;
  List<dynamic> _appointments = [];
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final res = await _workshopService.getAppointments();
      if (mounted) {
        setState(() {
          _appointments = res;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  List<dynamic> get _filteredAppointments {
    if (_searchQuery.isEmpty) return _appointments;
    return _appointments.where((a) {
      final clientName = a['client']?['name']?.toString().toLowerCase() ?? '';
      final description = a['description']?.toString().toLowerCase() ?? '';
      return clientName.contains(_searchQuery.toLowerCase()) || 
             description.contains(_searchQuery.toLowerCase());
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          color: const Color(0xFF10B981),
          child: CustomScrollView(
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.all(24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    FadeInDown(
                      child: const KineticHeader(
                        title: 'GESTIÓN DE CITAS',
                        subtitle: 'Administración de Reservas y Agendas',
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    // Search Bar
                    FadeInUp(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFF1F5F9)),
                        ),
                        child: TextField(
                          onChanged: (val) => setState(() => _searchQuery = val),
                          decoration: InputDecoration(
                            hintText: 'Buscar cita por cliente...',
                            hintStyle: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 14),
                            border: InputBorder.none,
                            icon: const Icon(LucideIcons.search, size: 20, color: Color(0xFF64748B)),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ]),
                ),
              ),

              if (_isLoading)
                const SliverFillRemaining(child: Center(child: CircularProgressIndicator(color: Color(0xFF10B981))))
              else if (_filteredAppointments.isEmpty)
                SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.calendar_off, size: 64, color: const Color(0xFFCBD5E1)),
                        const SizedBox(height: 16),
                        Text('No hay citas programadas', style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final appointment = _filteredAppointments[index];
                        return _buildAppointmentCard(appointment);
                      },
                      childCount: _filteredAppointments.length,
                    ),
                  ),
                ),
              
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
      floatingActionButton: FadeInRight(
        child: FloatingActionButton.extended(
          onPressed: () async {
            final result = await Navigator.push(context, MaterialPageRoute(builder: (_) => const WorkshopCreateAppointmentScreen()));
            if (result == true) _loadData();
          },
          backgroundColor: const Color(0xFF10B981),
          icon: const Icon(LucideIcons.plus, color: Colors.white),
          label: Text('AGREGAR CITA', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
      ),
    );
  }

  Widget _buildAppointmentCard(dynamic appointment) {
    final date = DateTime.parse(appointment['date']);
    final status = appointment['status'].toString();
    final client = appointment['client']?['name'] ?? 'Cliente Externo';
    final desc = appointment['description'] ?? 'Sin descripción';

    Color statusColor;
    String statusLabel;

    switch (status) {
      case 'ACCEPTED':
        statusColor = const Color(0xFF10B981);
        statusLabel = 'ACEPTADO';
        break;
      case 'COMPLETED':
        statusColor = const Color(0xFF3B82F6);
        statusLabel = 'COMPLETADO';
        break;
      case 'PENDING':
        statusColor = const Color(0xFFF59E0B);
        statusLabel = 'PENDIENTE';
        break;
      default:
        statusColor = const Color(0xFF64748B);
        statusLabel = status;
    }

    return FadeInUp(
      child: InkWell(
        onTap: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => WorkshopCreateAppointmentScreen(appointment: appointment),
            ),
          );
          if (result == true) _loadData();
        },
        borderRadius: BorderRadius.circular(24),
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
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(DateFormat('dd/MM/yyyy').format(date), style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 13, color: const Color(0xFF0F172A))),
                      Text(DateFormat('hh:mm a').format(date), style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: statusColor.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                    child: Text(statusLabel, style: GoogleFonts.outfit(color: statusColor, fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
                  ),
                ],
              ),
              const Divider(height: 24, color: Color(0xFFF8FAFC)),
              Row(
                children: [
                  CircleAvatar(radius: 12, backgroundColor: const Color(0xFFF1F5F9), child: const Icon(LucideIcons.user, size: 12, color: Color(0xFF64748B))),
                  const SizedBox(width: 12),
                  Text(client, style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 13, color: const Color(0xFF0F172A))),
                ],
              ),
              const SizedBox(height: 8),
              Text(desc, maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF64748B))),
            ],
          ),
        ),
      ),
    );
  }
}
