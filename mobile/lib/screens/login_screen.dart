import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/widgets/kinetic_input.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _auth = AuthService();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _checkBiometrics();
  }

  Future<void> _checkBiometrics() async {
    final authenticated = await _auth.authenticateWithBiometrics();
    if (authenticated && mounted) {
      final role = await _auth.getUserRole();
      Navigator.pushReplacementNamed(context, role == 'TALLER' ? '/workshop' : '/support');
    }
  }

  Future<void> _login() async {
    setState(() => _isLoading = true);
    final success = await _auth.login(_emailController.text, _passwordController.text);
    if (success && mounted) {
      final role = await _auth.getUserRole();
      _showBiometricSetupIfNeeded(role);
    } else {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Credenciales incorrectas balín. Ponete las pilas.')));
      setState(() => _isLoading = false);
    }
  }

  void _showBiometricSetupIfNeeded(String role) async {
    final canBiometric = await _auth.canAuthenticateWithBiometrics();
    if (canBiometric && mounted) {
      showDialog(context: context, builder: (context) => AlertDialog(
        title: Text('¿ACTIVAR DEDO?', style: GoogleFonts.outfit(fontWeight: FontWeight.w900)),
        content: const Text('Para la próxima vuelta podés entrar con tu huella digital.'),
        actions: [
          TextButton(onPressed: () => Navigator.pushReplacementNamed(context, role == 'TALLER' ? '/workshop' : '/support'), child: const Text('LUEGO')),
          ElevatedButton(onPressed: () => Navigator.pushReplacementNamed(context, role == 'TALLER' ? '/workshop' : '/support'), child: const Text('ACTIVAR')),
        ],
      ));
    } else {
      if (mounted) Navigator.pushReplacementNamed(context, role == 'TALLER' ? '/workshop' : '/support');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              FadeInDown(child: const CircleAvatar(radius: 40, backgroundColor: Color(0xFF10B981), child: Icon(LucideIcons.gauge, size: 40, color: Colors.white))),
              const SizedBox(height: 24),
              FadeInDown(delay: const Duration(milliseconds: 200), child: Text('KINETIC ATELIER', style: GoogleFonts.outfit(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: 2))),
              const SizedBox(height: 8),
              FadeInDown(delay: const Duration(milliseconds: 400), child: Text('Ingreso a la terminal oficial', style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.bold))),
              const SizedBox(height: 48),
              _buildLoginForm(),
              const SizedBox(height: 32),
              FadeInUp(delay: const Duration(milliseconds: 600), child: KineticButton(label: 'ENTRAR A PISTA', isLoading: _isLoading, onPressed: _login, color: const Color(0xFF10B981), textColor: const Color(0xFF0F172A))),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoginForm() {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32)),
        child: Column(children: [
          KineticInput(label: 'Email del Piloto', icon: LucideIcons.mail, controller: _emailController, keyboardType: TextInputType.emailAddress),
          const SizedBox(height: 24),
          KineticInput(label: 'Contraseña Secreta', icon: LucideIcons.key_round, controller: _passwordController, isPassword: true),
        ]),
      ),
    );
  }
}
