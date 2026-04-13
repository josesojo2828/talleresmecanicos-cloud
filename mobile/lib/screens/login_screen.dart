import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
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
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    debugPrint('########## TOKEN ALMACENADO: $token ##########');

    if (token == null) {
      debugPrint('########## SIN SESIÓN PREVIA: No se intenta biometría ##########');
      return;
    }

    final authenticated = await _auth.authenticateWithBiometrics();
    debugPrint('########## RESULTADO BIOMETRÍA: $authenticated ##########');

    if (authenticated && mounted) {
      final role = await _auth.getUserRole();
      debugPrint('########## ROL RECUPERADO: $role ##########');
      Navigator.pushReplacementNamed(context, role == 'TALLER' ? '/dashboard/workshop' : '/dashboard/support');
    }
  }

  Future<void> _login() async {
    setState(() => _isLoading = true);
    debugPrint('########## INTENTANDO LOGIN: ${_emailController.text} ##########');
    final success = await _auth.login(_emailController.text, _passwordController.text);
    
    if (success && mounted) {
      final role = await _auth.getUserRole();
      debugPrint('########## LOGIN EXITOSO: ROL: $role ##########');
      _showBiometricSetupIfNeeded(role);
    } else {
      debugPrint('########## LOGIN FALLIDO: Credenciales o Respuesta Inválida ##########');
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Credenciales incorrectas balín. Ponete las pilas.')));
      setState(() => _isLoading = false);
    }
  }

  void _showBiometricSetupIfNeeded(String role) async {
    final canBiometric = await _auth.canAuthenticateWithBiometrics();
    if (canBiometric && mounted) {
      showDialog(context: context, builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        title: Text('¿ACTIVAR DEDO?', style: GoogleFonts.outfit(fontWeight: FontWeight.w900)),
        content: const Text('Para la próxima vuelta podés entrar con tu huella digital.'),
        actions: [
          TextButton(onPressed: () => Navigator.pushReplacementNamed(context, role == 'TALLER' ? '/dashboard/workshop' : '/dashboard/support'), child: const Text('LUEGO')),
          ElevatedButton(
            onPressed: () async {
              final verified = await _auth.authenticateWithBiometrics();
              if (verified && mounted) {
                Navigator.pushReplacementNamed(context, role == 'TALLER' ? '/dashboard/workshop' : '/dashboard/support');
              } else {
                if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('No se pudo verificar la huella.')));
              }
            }, 
            child: const Text('ACTIVAR')
          ),
        ],
      ));
    } else {
      if (mounted) Navigator.pushReplacementNamed(context, role == 'TALLER' ? '/dashboard/workshop' : '/dashboard/support');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(40),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              FadeInDown(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))
                    ]
                  ),
                  child: const Icon(LucideIcons.gauge, size: 40, color: Color(0xFF10B981))
                )
              ),
              const SizedBox(height: 24),
              FadeInDown(
                delay: const Duration(milliseconds: 200), 
                child: Text('KINETIC ATELIER', style: GoogleFonts.outfit(color: const Color(0xFF0F172A), fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: 2))
              ),
              const SizedBox(height: 8),
              FadeInDown(
                delay: const Duration(milliseconds: 400), 
                child: Text('Ingreso a la terminal oficial', style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.bold))
              ),
              const SizedBox(height: 48),
              _buildLoginForm(),
              const SizedBox(height: 32),
              FadeInUp(
                delay: const Duration(milliseconds: 600), 
                child: KineticButton(
                  label: 'ENTRAR A PISTA', 
                  isLoading: _isLoading, 
                  onPressed: _login, 
                  color: const Color(0xFF0F172A), 
                  textColor: Colors.white
                )
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () => Navigator.pushReplacementNamed(context, '/directory'),
                child: Text('VOLVER AL DIRECTORIO', style: GoogleFonts.outfit(color: Colors.grey, fontWeight: FontWeight.bold))
              ),
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
        decoration: BoxDecoration(
          color: Colors.white, 
          borderRadius: BorderRadius.circular(32),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 24, offset: const Offset(0, 8))
          ]
        ),
        child: Column(children: [
          KineticInput(label: 'Email del Piloto', icon: LucideIcons.mail, controller: _emailController, keyboardType: TextInputType.emailAddress),
          const SizedBox(height: 24),
          KineticInput(label: 'Contraseña Secreta', icon: LucideIcons.key_round, controller: _passwordController, isPassword: true),
        ]),
      ),
    );
  }
}
