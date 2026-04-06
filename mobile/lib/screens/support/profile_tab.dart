import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/auth_service.dart';

class SupportProfileTab extends StatelessWidget {
  const SupportProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = AuthService();

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              FadeInDown(child: const CircleAvatar(radius: 40, backgroundColor: Color(0xFF3B82F6), child: Icon(LucideIcons.user_cog, color: Colors.white, size: 40))),
              const SizedBox(height: 16),
              Text('Equipo de Soporte', style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900)),
              Text('Panel Administrativo Central', style: GoogleFonts.outfit(color: Colors.grey)),
              const SizedBox(height: 48),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    await auth.logout();
                    Navigator.pushReplacementNamed(context, '/login');
                  },
                  icon: const Icon(LucideIcons.log_out, size: 18),
                  label: const Text('Cerrar Sesión Segura'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.redAccent,
                    elevation: 0,
                    padding: const EdgeInsets.all(20),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: Colors.redAccent, width: 2)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
