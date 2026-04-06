import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_input.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';

class WorkshopInfoTab extends StatefulWidget {
  const WorkshopInfoTab({super.key});

  @override
  State<WorkshopInfoTab> createState() => _WorkshopInfoTabState();
}

class _WorkshopInfoTabState extends State<WorkshopInfoTab> {
  final _db = DatabaseService();
  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _isLoading = true;
  bool _isSaving = false;
  int _settingsId = 1;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query('workshop_settings');
    if (maps.isNotEmpty) {
      final s = maps.first;
      setState(() {
        _settingsId = s['id'];
        _nameController.text = s['name'] ?? '';
        _addressController.text = s['address'] ?? '';
        _phoneController.text = s['phone'] ?? '';
      });
    }
    setState(() => _isLoading = false);
  }

  Future<void> _saveSettings() async {
    setState(() => _isSaving = true);
    final db = await _db.database;
    await db.update('workshop_settings', {
      'name': _nameController.text, 'address': _addressController.text,
      'phone': _phoneController.text, 'sync_status': 0,
    }, where: 'id = ?', whereArgs: [_settingsId]);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Identidad guardada localmente! Sincronizando...')));
      setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(child: KineticHeader(title: 'Configuración / Identidad', subtitle: 'Mi Taller')),
              const SizedBox(height: 32),
              FadeInUp(delay: const Duration(milliseconds: 200), child: _buildForm()),
              const SizedBox(height: 48),
              FadeInUp(delay: const Duration(milliseconds: 400), child: KineticButton(label: 'GUARDAR CAMBIOS', isLoading: _isSaving, onPressed: _saveSettings)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32), border: Border.all(color: Colors.slate.shade100)),
      child: Column(children: [
        KineticInput(label: 'Nombre del Taller', icon: LucideIcons.warehouse, controller: _nameController),
        const SizedBox(height: 24),
        KineticInput(label: 'Dirección Fiscal', icon: LucideIcons.map_pin, controller: _addressController),
        const SizedBox(height: 24),
        KineticInput(label: 'Teléfono', icon: LucideIcons.phone, controller: _phoneController, keyboardType: TextInputType.phone),
      ]),
    );
  }
}
