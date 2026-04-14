import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/screens/client/client_account_screen.dart';
import 'package:workshops_mobile/screens/client/client_password_screen.dart';

class ClientProfileTab extends StatefulWidget {
  const ClientProfileTab({super.key});

  @override
  State<ClientProfileTab> createState() => _ClientProfileTabState();
}

class _ClientProfileTabState extends State<ClientProfileTab> {
  String _userName = 'Cliente';
  String _userEmail = '';

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString('user_name') ?? 'Usuario de Prueba';
      _userEmail = prefs.getString('user_email') ?? 'cliente@test.com';
    });
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
              _buildAvatarSection(),
              const SizedBox(height: 48),
              _buildSectionTitle('MI CUENTA'),
              const SizedBox(height: 16),
              _buildMenuCard(
                icon: LucideIcons.user_cog,
                title: 'Datos Personales',
                subtitle: 'Nombre, apellido y correo',
                onTap: () async {
                  final updated = await Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ClientAccountScreen()),
                  );
                  if (updated == true) _loadUser();
                },
              ),
              const SizedBox(height: 12),
              _buildMenuCard(
                icon: LucideIcons.lock_keyhole,
                title: 'Seguridad',
                subtitle: 'Cambiar mi contraseña',
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ClientPasswordScreen()),
                  );
                },
              ),
              const SizedBox(height: 48),
              _buildSectionTitle('SISTEMA'),
              const SizedBox(height: 16),
              _buildMenuCard(
                icon: LucideIcons.log_out,
                title: 'Cerrar Sesión',
                subtitle: 'Finalizar sesión actual',
                color: Colors.redAccent,
                onTap: () async {
                  await auth.logout();
                  if (mounted) Navigator.pushReplacementNamed(context, '/login');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAvatarSection() {
    return FadeInDown(
      child: Center(
        child: Column(
          children: [
            const CircleAvatar(
              radius: 50,
              backgroundColor: Color(0xFF10B981), // Verde Cliente
              child: Icon(LucideIcons.user, color: Colors.white, size: 40),
            ),
            const SizedBox(height: 16),
            Text(
              _userName,
              style: GoogleFonts.outfit(
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: const Color(0xFF0F172A),
              ),
            ),
            Text(
              _userEmail,
              style: GoogleFonts.outfit(
                color: const Color(0xFF94A3B8),
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Color color = const Color(0xFF10B981),
  }) {
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
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                    Text(
                      subtitle,
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        color: const Color(0xFF94A3B8),
                      ),
                    ),
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

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.outfit(
        fontSize: 10,
        fontWeight: FontWeight.w900,
        color: const Color(0xFF94A3B8),
        letterSpacing: 2,
      ),
    );
  }
}
