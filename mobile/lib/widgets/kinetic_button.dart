import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class KineticButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final Color? color;
  final Color? textColor;

  const KineticButton({
    super.key, 
    required this.label, 
    this.onPressed, 
    this.isLoading = false,
    this.color,
    this.textColor
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 60,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color ?? const Color(0xFF0F172A), 
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          elevation: 0,
        ),
        child: isLoading 
          ? const CircularProgressIndicator(color: Colors.white, strokeWidth: 2) 
          : Text(label.toUpperCase(), style: GoogleFonts.outfit(color: textColor ?? Colors.white, fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 13)),
      ),
    );
  }
}

class KineticIconButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final bool isLarge;
  final Color? color;

  const KineticIconButton({
    super.key, 
    required this.icon, 
    required this.label, 
    this.onPressed, 
    this.isLarge = false,
    this.color
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: isLarge ? 60 : 50,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color ?? const Color(0xFF10B981), 
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          elevation: 0,
        ),
        icon: Icon(icon, color: Colors.white, size: 18),
        label: Text(label.toUpperCase(), style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w900, letterSpacing: 1, fontSize: 12)),
      ),
    );
  }
}
