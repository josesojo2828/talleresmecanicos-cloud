import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';

class CreateCityScreen extends StatefulWidget {
  final List<dynamic> assignedCountries;
  const CreateCityScreen({super.key, required this.assignedCountries});

  @override
  State<CreateCityScreen> createState() => _CreateCityScreenState();
}

class _CreateCityScreenState extends State<CreateCityScreen> {
  final _formKey = GlobalKey<FormState>();
  final _api = ApiClient();
  final _nameController = TextEditingController();
  
  String? _selectedCountryId;
  bool _isLoading = false;
  bool _isEnabled = true;

  @override
  void initState() {
    super.initState();
    // Si solo hay un país asignado, lo pre-seleccionamos
    if (widget.assignedCountries.length == 1) {
      _selectedCountryId = widget.assignedCountries.first['id'];
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _selectedCountryId == null) return;

    setState(() => _isLoading = true);
    try {
      final response = await _api.post('/city', {
        'name': _nameController.text,
        'countryId': _selectedCountryId,
        'enabled': _isEnabled,
      });

      if (response.statusCode == 201 || response.statusCode == 200) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Ciudad creada con éxito'), backgroundColor: Colors.green),
          );
          Navigator.pop(context);
        }
      } else {
        throw Exception('Error al crear ciudad');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.x, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'NUEVA CIUDAD',
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 1),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildFieldLabel('PAÍS ASIGNADO'),
              _buildCountrySelector(),
              const SizedBox(height: 24),
              _buildFieldLabel('NOMBRE DE LA CIUDAD'),
              _buildTextField(_nameController, 'Ej. Ciudad de México', LucideIcons.building_2),
              const SizedBox(height: 24),
              _buildEnabledSwitch(),
              const SizedBox(height: 48),
              _buildSubmitButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFieldLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 4),
      child: Text(
        label,
        style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1),
      ),
    );
  }

  Widget _buildCountrySelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(16)),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedCountryId,
          hint: Text('Seleccionar país', style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFFCBD5E1))),
          isExpanded: true,
          icon: const Icon(LucideIcons.chevron_down, size: 16),
          onChanged: widget.assignedCountries.length > 1
              ? (String? newValue) { setState(() { _selectedCountryId = newValue; }); }
              : null, // Si tiene uno solo, queda bloqueado
          items: widget.assignedCountries.map<DropdownMenuItem<String>>((c) {
            return DropdownMenuItem<String>(
              value: c['id'],
              child: Row(
                children: [
                  Text(c['flag'] ?? '🌍'),
                  const SizedBox(width: 8),
                  Text(c['name'], style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFF0F172A))),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint, IconData icon) {
    return TextFormField(
      controller: controller,
      validator: (value) => value == null || value.isEmpty ? 'Requerido' : null,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.outfit(color: const Color(0xFFCBD5E1), fontSize: 14),
        prefixIcon: Icon(icon, size: 18, color: const Color(0xFF64748B)),
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
      ),
    );
  }

  Widget _buildEnabledSwitch() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildFieldLabel('¿HABILITAR CIUDAD AL CREAR?'),
        Switch(
          value: _isEnabled,
          onChanged: (val) => setState(() => _isEnabled = val),
          activeColor: const Color(0xFF10B981),
        ),
      ],
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _submit,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF0F172A),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
        ),
        child: _isLoading
            ? const CircularProgressIndicator(color: Colors.white)
            : Text('CREAR CIUDAD', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }
}
