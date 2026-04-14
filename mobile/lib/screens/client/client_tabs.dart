import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/screens/client/client_dashboard_tab.dart';
import 'package:workshops_mobile/screens/client/client_works_tab.dart';
import 'package:workshops_mobile/screens/client/client_appointments_tab.dart';
import 'package:workshops_mobile/screens/client/client_profile_tab.dart';

class ClientTabs extends StatefulWidget {
  const ClientTabs({super.key});

  @override
  State<ClientTabs> createState() => _ClientTabsState();
}

class _ClientTabsState extends State<ClientTabs> {
  int _selectedIndex = 0;

  final List<Widget> _tabs = [
    const ClientDashboardTab(),
    const ClientWorksTab(),
    const ClientAppointmentsTab(),
    const ClientProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _tabs,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() => _selectedIndex = index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: const Color(0xFF10B981), // Verde para el cliente
          unselectedItemColor: const Color(0xFF94A3B8),
          selectedLabelStyle: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold),
          unselectedLabelStyle: GoogleFonts.outfit(fontSize: 12),
          elevation: 0,
          items: const [
            BottomNavigationBarItem(icon: Icon(LucideIcons.house), label: 'Inicio'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.wrench), label: 'Trabajos'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.calendar_clock), label: 'Citas'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: 'Perfil'),
          ],
        ),
      ),
    );
  }
}
