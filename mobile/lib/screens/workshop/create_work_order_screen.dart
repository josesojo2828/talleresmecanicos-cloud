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
  final _plateController = TextEditingController();
  
  String _status = 'OPEN';
  String? _selectedWorkshopClientId;
  
  final _salesService = SalesService();
  bool _isLoading = false;

  final Map<String, String> _statuses = {
    'OPEN': 'ABIERTO',
    'IN_PROGRESS': 'EN PROGRESO',
    'COMPLETED': 'COMPLETADO',
    'DELIVERED': 'ENTREGADO',
  };

  void _submit() async {
    final title = _titleController.text.trim();
    final clientName = _clientNameController.text.trim();

    if (title.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Por favor, ingresa un título para el trabajo')));
      return;
    }

    setState(() => _isLoading = true);
    
    await _salesService.createWorkOrder({
      'title': title,
      'client_name': clientName,
      'workshop_client_id': _selectedWorkshopClientId,
      'car_info': _plateController.text.trim(),
      'labor_price': 0.0,
      'currency': 'USD',
      'status': _status,
      'parts_price': 0.0,
      'total_price': 0.0,
    });

    if (mounted) {
      setState(() => _isLoading = false);
      Navigator.pop(context, true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Orden guardada localmente - Sincronizando'), backgroundColor: Color(0xFF10B981)),
      );
    }
  }

  Future<List<Map<String, dynamic>>> _searchClients(String query) async {
    if (query.isEmpty) return [];
    return await _salesService.getClients(query);
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
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(child: _buildField('TÍTULO DEL TRABAJO', LucideIcons.wrench, _titleController, 'Ej: Cambio de Frenos')),
            const SizedBox(height: 32),
            FadeInLeft(
              delay: const Duration(milliseconds: 100), 
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('CLIENTE (OPCIONAL)', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2)),
                  const SizedBox(height: 12),
                  Autocomplete<Map<String, dynamic>>(
                    displayStringForOption: (option) => option['first_name'] ?? '',
                    optionsBuilder: (textEditingValue) => _searchClients(textEditingValue.text),
                    onSelected: (option) {
                      setState(() {
                        _clientNameController.text = option['first_name'] ?? '';
                        _selectedWorkshopClientId = option['id'];
                      });
                    },
                    fieldViewBuilder: (context, controller, focusNode, onFieldSubmitted) {
                      return TextField(
                        controller: controller,
                        focusNode: focusNode,
                        onChanged: (v) {
                          _clientNameController.text = v;
                          _selectedWorkshopClientId = null;
                        },
                        style: GoogleFonts.outfit(fontWeight: FontWeight.bold),
                        decoration: InputDecoration(
                          prefixIcon: const Icon(LucideIcons.user, size: 20, color: Color(0xFF64748B)),
                          hintText: 'Nombre del cliente',
                          hintStyle: GoogleFonts.outfit(color: Colors.grey.shade400, fontSize: 13),
                          filled: true, fillColor: const Color(0xFFF8FAFC),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
                        ),
                      );
                    },
                    optionsViewBuilder: (context, onSelected, options) {
                      return Align(
                        alignment: Alignment.topLeft,
                        child: Material(
                          elevation: 10,
                          borderRadius: BorderRadius.circular(24),
                          clipBehavior: Clip.antiAlias,
                          child: Container(
                            width: MediaQuery.of(context).size.width - 64,
                            constraints: const BoxConstraints(maxHeight: 250),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: ListView.separated(
                              padding: EdgeInsets.zero,
                              shrinkWrap: true,
                              itemCount: options.length,
                              separatorBuilder: (context, index) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
                              itemBuilder: (context, index) {
                                final option = options.elementAt(index);
                                return ListTile(
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                                  title: Text(option['first_name'] + " " + (option['last_name'] ?? ''), style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14)),
                                  subtitle: Text(option['phone'] ?? 'Sin teléfono', style: GoogleFonts.outfit(fontSize: 11, color: const Color(0xFF94A3B8))),
                                  onTap: () => onSelected(option),
                                );
                              },
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            FadeInDown(delay: const Duration(milliseconds: 200), child: _buildField('PATENTE / VEHÍCULO', LucideIcons.car, _plateController, 'Placa o descripción del auto')),
            const SizedBox(height: 32),
            FadeInUp(delay: const Duration(milliseconds: 300), child: _buildDropdown('ESTADO DEL TRABAJO', _statuses.keys.toList(), _status, (v) => setState(() => _status = v!), labels: _statuses)),
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
                  child: _isLoading 
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) 
                    : Text('CREAR ORDEN', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, letterSpacing: 1, fontSize: 14)),
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

  Widget _buildDropdown(String label, List<String> options, String value, Function(String?) onChanged, {Map<String, String>? labels}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2)),
      const SizedBox(height: 12),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 20),
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
}
