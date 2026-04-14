import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/screens/splash_screen.dart';
import 'package:workshops_mobile/screens/login_screen.dart';
import 'package:workshops_mobile/screens/directory_screen.dart';
import 'package:workshops_mobile/screens/workshop_detail_screen.dart';
import 'package:workshops_mobile/screens/appointment_form_screen.dart';
import 'package:workshops_mobile/screens/workshop/workshop_tabs.dart';
import 'package:workshops_mobile/screens/support/support_tabs.dart';
import 'package:workshops_mobile/services/sync_service.dart';

import 'dart:io';

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (X509Certificate cert, String host, int port) => true;
  }
}

void main() async {
  HttpOverrides.global = MyHttpOverrides();
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
        '/directory': (context) => const DirectoryScreen(),
        '/login': (context) => const LoginScreen(),
        '/dashboard/workshop': (context) => const WorkshopTabs(),
        '/dashboard/support': (context) => const SupportTabs(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/workshop-detail') {
          final workshop = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => WorkshopDetailScreen(workshop: workshop),
          );
        }
        if (settings.name == '/appointment-form') {
          final workshop = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => AppointmentFormScreen(workshop: workshop),
          );
        }
        return null;
      },
    );
  }
}
