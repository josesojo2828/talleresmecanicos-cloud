import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';

class KineticHeader extends StatelessWidget {
  final String title;
  final String subtitle;
  final Color? color;
  final Widget? trailing;

  const KineticHeader({super.key, required this.title, required this.subtitle, this.color, this.trailing});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title.toUpperCase(), 
                style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: color ?? const Color(0xFF10B981), letterSpacing: 2),
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                subtitle, 
                style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: -1),
                softWrap: true,
              ),
            ],
          ),
        ),
        if (trailing != null) ...[
          const SizedBox(width: 16),
          trailing!,
        ],
      ],
    );
  }
}

class KineticStatusHeader extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color statusColor;

  const KineticStatusHeader({
    super.key, 
    required this.title, 
    required this.subtitle, 
    required this.icon, 
    required this.statusColor
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(32)),
      child: Row(children: [
        CircleAvatar(radius: 24, backgroundColor: statusColor, child: Icon(icon, color: Colors.white)),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(title.toUpperCase(), style: GoogleFonts.outfit(color: statusColor, fontWeight: FontWeight.w900, letterSpacing: 2, fontSize: 10), overflow: TextOverflow.ellipsis),
              Text(subtitle, style: GoogleFonts.outfit(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold), softWrap: true),
            ],
          ),
        ),
      ]),
    );
  }
}
