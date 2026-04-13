import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_chart.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';
import 'package:workshops_mobile/screens/workshop/create_work_order_screen.dart';
import 'package:workshops_mobile/screens/workshop/job_detail_screen.dart';
import 'package:workshops_mobile/screens/workshop/create_appointment_screen.dart';

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  final _workshopService = WorkshopService();
  final _auth = AuthService();
  
  Map<String, dynamic>? _dashboardData;
  bool _isLoading = true;
  String _userName = '';

  @override
  void initState() {
    super.initState();
    print('########## DASHBOARD: initState()');
    _loadAll();
  }

  Future<void> _loadAll() async {
    print('########## DASHBOARD: _loadAll() INICIO');
    setState(() => _isLoading = true);
    
    try {
      print('########## DASHBOARD: LLAMANDO A getFullDashboardStats()...');
      final stats = await _workshopService.getFullDashboardStats();
      print('########## DASHBOARD: STATS OBTENIDAS? ${stats != null}');
      
      print('########## DASHBOARD: OBTENIENDO USUARIO...');
      final user = await _auth.getUser();
      print('########## DASHBOARD: USUARIO OBTENIDO? ${user != null}');
      
      if (mounted) {
        setState(() {
          _dashboardData = stats;
          _userName = user?['firstName'] ?? 'Usuario';
          _isLoading = false;
        });
        print('########## DASHBOARD: STATE ACTUALIZADO, isLoading = false');
      }
    } catch (e) {
      print('########## DASHBOARD: ERROR CRÍTICO EN _loadAll: $e');
      if (mounted) setState(() => _isLoading = false);
    }
    print('########## DASHBOARD: _loadAll() FIN');
  }

  List<FlSpot> _getChartSpots() {
    final timeline = _dashboardData?['timeline'] as List? ?? [];
    if (timeline.isEmpty) return [const FlSpot(0, 0)];
    
    return List.generate(timeline.length, (i) {
      final count = (timeline[i]['count'] as num?)?.toDouble() ?? 0.0;
      return FlSpot(i.toDouble(), count);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
    }

    final stats = _dashboardData?['stats'];
    final recent = _dashboardData?['recent'];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadAll,
          color: const Color(0xFF10B981),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FadeInDown(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: KineticHeader(
                          title: 'HOLA, $_userName', 
                          subtitle: 'Consola de Gestión Administrativa',
                        ),
                      ),
                      IconButton(
                        icon: const Icon(LucideIcons.layout_list, color: Color(0xFF64748B)),
                        onPressed: () => Navigator.pushNamed(context, '/directory'),
                      ),
                    ],
                  )
                ),
                const SizedBox(height: 32),
                
                // Botones de Acción (Igual que el Web)
                FadeInUp(
                  child: Column(
                    children: [
                      KineticButton(
                        label: '+ NUEVA ORDEN DE TRABAJO',
                        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CreateWorkOrderScreen())).then((_) => _loadAll()),
                        color: const Color(0xFF10B981),
                      ),
                      const SizedBox(height: 12),
                      KineticButton(
                        label: '+ AGENDAR CITA / RESERVA',
                        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const WorkshopCreateAppointmentScreen())).then((_) => _loadAll()),
                        color: const Color(0xFF3B82F6),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Cartas de Estadísticas (Fila 1)
                Row(
                  children: [
                    Expanded(child: _buildStatCard('TRABAJOS TOTALES', '${stats?['works']?['total'] ?? 0}', LucideIcons.wrench, const Color(0xFF10B981))),
                    const SizedBox(width: 16),
                    Expanded(child: _buildStatCard('CITAS ACTIVAS', '${stats?['appointments']?['total'] ?? 0}', LucideIcons.calendar, const Color(0xFF3B82F6))),
                  ],
                ),
                const SizedBox(height: 16),
                _buildStatCard('INVENTARIO / STOCK', '${stats?['inventory']?['total'] ?? 0}', LucideIcons.package, const Color(0xFF8B5CF6)),

                const SizedBox(height: 32),

                // Gráfico de Producción
                _buildProductionChart(),

                const SizedBox(height: 32),
                
                // Listas de Actividad Reciente
                _buildActivitySection('Citas Recientes', LucideIcons.calendar, recent?['appointments'] ?? [], 'CLIENTE'),
                const SizedBox(height: 24),
                _buildActivitySection('Órdenes Maestras', LucideIcons.wrench, recent?['works'] ?? [], 'ORDEN'),
                
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF1F5F9)),
          boxShadow: [
            BoxShadow(color: const Color(0xFF0F172A).withOpacity(0.02), blurRadius: 20, offset: const Offset(0, 5))
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 16),
            Text(value, style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), height: 1)),
            const SizedBox(height: 4),
            Text(label, style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1.5)),
          ],
        ),
      ),
    );
  }

  Widget _buildProductionChart() {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(32),
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
                    Text('PRODUCCIÓN', style: GoogleFonts.outfit(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                    Text('TRABAJOS ÚLTIMOS 30 DÍAS', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.2), borderRadius: BorderRadius.circular(10)),
                  child: Text('ACTIVO', style: GoogleFonts.outfit(color: const Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 32),
            SizedBox(height: 150, child: KineticFinanceChart(data: _getChartSpots())),
          ],
        ),
      ),
    );
  }

  Widget _buildActivitySection(String title, IconData icon, List<dynamic> items, String type) {
    return FadeInUp(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: const Color(0xFF0F172A)),
              const SizedBox(width: 8),
              Text(title.toUpperCase(), style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 14, color: const Color(0xFF0F172A), letterSpacing: 1)),
            ],
          ),
          const SizedBox(height: 16),
          if (items.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFF1F5F9))),
              child: Center(
                child: Text('NO HAY ACTIVIDAD RECIENTE', style: GoogleFonts.outfit(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: items.length > 3 ? 3 : items.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = items[index];
                return _buildActivityItem(item, type);
              },
            ),
        ],
      ),
    );
  }

  Widget _buildActivityItem(dynamic item, String type) {
    String title = '';
    String sub = '';
    IconData leadingIcon = LucideIcons.circle;
    Color iconColor = const Color(0xFF10B981);

    if (type == 'CLIENTE') {
      title = '${item['client']?['firstName'] ?? 'Sin'} ${item['client']?['lastName'] ?? 'Nombre'}';
      sub = item['dateTime'] != null ? '${DateTime.parse(item['dateTime']).day}/${DateTime.parse(item['dateTime']).month} - ${DateTime.parse(item['dateTime']).hour}:${DateTime.parse(item['dateTime']).minute.toString().padLeft(2, '0')}' : 'Sin fecha';
      leadingIcon = LucideIcons.user;
      iconColor = const Color(0xFF3B82F6);
    } else {
      title = (item['title'] != null && item['title'].toString().isNotEmpty) 
          ? item['title'] 
          : 'Orden #${item['id'].toString().substring(item['id'].toString().length > 6 ? item['id'].toString().length - 6 : 0).toUpperCase()}';
      sub = item['status'] ?? 'Pendiente';
      leadingIcon = LucideIcons.wrench;
      iconColor = const Color(0xFF10B981);
    }

    return InkWell(
      onTap: () {
        if (type == 'ORDEN') {
          Navigator.push(context, MaterialPageRoute(builder: (_) => JobDetailScreen(job: {
            'id': item['id'],
            'car_info': item['title'] ?? 'Trabajo Gral',
            'status': item['status'],
            'total_price': item['laborPrice'] ?? 0,
            'labor_price': item['laborPrice'] ?? 0,
            'parts_price': 0,
            'created_at': item['createdAt'] ?? DateTime.now().toIso8601String(),
            'sync_status': 1,
          })));
        }
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: iconColor.withOpacity(0.1), borderRadius: BorderRadius.circular(14)),
            child: Icon(leadingIcon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 13, color: const Color(0xFF0F172A))),
                const SizedBox(height: 2),
                Text(sub.toUpperCase(), style: GoogleFonts.spaceGrotesk(fontWeight: FontWeight.bold, fontSize: 9, color: const Color(0xFF94A3B8), letterSpacing: 1)),
              ],
            ),
          ),
          const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFFCBD5E1)),
        ],
        ),
      ),
    );
  }
}
