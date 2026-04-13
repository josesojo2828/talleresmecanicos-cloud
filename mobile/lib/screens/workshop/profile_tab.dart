import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/screens/workshop/appointments_screen.dart';
import 'package:workshops_mobile/screens/workshop/finance_tab.dart';
import 'package:workshops_mobile/screens/workshop/workshop_info_tab.dart';
import 'package:workshops_mobile/screens/workshop/chat_screen.dart';
import 'package:workshops_mobile/screens/workshop/forum_screen.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/widgets/kinetic_card.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  String _userName = 'Cargando...';
  String _userEmail = '';
  String _userRole = 'Taller';

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final auth = AuthService();
    final user = await auth.getUser();
    if (mounted && user != null) {
      setState(() {
        _userName = '${user['firstName']} ${user['lastName']}';
        _userEmail = user['email'] ?? '';
        _userRole = user['role'] ?? 'Taller';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = AuthService();
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(32),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle),
                        child: const CircleAvatar(radius: 28, backgroundColor: Color(0xFF0F172A), child: Icon(LucideIcons.user, color: Colors.white, size: 28)),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(_userName.toUpperCase(), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 0.5)),
                            Text(_userEmail, style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w500)),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                              child: Text(_userRole, style: GoogleFonts.outfit(color: const Color(0xFF10B981), fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 40),

              _buildSectionHeader('ADMINISTRACIÓN CENTRAL'),
              const SizedBox(height: 16),
              _buildOptionCard(LucideIcons.trending_up, 'FINANZAS', 'Balance, ingresos y egresos', const Color(0xFF10B981), () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => Scaffold(
                  appBar: AppBar(title: Text('FINANZAS', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 1))),
                  body: const FinanceTab(),
                )));
              }),
              const SizedBox(height: 12),
              _buildOptionCard(LucideIcons.calendar_clock, 'GESTIÓN DE CITAS', 'Calendario completo de reservas', const Color(0xFF3B82F6), () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AppointmentsScreen()));
              }),
              const SizedBox(height: 12),
              _buildOptionCard(LucideIcons.layout_grid, 'MIS PUBLICACIONES', 'Gestión del marketplace', const Color(0xFF8B5CF6), () {
                 Navigator.push(context, MaterialPageRoute(builder: (_) => const ForumScreen()));
              }),

              const SizedBox(height: 40),
              _buildSectionHeader('COMUNICACIÓN'),
              const SizedBox(height: 16),
              _buildOptionCard(LucideIcons.message_circle, 'CHAT GENERAL', 'Canal oficial de la red', const Color(0xFFF59E0B), () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatScreen()))),

              const SizedBox(height: 40),
              _buildSectionHeader('CUENTA'),
              const SizedBox(height: 16),
              _buildOptionCard(LucideIcons.shield_check, 'PERFIL (FICHA TALLER)', 'Información pública y contacto', const Color(0xFF64748B), () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const WorkshopInfoTab()));
              }),
              const SizedBox(height: 12),
              _buildOptionCard(LucideIcons.log_out, 'CERRAR SESIÓN', 'Finalizar ciclo de trabajo', Colors.redAccent, () async {
                await auth.logout();
                if (mounted) Navigator.pushReplacementNamed(context, '/login');
              }),
              
              const SizedBox(height: 50),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return FadeInLeft(
      child: Text(title, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1.5)),
    );
  }

  Widget _buildOptionCard(IconData icon, String title, String sub, Color color, VoidCallback onTap) {
    return FadeInUp(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFF1F5F9)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                    Text(sub, style: GoogleFonts.outfit(fontSize: 11, color: const Color(0xFF94A3B8), fontWeight: FontWeight.w500)),
                  ],
                ),
              ),
              const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFFCBD5E1)),
            ],
          ),
        ),
      ),
    );
  }
}
