import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/widgets/kinetic_card.dart';

class SupportProfileTab extends StatefulWidget {
  const SupportProfileTab({super.key});

  @override
  State<SupportProfileTab> createState() => _SupportProfileTabState();
}

class _SupportProfileTabState extends State<SupportProfileTab> {
  String _userName = 'Admin...';
  String _userRole = 'Soporte';

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() { _userName = prefs.getString('user_name') ?? 'Admin'; _userRole = prefs.getString('user_role') ?? 'Auditores'; });
  }

  @override
  Widget build(BuildContext context) {
    final auth = AuthService();
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(child: Row(children: [
                    const CircleAvatar(radius: 30, backgroundColor: Color(0xFF3B82F6), child: Icon(LucideIcons.shield_check, color: Colors.white, size: 30)),
                    const SizedBox(width: 16),
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(_userName, style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
                      Text('Rol: $_userRole', style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontWeight: FontWeight.bold, fontSize: 12)),
                    ]),
                  ])),
              const SizedBox(height: 48),
              _buildSectionTitle('SISTEMA'),
              const SizedBox(height: 16),
              KineticLinkCard(icon: LucideIcons.terminal, title: 'Monitor de Logs', subtitle: 'Vigilancia de errores en vivo', color: const Color(0xFF0F172A)),
              const SizedBox(height: 12),
              KineticLinkCard(icon: LucideIcons.hard_drive, title: 'Base de Datos Maestro', subtitle: 'Auditoría sincrónica global', color: const Color(0xFF94A3B8)),
              const SizedBox(height: 48),
              _buildSectionTitle('CONTROLES'),
              const SizedBox(height: 16),
              KineticLinkCard(icon: LucideIcons.settings, title: 'Configuración', subtitle: 'Ajustes del sistema soporte', color: const Color(0xFF94A3B8)),
              const SizedBox(height: 12),
              KineticLinkCard(icon: LucideIcons.log_out, title: 'Cerrar Sesión', subtitle: 'Finalizar jornada de auditoría', color: Colors.redAccent, onTap: () async { await auth.logout(); Navigator.pushReplacementNamed(context, '/login'); }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) => Text(title, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2));
}
