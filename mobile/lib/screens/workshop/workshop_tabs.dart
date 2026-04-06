import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:workshops_mobile/screens/workshop/dashboard_tab.dart';
import 'package:workshops_mobile/screens/workshop/jobs_tab.dart';
import 'package:workshops_mobile/screens/workshop/workshop_info_tab.dart';
import 'package:workshops_mobile/screens/workshop/inventory_tab.dart';
import 'package:workshops_mobile/screens/workshop/profile_tab.dart';

class WorkshopTabs extends StatefulWidget {
  const WorkshopTabs({super.key});

  @override
  State<WorkshopTabs> createState() => _WorkshopTabsState();
}

class _WorkshopTabsState extends State<WorkshopTabs> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const DashboardTab(),
    const JobsTab(),
    const WorkshopInfoTab(),
    const InventoryTab(),
    const ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 40,
              offset: const Offset(0, -10),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          selectedItemColor: const Color(0xFF10B981),
          unselectedItemColor: const Color(0xFF94A3B8),
          showSelectedLabels: true,
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          elevation: 0,
          selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          unselectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          items: const [
            BottomNavigationBarItem(icon: Icon(LucideIcons.layout_dashboard, size: 20), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.wrench, size: 20), label: 'Trabajos'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.home, size: 20), label: 'Taller'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.package, size: 20), label: 'Inventario'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.user, size: 20), label: 'Perfil'),
          ],
        ),
      ),
    );
  }
}
