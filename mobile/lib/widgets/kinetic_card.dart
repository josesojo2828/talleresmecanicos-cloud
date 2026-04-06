import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:animate_do/animate_do.dart';

class KineticCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List<Widget> children;
  final Color? color;
  
  const KineticCard({
    super.key, 
    required this.title, 
    required this.icon, 
    required this.children,
    this.color
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(32), 
        border: Border.all(color: Colors.slate.shade100),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))]
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Icon(icon, size: 16, color: color ?? const Color(0xFF94A3B8)),
            const SizedBox(width: 12),
            Text(title.toUpperCase(), style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: color ?? const Color(0xFF94A3B8), letterSpacing: 1.5)),
          ]),
          const SizedBox(height: 24),
          ...children,
        ],
      ),
    );
  }
}

class KineticDataRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isBoldValue;
  final Color? valueColor;

  const KineticDataRow({super.key, required this.label, required this.value, this.isBoldValue = true, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontSize: 13)),
          Text(value, style: GoogleFonts.outfit(fontWeight: isBoldValue ? FontWeight.bold : FontWeight.normal, color: valueColor ?? const Color(0xFF0F172A), fontSize: 13)),
        ],
      ),
    );
  }
}

class KineticLinkCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback? onTap;

  const KineticLinkCard({
    super.key, 
    required this.icon, 
    required this.title, 
    required this.subtitle, 
    required this.color, 
    this.onTap
  });

  @override
  Widget build(BuildContext context) {
    return FadeInUp(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.slate.shade100)),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10), 
                decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(14)),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 16),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                Text(subtitle, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey.shade500, fontWeight: FontWeight.w500)),
              ])),
              const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFF94A3B8)),
            ],
          ),
        ),
      ),
    );
  }
}
