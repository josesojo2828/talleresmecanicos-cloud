import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:workshops_mobile/screens/support/support_dashboard_tab.dart';
import 'package:workshops_mobile/screens/support/support_workshops_tab.dart';
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
    const SupportWorkshopsTab(),
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
        decoration: BoxDecoration(boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 40, offset: const Offset(0, -10))]),
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
            BottomNavigationBarItem(icon: Icon(LucideIcons.activity, size: 20), label: 'Monitor'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.building_2, size: 20), label: 'Talleres'),
            BottomNavigationBarItem(icon: Icon(LucideIcons.user_cog, size: 20), label: 'Admin'),
          ],
        ),
      ),
    );
  }
}
