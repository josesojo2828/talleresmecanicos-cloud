import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/screens/splash_screen.dart';
import 'package:workshops_mobile/screens/login_screen.dart';
import 'package:workshops_mobile/screens/workshop/workshop_tabs.dart';
import 'package:workshops_mobile/screens/support/support_tabs.dart';
import 'package:workshops_mobile/services/sync_service.dart';

void main() async {
  // Aseguramos que los widgets de Flutter estén cargados antes del SyncService
  WidgetsFlutterBinding.ensureInitialized();
  
  // Arrancamos el motor de sincronización de fondo (Offline First)
  SyncService().init();

  runApp(const WorkshopsApp());
}

class WorkshopsApp extends StatelessWidget {
  const WorkshopsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Workshop Network',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF10B981),
          primary: const Color(0xFF10B981),
          secondary: const Color(0xFF0F172A),
        ),
        textTheme: GoogleFonts.outfitTextTheme(),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/dashboard/workshop': (context) => const WorkshopTabs(),
        '/dashboard/support': (context) => const SupportTabs(),
      },
    );
  }
}
