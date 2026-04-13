import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/widgets/kinetic_input.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';

class UserProfileScreen extends StatefulWidget {
  const UserProfileScreen({super.key});

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  final _auth = AuthService();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  
  bool _isLoading = true;
  bool _isSaving = false;
  bool _useBiometrics = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final user = await _auth.getUser();
    final prefs = await SharedPreferences.getInstance();
    if (mounted && user != null) {
      setState(() {
        _firstNameController.text = user['firstName'] ?? '';
        _lastNameController.text = user['lastName'] ?? '';
        _emailController.text = user['email'] ?? '';
        _useBiometrics = prefs.getBool('use_biometrics') ?? false;
        _isLoading = false;
      });
    }
  }

  Future<void> _save() async {
    setState(() => _isSaving = true);
    
    final payload = {
      'firstName': _firstNameController.text,
      'lastName': _lastNameController.text,
    };
    
    if (_passwordController.text.isNotEmpty) {
      payload['password'] = _passwordController.text;
    }

    final success = await _auth.updateProfile(payload);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('use_biometrics', _useBiometrics);
    
    setState(() => _isSaving = false);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success ? 'Configuración actualizada correctamente' : 'Error al actualizar perfil'), 
          backgroundColor: success ? const Color(0xFF10B981) : Colors.redAccent,
        )
      );
      if (success) _passwordController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF1F5F9),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrow_left, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
        : SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FadeInDown(
                  child: const KineticHeader(
                    title: 'CONFIGURACIÓN DE CUENTA',
                    subtitle: 'Gestioná tus datos personales y seguridad',
                  ),
                ),
                const SizedBox(height: 32),
                
                _buildSection('DATOS PERSONALES', LucideIcons.user, [
                  KineticInput(label: 'NOMBRE', controller: _firstNameController, icon: LucideIcons.user),
                  const SizedBox(height: 20),
                  KineticInput(label: 'APELLIDO', controller: _lastNameController, icon: LucideIcons.user),
                  const SizedBox(height: 20),
                  KineticInput(label: 'EMAIL', controller: _emailController, icon: LucideIcons.mail, enabled: false),
                ]),

                const SizedBox(height: 24),

                _buildSection('SEGURIDAD', LucideIcons.shield_check, [
                  _buildSwitchTile(
                    'ACCESO BIOMÉTRICO', 
                    'Usar huella para ingresar a la app', 
                    LucideIcons.fingerprint, 
                    _useBiometrics,
                    (val) => setState(() => _useBiometrics = val)
                  ),
                  const Divider(height: 32, color: Color(0xFFF1F5F9)),
                  KineticInput(
                    label: 'ACTUALIZAR CONTRASEÑA', 
                    controller: _passwordController, 
                    icon: LucideIcons.lock, 
                    isPassword: true,
                    hint: 'Dejar en blanco para mantener actual',
                  ),
                ]),

                const SizedBox(height: 40),
                FadeInUp(
                  child: KineticButton(
                    label: 'GUARDAR CAMBIOS',
                    onPressed: _isSaving ? null : _save,
                    isLoading: _isSaving,
                    color: const Color(0xFF0F172A),
                  ),
                ),
              ],
            ),
          ),
    );
  }

  Widget _buildSection(String title, IconData icon, List<Widget> children) {
    return FadeInUp(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: const Color(0xFF10B981)),
              const SizedBox(width: 8),
              Text(title, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF475569), letterSpacing: 1.5)),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(children: children),
          ),
        ],
      ),
    );
  }

  Widget _buildSwitchTile(String title, String sub, IconData icon, bool value, Function(bool) onChanged) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: const Color(0xFF64748B), size: 18),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
              Text(sub, style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF94A3B8), fontWeight: FontWeight.w500)),
            ],
          ),
        ),
        Switch.adaptive(
          value: value, 
          activeColor: const Color(0xFF10B981),
          onChanged: onChanged
        ),
      ],
    );
  }
}
