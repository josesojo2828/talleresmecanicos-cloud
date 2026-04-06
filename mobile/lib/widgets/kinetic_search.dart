import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';

class KineticSearch extends StatelessWidget {
  final Function(String) onChanged;
  final String hint;
  final IconData? icon;

  const KineticSearch({super.key, required this.onChanged, this.hint = "Buscar...", this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(20), 
        border: Border.all(color: Colors.slate.shade100),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.01), blurRadius: 10, offset: const Offset(0, 4))]
      ),
      child: TextField(
        onChanged: onChanged,
        style: GoogleFonts.outfit(fontSize: 14),
        decoration: InputDecoration(
          icon: Icon(icon ?? LucideIcons.search, size: 18, color: const Color(0xFF94A3B8)),
          hintText: hint,
          hintStyle: GoogleFonts.outfit(color: const Color(0xFFCBD5E1)),
          border: InputBorder.none,
        ),
      ),
    );
  }
}
