import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
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
  String _userRole = 'Taller';

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() { _userName = prefs.getString('user_name') ?? 'Piloto'; _userRole = prefs.getString('user_role') ?? 'Mecánico'; });
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
                    const CircleAvatar(radius: 30, backgroundColor: Color(0xFF10B981), child: Icon(LucideIcons.user, color: Colors.white, size: 30)),
                    const SizedBox(width: 16),
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(_userName, style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900)),
                      Text('Rol: $_userRole', style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontWeight: FontWeight.bold, fontSize: 12)),
                    ]),
                  ])),
              const SizedBox(height: 48),
              _buildSectionTitle('COMUNIDAD'),
              const SizedBox(height: 16),
              KineticLinkCard(icon: LucideIcons.message_square, title: 'Foro de Mecánicos', subtitle: 'Discusión y tips del sector', color: const Color(0xFF10B981), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ForumScreen()))),
              const SizedBox(height: 12),
              KineticLinkCard(icon: LucideIcons.messages_square, title: 'Chat Público', subtitle: 'Habla con otros talleres ahora', color: const Color(0xFF3B82F6), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatScreen()))),
              const SizedBox(height: 48),
              _buildSectionTitle('SISTEMA'),
              const SizedBox(height: 16),
              KineticLinkCard(icon: LucideIcons.settings, title: 'Configuración', subtitle: 'Ajustes de la cuenta', color: const Color(0xFF94A3B8)),
              const SizedBox(height: 12),
              KineticLinkCard(icon: LucideIcons.log_out, title: 'Cerrar Sesión', subtitle: 'Salir del sistema', color: Colors.redAccent, onTap: () async { await auth.logout(); Navigator.pushReplacementNamed(context, '/login'); }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) => Text(title, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2));
}
