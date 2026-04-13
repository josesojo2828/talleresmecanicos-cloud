import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/screens/workshop/dashboard_tab.dart';
import 'package:workshops_mobile/screens/workshop/inventory_tab.dart';
import 'package:workshops_mobile/screens/workshop/jobs_tab.dart';
import 'package:workshops_mobile/screens/workshop/profile_tab.dart';
import 'package:workshops_mobile/screens/workshop/workshop_info_tab.dart';

import 'package:workshops_mobile/screens/workshop/finance_tab.dart';

class WorkshopTabs extends StatefulWidget {
  const WorkshopTabs({super.key});

  @override
  State<WorkshopTabs> createState() => _WorkshopTabsState();
}

class _WorkshopTabsState extends State<WorkshopTabs> {
  int _selectedIndex = 0;

  final List<Widget> _tabs = [
    DashboardTab(),
    JobsTab(),
    InventoryTab(),
    WorkshopInfoTab(),
    ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _selectedIndex, children: _tabs),
      bottomNavigationBar: Container(
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
            BottomNavigationBarItem(icon: Icon(LucideIcons.layout_dashboard, size: 20), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.wrench, size: 20), label: 'Ordenes de trabajo'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.package, size: 20), label: 'Inventario'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.settings, size: 20), label: 'Perfil de taller'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.circle_user, size: 20), label: 'Perfil de trabajo'),
          ],
        ),
      ),
    );
  }
}
