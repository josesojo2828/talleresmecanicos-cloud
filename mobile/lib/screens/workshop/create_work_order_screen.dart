import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/sales_service.dart';

class CreateWorkOrderScreen extends StatefulWidget {
  const CreateWorkOrderScreen({super.key});

  @override
  State<CreateWorkOrderScreen> createState() => _CreateWorkOrderScreenState();
}

class _CreateWorkOrderScreenState extends State<CreateWorkOrderScreen> {
  final _titleController = TextEditingController();
  final _clientNameController = TextEditingController();
  final _clientPhoneController = TextEditingController();
  final _plateController = TextEditingController();
  final _laborController = TextEditingController(text: '0');
  
  String _currency = 'USD';
  String _status = 'OPEN';
  
  final _salesService = SalesService();
  bool _isLoading = false;

  final List<String> _currencies = ['USD', 'COP', 'ARS', 'MXN', 'JPY'];
  final Map<String, String> _statuses = {
    'OPEN': 'ABIERTO',
    'IN_PROGRESS': 'EN PROGRESO',
    'COMPLETED': 'COMPLETADO',
    'DELIVERED': 'ENTREGADO',
  };

  void _submit() async {
    final title = _titleController.text.trim();
    final clientName = _clientNameController.text.trim();
    final labor = double.tryParse(_laborController.text) ?? 0.0;

    if (title.isEmpty || clientName.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Por favor, completa título y cliente')));
      return;
    }

    setState(() => _isLoading = true);
    
    await _salesService.createWorkOrder({
      'title': title,
      'client_name': clientName,
      'client_phone': _clientPhoneController.text.trim(),
      'car_info': _plateController.text.trim(), // Lo guardamos en car_info para compatibilidad con lista vieja
      'labor_price': labor,
      'currency': _currency,
      'status': _status,
      'parts_price': 0.0,
      'total_price': labor,
    });

    if (mounted) {
      setState(() => _isLoading = false);
      Navigator.pop(context, true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Orden guardada localmente - Sincronizando'), backgroundColor: Color(0xFF10B981)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('NUEVA ORDEN', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 2)),
        elevation: 0, backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(child: _buildField('TÍTULO DE LA OBRA', LucideIcons.wrench, _titleController, 'Ej: Cambio de Frenos')),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(child: FadeInLeft(delay: const Duration(milliseconds: 100), child: _buildField('CLIENTE', LucideIcons.user, _clientNameController, 'Nombre'))),
                const SizedBox(width: 16),
                Expanded(child: FadeInRight(delay: const Duration(milliseconds: 100), child: _buildField('TELÉFONO', LucideIcons.phone, _clientPhoneController, 'Número'))),
              ],
            ),
            const SizedBox(height: 24),
            FadeInDown(delay: const Duration(milliseconds: 200), child: _buildField('PATENTE / VEHÍCULO', LucideIcons.car, _plateController, 'Patente o Modelo')),
            const SizedBox(height: 48),
            _buildSectionTitle('DESGLOSE Y ESTADO'),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(flex: 2, child: FadeInLeft(delay: const Duration(milliseconds: 300), child: _buildNumericField('MANO DE OBRA', LucideIcons.dollar_sign, _laborController))),
                const SizedBox(width: 16),
                Expanded(flex: 1, child: FadeInRight(delay: const Duration(milliseconds: 300), child: _buildDropdown('MONEDA', _currencies, _currency, (v) => setState(() => _currency = v!)))),
              ],
            ),
            const SizedBox(height: 24),
            FadeInUp(delay: const Duration(milliseconds: 400), child: _buildDropdown('ESTADO INICIAL', _statuses.keys.toList(), _status, (v) => setState(() => _status = v!), labels: _statuses)),
            const SizedBox(height: 64),
            FadeInUp(
              delay: const Duration(milliseconds: 500),
              child: SizedBox(
                width: double.infinity,
                height: 64,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F172A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    elevation: 0,
                  ),
                  child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text('CONFIRMAR TRABAJO', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, letterSpacing: 1)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, IconData icon, TextEditingController controller, String hint) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2)),
      const SizedBox(height: 12),
      TextField(
        controller: controller,
        style: GoogleFonts.outfit(fontWeight: FontWeight.bold),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, size: 20, color: const Color(0xFF64748B)),
          hintText: hint,
          hintStyle: GoogleFonts.outfit(color: Colors.grey.shade400, fontSize: 13),
          filled: true, fillColor: const Color(0xFFF8FAFC),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
        ),
      ),
    ]);
  }

  Widget _buildNumericField(String label, IconData icon, TextEditingController controller) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
      const SizedBox(height: 12),
      TextField(
        controller: controller,
        keyboardType: TextInputType.number,
        style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 18),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, size: 18),
          filled: true, fillColor: const Color(0xFFF8FAFC),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
        ),
      ),
    ]);
  }

  Widget _buildDropdown(String label, List<String> options, String value, Function(String?) onChanged, {Map<String, String>? labels}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
      const SizedBox(height: 12),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(20)),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: value,
            isExpanded: true,
            icon: const Icon(LucideIcons.chevron_down, size: 16),
            style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF0F172A)),
            items: options.map((opt) => DropdownMenuItem(value: opt, child: Text(labels?[opt] ?? opt))).toList(),
            onChanged: onChanged,
          ),
        ),
      ),
    ]);
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2));
  }
}
