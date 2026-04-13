import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/inventory_service.dart';

class CreatePartScreen extends StatefulWidget {
  const CreatePartScreen({super.key});

  @override
  State<CreatePartScreen> createState() => _CreatePartScreenState();
}

class _CreatePartScreenState extends State<CreatePartScreen> {
  final _nameController = TextEditingController();
  final _skuController = TextEditingController();
  final _priceController = TextEditingController(text: '0');
  final _quantityController = TextEditingController(text: '1');
  final _descController = TextEditingController();
  
  String _currency = 'USD';
  final List<String> _currencies = ['USD', 'COP', 'ARS', 'MXN', 'JPY'];
  
  final _inventoryService = InventoryService();
  bool _isLoading = false;

  void _submit() async {
    final name = _nameController.text.trim();
    final price = double.tryParse(_priceController.text) ?? 0.0;
    final quantity = int.tryParse(_quantityController.text) ?? 0;

    if (name.isEmpty || quantity <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Por favor, completa nombre y cantidad válida')));
      return;
    }

    setState(() => _isLoading = true);
    
    await _inventoryService.addPartOffline({
      'name': name,
      'sku': _skuController.text.trim(),
      'price': price,
      'quantity': quantity,
      'currency': _currency,
      'description': _descController.text.trim(),
      'category': 'REPUESTOS',
    });

    if (mounted) {
      setState(() => _isLoading = false);
      Navigator.pop(context, true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Stock registrado - Sincronizando'), backgroundColor: Color(0xFF3B82F6)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('ALTA DE STOCK', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 2)),
        elevation: 0, backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(child: _buildField('NOMBRE DEL REPUESTO', LucideIcons.package, _nameController, 'Ej: Pastillas de Freno')),
            const SizedBox(height: 24),
            FadeInDown(delay: const Duration(milliseconds: 100), child: _buildField('SKU / CÓDIGO', LucideIcons.barcode, _skuController, 'Referencia técnica')),
            const SizedBox(height: 48),
            _buildSectionTitle('VALORES Y CANTIDAD'),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(flex: 2, child: FadeInLeft(delay: const Duration(milliseconds: 200), child: _buildNumericField('PRECIO UNIT.', LucideIcons.dollar_sign, _priceController))),
                const SizedBox(width: 12),
                Expanded(flex: 1, child: FadeInRight(delay: const Duration(milliseconds: 200), child: _buildDropdown('MONEDA', _currencies, _currency, (v) => setState(() => _currency = v!)))),
              ],
            ),
            const SizedBox(height: 24),
            FadeInUp(delay: const Duration(milliseconds: 300), child: _buildNumericField('STOCK DISPONIBLE', LucideIcons.layers, _quantityController)),
            const SizedBox(height: 24),
            FadeInUp(delay: const Duration(milliseconds: 400), child: _buildField('DESCRIPCIÓN', LucideIcons.align_left, _descController, 'Detalles adicionales...', maxLines: 3)),
            const SizedBox(height: 64),
            FadeInUp(
              delay: const Duration(milliseconds: 500),
              child: SizedBox(
                width: double.infinity,
                height: 64,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3B82F6),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    elevation: 0,
                  ),
                  child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text('REGISTRAR REPUESTO', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, letterSpacing: 1)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, IconData icon, TextEditingController controller, String hint, {int maxLines = 1}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2)),
      const SizedBox(height: 12),
      TextField(
        controller: controller,
        maxLines: maxLines,
        style: GoogleFonts.outfit(fontWeight: FontWeight.bold),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, size: 20, color: const Color(0xFF64748B)),
          hintText: hint,
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

  Widget _buildDropdown(String label, List<String> options, String value, Function(String?) onChanged) {
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
            items: options.map((opt) => DropdownMenuItem(value: opt, child: Text(opt))).toList(),
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
