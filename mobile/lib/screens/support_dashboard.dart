import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';

class SupportDashboard extends StatelessWidget {
  const SupportDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        selectedItemColor: const Color(0xFF6366F1),
        unselectedItemColor: const Color(0xFF94A3B8),
        showSelectedLabels: false,
        showUnselectedLabels: false,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        elevation: 0,
        items: const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.shield), label: 'Soporte'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.home), label: 'Talleres'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.message_circle), label: 'Mensajes'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.settings), label: 'Config'),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 32),
              _buildControlStatus(),
              const SizedBox(height: 32),
              _buildSectionTitle('TICKETS PRIORITARIOS', 'Todos'),
              const SizedBox(height: 16),
              _buildTicketList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return FadeInDown(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'PANEL DE CONTROL',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF6366F1),
              letterSpacing: 2,
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Soporte Global',
                style: GoogleFonts.outfit(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFF0F172A),
                  letterSpacing: -1,
                ),
              ),
              const CircleAvatar(
                radius: 24,
                backgroundColor: Color(0xFFE2E8F0),
                child: Icon(LucideIcons.user, color: Color(0xFF64748B), size: 20),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildControlStatus() {
    return FadeInUp(
      delay: const Duration(milliseconds: 200),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(32),
          image: DecorationImage(
            image: const NetworkImage('https://www.transparenttextures.com/patterns/carbon-fibre.png'),
            opacity: 0.1,
            repeat: ImageRepeat.repeat,
          ),
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildSimpleStat('TALLERES', '128', LucideIcons.home),
                _buildSimpleStat('TICKETS', '42', LucideIcons.ticket),
                _buildSimpleStat('ALERTAS', '3', LucideIcons.alert_triangle),
              ],
            ),
            const Divider(color: Colors.white10, height: 40),
            Row(
              children: [
                const Icon(LucideIcons.activity, color: Color(0xFF10B981), size: 16),
                const SizedBox(width: 8),
                Text(
                  'SISTEMA OPERATIVO AL 100%',
                  style: GoogleFonts.outfit(
                    color: const Color(0xFF10B981),
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSimpleStat(String label, String value, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: Colors.white38, size: 16),
        const SizedBox(height: 8),
        Text(value, style: GoogleFonts.outfit(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
        Text(label, style: GoogleFonts.outfit(color: Colors.white38, fontSize: 8, fontWeight: FontWeight.bold, letterSpacing: 1)),
      ],
    );
  }

  Widget _buildSectionTitle(String title, String action) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2)),
        Text(action, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF6366F1))),
      ],
    );
  }

  Widget _buildTicketList() {
    final tickets = [
      {'title': 'Error en suscripción', 'workshop': 'Mecánica Gral', 'time': '2h ago', 'priority': 'ALTA'},
      {'title': 'Vincular dominio', 'workshop': 'Taller Don Juan', 'time': '5h ago', 'priority': 'NORMAL'},
      {'title': 'Duda facturación', 'workshop': 'Elite Customs', 'time': '8h ago', 'priority': 'NORMAL'},
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: tickets.length,
      itemBuilder: (context, index) {
        final ticket = tickets[index];
        return FadeInRight(
          delay: Duration(milliseconds: 300 + (index * 100)),
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.slate.shade100),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: ticket['priority'] == 'ALTA' ? Colors.red.withOpacity(0.1) : Colors.blue.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              ticket['priority']!,
                              style: GoogleFonts.outfit(
                                fontSize: 8,
                                fontWeight: FontWeight.w900,
                                color: ticket['priority'] == 'ALTA' ? Colors.red : Colors.blue,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(ticket['time']!, style: GoogleFonts.outfit(fontSize: 10, color: Colors.slate.shade400, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(ticket['title']!, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
                      Text(ticket['workshop']!, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8))),
                    ],
                  ),
                ),
                const Icon(LucideIcons.chevron_right, color: Color(0xFF94A3B8), size: 20),
              ],
            ),
          ),
        );
      },
    );
  }
}
