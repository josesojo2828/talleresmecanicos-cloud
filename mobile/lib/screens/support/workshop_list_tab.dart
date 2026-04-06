import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';

class WorkshopListTab extends StatelessWidget {
  const WorkshopListTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(backgroundColor: Colors.white,
      body: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        FadeInDown(child: const Icon(LucideIcons.building_2, size: 48, color: Color(0xFF64748B))),
        const SizedBox(height: 16),
        Text('GESTIÓN DE TALLERES', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
        Text('Red de Talleres Activos', style: GoogleFonts.outfit(color: Colors.grey)),
      ])),
    );
  }
}
