import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:animate_do/animate_do.dart';
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart';

import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';

class WorkshopDetailScreen extends StatefulWidget {
  final Map<String, dynamic> workshop;

  const WorkshopDetailScreen({super.key, required this.workshop});

  @override
  State<WorkshopDetailScreen> createState() => _WorkshopDetailScreenState();
}

class _WorkshopDetailScreenState extends State<WorkshopDetailScreen> {
  bool _isLoggedIn = false;
  String _userRole = '';
  final _auth = AuthService();

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final loggedIn = await _auth.isLoggedIn();
    final role = await _auth.getUserRole();
    if (mounted) {
      setState(() {
        _isLoggedIn = loggedIn;
        _userRole = role;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final workshop = widget.workshop;
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: CustomScrollView(
        slivers: [
          _buildHeroHeader(context),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  _buildTitleSection(),
                  const SizedBox(height: 24),
                  _buildActionGrid(),
                  const SizedBox(height: 32),
                  _buildLocationAndHours(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildStickyCTA(),
    );
  }

  Widget _buildHeroHeader(BuildContext context) {
    final List<dynamic> images = (widget.workshop['images'] as List? ?? [])
        .where((img) => img != null && img.toString().isNotEmpty)
        .toList();
    
    return SliverAppBar(
      expandedHeight: 280,
      pinned: true,
      backgroundColor: const Color(0xFF0F172A),
      leading: IconButton(
        icon: const Icon(LucideIcons.chevron_left, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            if (images.isEmpty)
              Container(color: const Color(0xFF0F172A))
            else
              PageView.builder(
                itemCount: images.length,
                itemBuilder: (context, index) {
                  return Image.network(
                    images[index],
                    fit: BoxFit.cover,
                  );
                },
              ),
            // Gradient Overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(0.4),
                    Colors.transparent,
                    Colors.black.withOpacity(0.8),
                  ],
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              right: 20,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '1 / ${images.length > 0 ? images.length : 1}',
                  style: GoogleFonts.spaceGrotesk(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTitleSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.workshop['name']?.toUpperCase() ?? 'MARIO MOTORS VZLA',
          style: GoogleFonts.outfit(
            fontSize: 28,
            fontWeight: FontWeight.w900,
            color: const Color(0xFF0F172A),
            letterSpacing: -1,
          ),
        ),
        const SizedBox(height: 16),
        IntrinsicHeight(
          child: Row(
            children: [
              Container(width: 4, color: const Color(0xFF10B981)),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  'ESTE TALLER ES PARTE DE NUESTRA RED CERTIFICADA DE ESPECIALISTAS MECÁNICOS.',
                  style: GoogleFonts.outfit(
                    color: const Color(0xFF64748B),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    height: 1.5,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionGrid() {
    return Row(
      children: [
        Expanded(
          child: _buildActionCard(
            'WHATSAPP',
            LucideIcons.message_circle,
            const Color(0xFF10B981),
            const Color(0xFFD1FAE5),
            onTap: () async {
              final whatsapp = widget.workshop['whatsapp'];
              if (whatsapp != null) {
                final url = 'https://wa.me/${whatsapp.replaceAll(RegExp(r'[^0-9]'), '')}';
                if (await canLaunchUrl(Uri.parse(url))) {
                  await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
                }
              }
            },
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildActionCard(
            'TELÉFONO',
            LucideIcons.phone,
            const Color(0xFF0F172A),
            const Color(0xFFF1F5F9),
            onTap: () async {
              final phone = widget.workshop['phone'];
              if (phone != null) {
                final url = 'tel:${phone.replaceAll(RegExp(r'[^0-9]'), '')}';
                if (await canLaunchUrl(Uri.parse(url))) {
                  await launchUrl(Uri.parse(url));
                }
              }
            },
          ),
        ),
      ],
    );
  }

  Widget _buildActionCard(String label, IconData icon, Color color, Color bgColor, {VoidCallback? onTap}) {
    return Material(
      color: bgColor,
      borderRadius: BorderRadius.circular(24),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 24),
          child: Column(
            children: [
              Icon(icon, color: color, size: 32),
              const SizedBox(height: 12),
              Text(
                label,
                style: GoogleFonts.spaceGrotesk(
                  color: color,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatSchedule(dynamic hours) {
    if (hours == null) return 'Consulte disponibilidad';
    
    Map<String, dynamic> parsed;
    if (hours is String) {
      try {
        parsed = jsonDecode(hours);
      } catch (e) {
        return hours;
      }
    } else {
      parsed = hours;
    }

    final daysOrder = [
      {'key': 'monday', 'label': 'Lunes', 'short': 'LUN'},
      {'key': 'tuesday', 'label': 'Martes', 'short': 'MAR'},
      {'key': 'wednesday', 'label': 'Miércoles', 'short': 'MIE'},
      {'key': 'thursday', 'label': 'Jueves', 'short': 'JUE'},
      {'key': 'friday', 'label': 'Viernes', 'short': 'VIE'},
      {'key': 'saturday', 'label': 'Sábado', 'short': 'SAB'},
      {'key': 'sunday', 'label': 'Domingo', 'short': 'DOM'},
    ];

    String formatTime(String? time) {
      if (time == null || time.isEmpty) return '';
      if (time.toLowerCase().contains('a.m.') || time.toLowerCase().contains('p.m.')) return time;
      if (time.toLowerCase().contains('am') || time.toLowerCase().contains('pm')) return time;

      try {
        final parts = time.split(':');
        int h = int.parse(parts[0]);
        String m = parts.length > 1 ? parts[1] : '00';
        final suffix = h >= 12 ? 'pm' : 'am';
        h = h % 12;
        if (h == 0) h = 12;
        return '$h:$m $suffix';
      } catch (e) {
        return time;
      }
    }

    List<Map<String, String>> groups = [];
    Map<String, String>? currentGroup;

    for (var day in daysOrder) {
      final key = day['key'] as String;
      final short = day['short'] as String;
      if (parsed[key] != null && parsed[key]['enabled'] == true) {
        final open = formatTime(parsed[key]['open']);
        final close = formatTime(parsed[key]['close']);
        final timeStr = '$open – $close';
        
        if (currentGroup == null || currentGroup['time'] != timeStr) {
          currentGroup = {'start': short, 'end': short, 'time': timeStr};
          groups.add(currentGroup);
        } else {
          currentGroup['end'] = short;
        }
      } else {
        currentGroup = null;
      }
    }

    if (groups.isEmpty) return 'Consultar horario';
    
    return groups.map((g) {
      if (g['start'] == g['end']) return '${g['start']}: ${g['time']}';
      return '${g['start']} – ${g['end']}: ${g['time']}';
    }).join('\n');
  }

  Widget _buildLocationAndHours() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Column(
        children: [
          _buildInfoRow(LucideIcons.map_pin, widget.workshop['address'] ?? 'Sin dirección', '${widget.workshop['city']?['name'] ?? ''} // ${widget.workshop['country']?['name'] ?? ''}'),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 20),
            child: Divider(color: Color(0xFFF1F5F9)),
          ),
          _buildInfoRow(LucideIcons.clock, 'Horario de Atención', _formatSchedule(widget.workshop['openingHours'])),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String title, String sub) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: const Color(0xFF0F172A), size: 20),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: GoogleFonts.outfit(
                color: const Color(0xFF0F172A),
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
            Text(
              sub,
              style: GoogleFonts.spaceGrotesk(
                color: const Color(0xFF64748B),
                fontSize: 10,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStickyCTA() {
    // Si ya inició sesión pero NO es cliente (es Taller o Soporte), 
    // ocultamos el botón de solicitar cita ya que este flujo es para clientes.
    if (_isLoggedIn && _userRole != 'CLIENT') {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 40, offset: const Offset(0, -10))
        ],
      ),
      child: KineticButton(
        label: _isLoggedIn ? 'SOLICITAR CITA' : 'INICIAR SESIÓN PARA SOLICITAR',
        onPressed: () {
          if (_isLoggedIn) {
            Navigator.pushNamed(context, '/appointment-form', arguments: widget.workshop);
          } else {
            Navigator.pushNamed(context, '/login');
          }
        },
        color: const Color(0xFF10B981),
      ),
    );
  }
}
