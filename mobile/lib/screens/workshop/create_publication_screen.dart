import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';
import 'package:workshops_mobile/widgets/kinetic_input.dart';

class CreatePublicationScreen extends StatefulWidget {
  const CreatePublicationScreen({super.key});

  @override
  State<CreatePublicationScreen> createState() => _CreatePublicationScreenState();
}

class _CreatePublicationScreenState extends State<CreatePublicationScreen> {
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  final _api = ApiClient();
  
  bool _isLoading = false;

  void _submit() async {
    final title = _titleController.text.trim();
    final content = _contentController.text.trim();

    if (title.isEmpty || content.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Por favor, ingresa el título y contenido')));
      return;
    }

    setState(() => _isLoading = true);
    
    try {
      final res = await _api.post('/publication', {
        'title': title,
        'content': content,
        'enabled': true,
      });

      if (res.statusCode == 201 || res.statusCode == 200) {
        if (mounted) {
          Navigator.pop(context, true);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Publicación creada con éxito'), backgroundColor: Color(0xFF10B981)),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Error al crear publicación'), backgroundColor: Colors.redAccent),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error de conexión al crear publicación'), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
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
              decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(8)),
              child: const Icon(LucideIcons.plus, color: Colors.white, size: 14),
            ),
            const SizedBox(width: 12),
            Text(
              'NUEVA PUBLICACIÓN',
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
            FadeInDown(child: _buildSection('TÍTULO DE LA PUBLICACIÓN', KineticInput(controller: _titleController, label: '', icon: LucideIcons.type, hint: 'Ej: Diagnóstico Computarizado'))),
            const SizedBox(height: 32),
            FadeInDown(delay: const Duration(milliseconds: 100), child: _buildSection('CONTENIDO / OFERTA', KineticInput(controller: _contentController, label: '', icon: LucideIcons.text_select, hint: 'Detalles...', maxLines: 5))),
            const SizedBox(height: 48),
            FadeInUp(
              delay: const Duration(milliseconds: 200),
              child: Row(
                children: [
                  Expanded(child: TextButton(onPressed: () => Navigator.pop(context), child: Text('DESCARTAR', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontWeight: FontWeight.bold)))),
                  Expanded(flex: 2, child: KineticButton(label: 'PUBLICAR', onPressed: _isLoading ? null : _submit, isLoading: _isLoading, color: const Color(0xFF0F172A))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String label, Widget child) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
        const SizedBox(height: 12),
        child,
      ],
    );
  }
}
