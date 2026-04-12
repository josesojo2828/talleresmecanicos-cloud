import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/screens/workshop/dashboard_tab.dart';
import 'package:workshops_mobile/screens/workshop/inventory_tab.dart';
import 'package:workshops_mobile/screens/workshop/jobs_tab.dart';
import 'package:workshops_mobile/screens/workshop/profile_tab.dart';
import 'package:workshops_mobile/screens/workshop/workshop_info_tab.dart';

class WorkshopTabs extends StatefulWidget {
  const WorkshopTabs({super.key});

  @override
  State<WorkshopTabs> createState() => _WorkshopTabsState();
}

class _WorkshopTabsState extends State<WorkshopTabs> {
  int _selectedIndex = 0;

  final List<Widget> _tabs = [
    const DashboardTab(),
    const JobsTab(),
    const InventoryTab(),
    const WorkshopInfoTab(),
    const ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _selectedIndex, children: _tabs),
      bottomNavigationBar: Container(
        // FIX: Colors.slate.shade100 -> Color(0xFFF1F5F9)
        decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Color(0xFFF1F5F9), width: 0.5))),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() => _selectedIndex = index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: const Color(0xFF10B981),
          unselectedItemColor: const Color(0xFF94A3B8),
          selectedLabelStyle: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 10),
          unselectedLabelStyle: GoogleFonts.outfit(fontSize: 10),
          elevation: 0,
          items: const [
            BottomNavigationBarItem(icon: Icon(LucideIcons.house, size: 20), label: 'Taller'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.wrench, size: 20), label: 'Labores'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.package, size: 20), label: 'Boxes'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.settings, size: 20), label: 'Ficha'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.user, size: 20), label: 'Perfil'),
          ],
        ),
      ),
    );
  }
}
