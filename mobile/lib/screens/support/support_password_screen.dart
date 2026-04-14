import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';

class SupportPasswordScreen extends StatefulWidget {
  const SupportPasswordScreen({super.key});

  @override
  State<SupportPasswordScreen> createState() => _SupportPasswordScreenState();
}

class _SupportPasswordScreenState extends State<SupportPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _api = ApiClient();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _isLoading = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_passwordController.text != _confirmController.text) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Las contraseñas no coinciden'), backgroundColor: Colors.redAccent));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final response = await _api.patch('/user/profile', {
        'passwordHash': _passwordController.text, // El backend lo hashea automáticamente
      });

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Contraseña actualizada con éxito'), backgroundColor: Colors.green));
          Navigator.pop(context);
        }
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.redAccent));
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
        leading: IconButton(icon: const Icon(LucideIcons.chevron_left, color: Color(0xFF0F172A)), onPressed: () => Navigator.pop(context)),
        title: Text('CAMBIAR CONTRASEÑA', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 1)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              _buildFieldLabel('NUEVA CONTRASEÑA'),
              _buildTextField(_passwordController, 'Mínimo 6 caracteres'),
              const SizedBox(height: 20),
              _buildFieldLabel('CONFIRMAR CONTRASEÑA'),
              _buildTextField(_confirmController, 'Repite la contraseña'),
              const SizedBox(height: 48),
              _buildSubmitButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFieldLabel(String label) => Padding(
    padding: const EdgeInsets.only(bottom: 8, left: 4),
    child: Text(label, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
  );

  Widget _buildTextField(TextEditingController controller, String hint) {
    return TextFormField(
      controller: controller,
      obscureText: true,
      validator: (value) => value != null && value.length < 6 ? 'Mínimo 6 caracteres' : null,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.outfit(color: const Color(0xFFCBD5E1), fontSize: 13),
        prefixIcon: const Icon(LucideIcons.lock, size: 18, color: const Color(0xFF64748B)),
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
      ),
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _submit,
        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F172A), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)), elevation: 0),
        child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text('ACTUALIZAR CONTRASEÑA', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }
}
