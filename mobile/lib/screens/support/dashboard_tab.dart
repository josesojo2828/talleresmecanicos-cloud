import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';

class SupportDashboardTab extends StatelessWidget {
  const SupportDashboardTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(backgroundColor: const Color(0xFFF1F5F9),
      body: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        FadeInDown(child: const Icon(LucideIcons.activity, size: 48, color: Color(0xFF3B82F6))),
        const SizedBox(height: 16),
        Text('MONITOR DE RED', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
        Text('Estado Global de Talleres', style: GoogleFonts.outfit(color: Colors.grey)),
      ])),
    );
  }
}
