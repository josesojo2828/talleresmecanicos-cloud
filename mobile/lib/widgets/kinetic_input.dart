import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class KineticInput extends StatelessWidget {
  final String label;
  final IconData icon;
  final TextEditingController controller;
  final bool isPassword;
  final TextInputType keyboardType;

  const KineticInput({
    super.key, 
    required this.label, 
    required this.icon, 
    required this.controller,
    this.isPassword = false,
    this.keyboardType = TextInputType.text
  });

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Icon(icon, size: 14, color: const Color(0xFF94A3B8)),
        const SizedBox(width: 8),
        Text(label.toUpperCase(), style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1.5)),
      ]),
      const SizedBox(height: 4),
      TextField(
        controller: controller,
        obscureText: isPassword,
        keyboardType: keyboardType,
        style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16, color: const Color(0xFF0F172A)),
        decoration: const InputDecoration(border: InputBorder.none, contentPadding: EdgeInsets.symmetric(vertical: 8)),
      ),
      const Divider(height: 1, color: Color(0xFFF1F5F9)),
    ]);
  }
}
