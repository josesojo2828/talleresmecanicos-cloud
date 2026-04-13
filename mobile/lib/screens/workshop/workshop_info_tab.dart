import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_input.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';

class WorkshopInfoTab extends StatefulWidget {
  const WorkshopInfoTab({super.key});

  @override
  State<WorkshopInfoTab> createState() => _WorkshopInfoTabState();
}

class _WorkshopInfoTabState extends State<WorkshopInfoTab> {
  final _workshopService = WorkshopService();
  bool _isLoading = true;
  bool _isSaving = false;

  // Controllers
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _websiteController = TextEditingController();
  final _instagramController = TextEditingController();
  final _facebookController = TextEditingController();
  final _twitterController = TextEditingController();

  Map<String, dynamic> _openingHours = {
    'monday': {'enabled': true, 'open': '08:00', 'close': '18:00'},
    'tuesday': {'enabled': true, 'open': '08:00', 'close': '18:00'},
    'wednesday': {'enabled': true, 'open': '08:00', 'close': '18:00'},
    'thursday': {'enabled': true, 'open': '08:00', 'close': '18:00'},
    'friday': {'enabled': true, 'open': '08:00', 'close': '18:00'},
    'saturday': {'enabled': false, 'open': '08:00', 'close': '12:00'},
    'sunday': {'enabled': false, 'open': '08:00', 'close': '12:00'},
  };

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final data = await _workshopService.getMyWorkshop();
    if (data != null && mounted) {
      setState(() {
        _nameController.text = data['name'] ?? '';
        _descController.text = data['description'] ?? '';
        _addressController.text = data['address'] ?? '';
        _phoneController.text = data['phone'] ?? '';
        _whatsappController.text = data['whatsapp'] ?? '';
        _websiteController.text = data['website'] ?? '';
        
        final social = data['socialMedia'] as Map<String, dynamic>? ?? {};
        _instagramController.text = social['instagram'] ?? '';
        _facebookController.text = social['facebook'] ?? '';
        _twitterController.text = social['twitter'] ?? '';

        if (data['openingHours'] != null) {
          _openingHours = Map<String, dynamic>.from(data['openingHours']);
        }
        
        _isLoading = false;
      });
    }
  }

  Future<void> _save() async {
    setState(() => _isSaving = true);
    
    final payload = {
      'name': _nameController.text,
      'description': _descController.text,
      'address': _addressController.text,
      'phone': _phoneController.text,
      'whatsapp': _whatsappController.text,
      'website': _websiteController.text,
      'socialMedia': {
        'instagram': _instagramController.text,
        'facebook': _facebookController.text,
        'twitter': _twitterController.text,
      },
      'openingHours': _openingHours,
    };

    final success = await _workshopService.updateWorkshop(payload);
    
    if (mounted) {
      setState(() => _isSaving = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success ? 'Perfil actualizado en la central!' : 'Error de enlace con central'),
          backgroundColor: success ? const Color(0xFF10B981) : Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverPadding(
            padding: const EdgeInsets.all(24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildIdentidadSeccion(),
                const SizedBox(height: 24),
                _buildDigitalChannelsSeccion(),
                const SizedBox(height: 24),
                _buildScheduleSeccion(),
                const SizedBox(height: 80),
              ]),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _isSaving ? null : _save,
        backgroundColor: const Color(0xFF0F172A),
        icon: _isSaving ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(LucideIcons.save, color: Colors.white),
        label: Text('GUARDAR CAMBIOS', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 180,
      backgroundColor: const Color(0xFF0F172A),
      pinned: true,
      elevation: 0,
      automaticallyImplyLeading: false,
      flexibleSpace: FlexibleSpaceBar(
        centerTitle: false,
        titlePadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('GESTIÓN DE TALLER', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF10B981), letterSpacing: 1.5)),
            Text('Centro de Control Administrativo', style: GoogleFonts.outfit(fontSize: 10, color: Colors.white60, fontWeight: FontWeight.bold)),
          ],
        ),
        background: Stack(
          children: [
            Positioned(right: -20, top: -20, child: Icon(LucideIcons.settings, size: 200, color: Colors.white.withOpacity(0.03))),
          ],
        ),
      ),
    );
  }

  Widget _buildIdentidadSeccion() {
    return FadeInUp(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeading(LucideIcons.contact_round, 'IDENTIDAD CORPORATIVA'),
          const SizedBox(height: 16),
          _buildCardForm([
            KineticInput(controller: _nameController, label: 'Nombre Comercial', icon: LucideIcons.building_2),
            const SizedBox(height: 20),
            KineticInput(controller: _descController, label: 'Descripción del Servicio', icon: LucideIcons.text_select, maxLines: 3),
            const SizedBox(height: 20),
            KineticInput(controller: _addressController, label: 'Dirección Física', icon: LucideIcons.map_pin),
          ]),
        ],
      ),
    );
  }

  Widget _buildDigitalChannelsSeccion() {
    return FadeInUp(
      delay: const Duration(milliseconds: 200),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeading(LucideIcons.share_2, 'CANALES DIGITALES'),
          const SizedBox(height: 16),
          _buildCardForm([
            KineticInput(controller: _phoneController, label: 'Línea Directa', icon: LucideIcons.phone),
            const SizedBox(height: 20),
            KineticInput(controller: _whatsappController, label: 'WhatsApp de Boxes', icon: LucideIcons.message_circle),
            const SizedBox(height: 20),
            KineticInput(controller: _websiteController, label: 'Sitio Web', icon: LucideIcons.globe),
            const Divider(height: 48),
            KineticInput(controller: _instagramController, label: 'Instagram', icon: LucideIcons.instagram),
            const SizedBox(height: 20),
            KineticInput(controller: _facebookController, label: 'Facebook', icon: LucideIcons.facebook),
          ]),
        ],
      ),
    );
  }

  Widget _buildScheduleSeccion() {
    return FadeInUp(
      delay: const Duration(milliseconds: 400),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeading(LucideIcons.calendar_clock, 'CALENDARIO OPERATIVO'),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32)),
            child: Column(
              children: _openingHours.keys.map((day) => _buildDayToggle(day)).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDayToggle(String day) {
    final status = _openingHours[day] as Map<String, dynamic>;
    final isEnabled = status['enabled'] as bool;
    final dayNames = {'monday': 'LUNES', 'tuesday': 'MARTES', 'wednesday': 'MIÉRCOLES', 'thursday': 'JUEVES', 'friday': 'VIERNES', 'saturday': 'SÁBADO', 'sunday': 'DOMINGO'};

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Switch.adaptive(value: isEnabled, activeColor: const Color(0xFF10B981), onChanged: (val) => setState(() => _openingHours[day]['enabled'] = val)),
          const SizedBox(width: 8),
          Expanded(child: Text(dayNames[day]!, style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 11, color: isEnabled ? const Color(0xFF0F172A) : const Color(0xFF94A3B8)))),
          if (isEnabled) ...[
            _buildTimeBox(day, 'open'),
            Padding(padding: const EdgeInsets.symmetric(horizontal: 8), child: Text('>', style: GoogleFonts.outfit(color: const Color(0xFFCBD5E1), fontSize: 10))),
            _buildTimeBox(day, 'close'),
          ] else Text('CERRADO', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.redAccent.withOpacity(0.5))),
        ],
      ),
    );
  }

  Widget _buildTimeBox(String day, String type) {
    return GestureDetector(
      onTap: () async {
        final time = await showTimePicker(context: context, initialTime: TimeOfDay(hour: int.parse(_openingHours[day][type].split(':')[0]), minute: int.parse(_openingHours[day][type].split(':')[1])));
        if (time != null) setState(() => _openingHours[day][type] = '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}');
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
        child: Text(_openingHours[day][type], style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF64748B))),
      ),
    );
  }

  Widget _buildCardForm(List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32), border: Border.all(color: const Color(0xFFF1F5F9))),
      child: Column(children: children),
    );
  }

  Widget _buildHeading(IconData icon, String title) {
    return Row(children: [
      Icon(icon, size: 16, color: const Color(0xFF10B981)),
      const SizedBox(width: 12),
      Text(title, style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 1)),
    ]);
  }
}
