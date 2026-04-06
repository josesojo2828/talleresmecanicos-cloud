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
  final _clientController = TextEditingController();
  final _carController = TextEditingController();
  final _laborController = TextEditingController();
  final _partsController = TextEditingController();
  final _salesService = SalesService();
  bool _isLoading = false;

  void _submit() async {
    final client = _clientController.text.trim();
    final car = _carController.text.trim();
    final labor = double.tryParse(_laborController.text) ?? 0.0;
    final parts = double.tryParse(_partsController.text) ?? 0.0;

    if (client.isEmpty || car.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Por favor, completa cliente y vehículo')));
      return;
    }

    setState(() => _isLoading = true);
    
    await _salesService.createWorkOrder({
      'client_id': 'PUBLIC_CLIENT', // Backend asignará el real
      'car_info': '$car ($client)',
      'labor_price': labor,
      'parts_price': parts,
      'total_price': labor + parts,
      'status': 'COMPLETED',
    });

    if (mounted) {
      setState(() => _isLoading = false);
      Navigator.pop(context, true); // Volvemos avisando que hubo cambio
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Orden guardada localmente - Sincronización en curso'), backgroundColor: Color(0xFF10B981)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('NUEVA ORDEN', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 2)),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(child: _buildField('DATOS DEL CLIENTE', LucideIcons.user, _clientController, 'Nombre Completo / Empresa')),
            const SizedBox(height: 24),
            FadeInDown(delay: const Duration(milliseconds: 100), child: _buildField('DATOS DEL VEHÍCULO', LucideIcons.car, _carController, 'Marca, Modelo, Patente')),
            const SizedBox(height: 48),
            _buildSectionTitle('DESGLOSE FINANCIERO'),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(child: FadeInLeft(delay: const Duration(milliseconds: 200), child: _buildPriceField('MANO DE OBRA', _laborController))),
                const SizedBox(width: 16),
                Expanded(child: FadeInRight(delay: const Duration(milliseconds: 200), child: _buildPriceField('REPUESTOS', _partsController))),
              ],
            ),
            const SizedBox(height: 64),
            FadeInUp(
              delay: const Duration(milliseconds: 400),
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

  Widget _buildPriceField(String label, TextEditingController controller) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
      const SizedBox(height: 12),
      TextField(
        controller: controller,
        keyboardType: TextInputType.number,
        style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 18),
        decoration: InputDecoration(
          prefixIcon: const Icon(LucideIcons.dollar_sign, size: 18),
          filled: true, fillColor: const Color(0xFFF8FAFC),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
        ),
      ),
    ]);
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2));
  }
}
