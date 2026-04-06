import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/auth_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final _auth = AuthService();

  @override
  void initState() {
    super.initState();
    _handleStartUp();
  }

  Future<void> _handleStartUp() async {
    // 2 segundos para que el usuario sienta el bólido
    await Future.delayed(const Duration(seconds: 2));
    
    final loggedIn = await _auth.isLoggedIn();
    final role = await _auth.getRole();

    if (!mounted) return;

    if (loggedIn && role != null) {
      if (role == 'ADMIN' || role == 'SUPPORT') {
        Navigator.pushReplacementNamed(context, '/dashboard/support');
      } else {
        Navigator.pushReplacementNamed(context, '/dashboard/workshop');
      }
    } else {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ZoomIn(
              duration: const Duration(seconds: 1),
              child: const Icon(
                LucideIcons.gauge,
                size: 100,
                color: Color(0xFF10B981),
              ),
            ),
            const SizedBox(height: 32),
            FadeInUp(
              delay: const Duration(milliseconds: 500),
              child: Column(
                children: [
                  Text(
                    'KINETIC',
                    style: GoogleFonts.outfit(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -2,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    'ATELIER',
                    style: GoogleFonts.outfit(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 10,
                      color: const Color(0xFF10B981),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 60),
            FadeIn(
              delay: const Duration(seconds: 1),
              child: const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Color(0xFF10B981),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
