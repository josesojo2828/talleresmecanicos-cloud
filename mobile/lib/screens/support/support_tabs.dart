import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:workshops_mobile/screens/support/support_dashboard_tab.dart';
import 'package:workshops_mobile/screens/support/support_user_list_tab.dart';
import 'package:workshops_mobile/screens/support/support_regions_tab.dart';
import 'package:workshops_mobile/screens/support/support_profile_tab.dart';

class SupportTabs extends StatefulWidget {
  const SupportTabs({super.key});

  @override
  State<SupportTabs> createState() => _SupportTabsState();
}

class _SupportTabsState extends State<SupportTabs> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const SupportDashboardTab(),
    const SupportUserListTab(),
    const SupportRegionsTab(),
    const SupportProfileTab(),
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
            )
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          selectedItemColor: const Color(0xFF3B82F6), // Azul Support
          unselectedItemColor: const Color(0xFF94A3B8),
          showSelectedLabels: true,
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          elevation: 0,
          selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          unselectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.layout_dashboard, size: 20),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.users, size: 20),
              label: 'Usuarios',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.map, size: 20),
              label: 'Regiones',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.user_cog, size: 20),
              label: 'Perfil',
            ),
          ],
        ),
      ),
    );
  }
}
