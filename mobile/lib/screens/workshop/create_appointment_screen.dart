import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';
import 'package:workshops_mobile/widgets/kinetic_input.dart';

class WorkshopCreateAppointmentScreen extends StatefulWidget {
  final Map<String, dynamic>? appointment;
  const WorkshopCreateAppointmentScreen({super.key, this.appointment});

  @override
  State<WorkshopCreateAppointmentScreen> createState() => _WorkshopCreateAppointmentScreenState();
}

class _WorkshopCreateAppointmentScreenState extends State<WorkshopCreateAppointmentScreen> {
  final _workshopService = WorkshopService();
  final _descriptionController = TextEditingController();
  
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  String _status = 'PENDING';
  bool _isLoading = false;
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    if (widget.appointment != null) {
      _isEditing = true;
      _descriptionController.text = widget.appointment!['description'] ?? '';
      _status = widget.appointment!['status'] ?? 'PENDING';
      
      final date = DateTime.parse(widget.appointment!['date']);
      _selectedDate = date;
      _selectedTime = TimeOfDay(hour: date.hour, minute: date.minute);
    }
  }

  final List<Map<String, String>> _statusOptions = [
    {'value': 'PENDING', 'label': 'Pendiente'},
    {'value': 'ACCEPTED', 'label': 'Aceptada / Confirmada'},
    {'value': 'REJECTED', 'label': 'Rechazada'},
    {'value': 'COMPLETED', 'label': 'Completada'},
    {'value': 'CANCELLED', 'label': 'Cancelada'},
  ];

  Future<void> _submit() async {
    if (_descriptionController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, ingresa una descripción o motivo')),
      );
      return;
    }

    setState(() => _isLoading = true);

    final dateTime = DateTime(
      _selectedDate.year,
      _selectedDate.month,
      _selectedDate.day,
      _selectedTime.hour,
      _selectedTime.minute,
    );

    bool success;
    if (_isEditing) {
      success = await _workshopService.updateAppointment(
        widget.appointment!['id'],
        {
          'date': dateTime.toIso8601String(),
          'description': _descriptionController.text,
          'status': _status,
        },
      );
    } else {
      success = await _workshopService.createAppointmentStatus(
        dateTime,
        _descriptionController.text,
        _status,
      );
    }

    setState(() => _isLoading = false);

    if (success) {
      if (mounted) {
        Navigator.pop(context, true);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_isEditing ? 'Cita actualizada con éxito' : 'Entrada creada con éxito'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error al procesar la solicitud en la central'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(LucideIcons.x, color: Color(0xFF64748B), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: _isEditing ? const Color(0xFF3B82F6) : const Color(0xFF10B981), borderRadius: BorderRadius.circular(8)),
              child: Icon(_isEditing ? LucideIcons.pencil : LucideIcons.plus, color: Colors.white, size: 14),
            ),
            const SizedBox(width: 12),
            Text(
              _isEditing ? 'DETALLE DE CITA' : 'CREAR ENTRADA',
              style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 1),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSection(
              label: 'FECHA Y HORA',
              child: Row(
                children: [
                  Expanded(
                    child: _buildPicker(
                      icon: LucideIcons.calendar,
                      value: '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: _selectedDate,
                          firstDate: DateTime.now().subtract(const Duration(days: 365)),
                          lastDate: DateTime.now().add(const Duration(days: 365)),
                        );
                        if (date != null) setState(() => _selectedDate = date);
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildPicker(
                      icon: LucideIcons.clock,
                      value: _selectedTime.format(context),
                      onTap: () async {
                        final time = await showTimePicker(context: context, initialTime: _selectedTime);
                        if (time != null) setState(() => _selectedTime = time);
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            _buildSection(
              label: 'CONTROL DE CITAS Y SOLICITUDES',
              child: KineticInput(
                controller: _descriptionController,
                label: '',
                icon: LucideIcons.text_select,
                hint: 'Motivo o detalle del cliente...',
                maxLines: 5,
              ),
            ),
            const SizedBox(height: 32),
            _buildSection(
              label: 'ESTADO DE LA CITA',
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _status,
                    isExpanded: true,
                    icon: const Icon(LucideIcons.chevron_down, size: 16),
                    onChanged: (val) => setState(() => _status = val!),
                    items: _statusOptions.map((opt) {
                      return DropdownMenuItem(
                        value: opt['value'],
                        child: Text(opt['label']!, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 48),
            Row(
              children: [
                Expanded(
                  child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text('DESCARTAR', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: KineticButton(
                    label: _isEditing ? 'ACTUALIZAR CITA' : 'CREAR ENTRADA',
                    onPressed: _isLoading ? null : _submit,
                    isLoading: _isLoading,
                    color: const Color(0xFF0F172A),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({required String label, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1),
        ),
        const SizedBox(height: 12),
        child,
      ],
    );
  }

  Widget _buildPicker({required IconData icon, required String value, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: const Color(0xFF64748B)),
            const SizedBox(width: 12),
            Text(value, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
          ],
        ),
      ),
    );
  }
}
