import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SupportAccountScreen extends StatefulWidget {
  const SupportAccountScreen({super.key});

  @override
  State<SupportAccountScreen> createState() => _SupportAccountScreenState();
}

class _SupportAccountScreenState extends State<SupportAccountScreen> {
  final _formKey = GlobalKey<FormState>();
  final _api = ApiClient();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _firstNameController.text = prefs.getString('user_name')?.split(' ').first ?? '';
      _lastNameController.text = prefs.getString('user_name')?.split(' ').last ?? '';
      _emailController.text = prefs.getString('user_email') ?? '';
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      final response = await _api.patch('/user/profile', {
        'firstName': _firstNameController.text,
        'lastName': _lastNameController.text,
        'email': _emailController.text,
      });

      if (response.statusCode == 200 || response.statusCode == 201) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user_name', '${_firstNameController.text} ${_lastNameController.text}');
        await prefs.setString('user_email', _emailController.text);
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Datos actualizados'), backgroundColor: Colors.green));
          Navigator.pop(context, true);
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
        title: Text('DATOS DE LA CUENTA', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 1)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildFieldLabel('NOMBRE'),
              _buildTextField(_firstNameController, LucideIcons.user),
              const SizedBox(height: 20),
              _buildFieldLabel('APELLIDO'),
              _buildTextField(_lastNameController, LucideIcons.user),
              const SizedBox(height: 20),
              _buildFieldLabel('CORREO ELECTRÓNICO'),
              _buildTextField(_emailController, LucideIcons.mail, keyboardType: TextInputType.emailAddress),
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

  Widget _buildTextField(TextEditingController controller, IconData icon, {TextInputType? keyboardType}) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: (value) => value == null || value.isEmpty ? 'Requerido' : null,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, size: 18, color: const Color(0xFF64748B)),
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
        child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text('GUARDAR CAMBIOS', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }
}
