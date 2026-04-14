import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:animate_do/animate_do.dart';
import 'package:workshops_mobile/widgets/kinetic_input.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';
import 'package:workshops_mobile/services/auth_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final PageController _pageController = PageController();
  final AuthService _authService = AuthService();
  
  int _currentStep = 0;
  String _selectedRole = 'CLIENT';
  bool _isLoading = false;
  bool _acceptTerms = false;

  // Controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _workshopNameController = TextEditingController();
  final _workshopAddressController = TextEditingController();

  void _nextStep() {
    if (_currentStep < 2) {
      setState(() => _currentStep++);
      _pageController.nextPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    } else {
      _handleRegister();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
      _pageController.previousPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    }
  }

  Future<void> _handleRegister() async {
    if (!_acceptTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Debes aceptar los términos y condiciones')),
      );
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Las contraseñas no coinciden')),
      );
      return;
    }

    setState(() => _isLoading = true);

    final success = await _authService.register({
      'firstName': _firstNameController.text,
      'lastName': _lastNameController.text,
      'email': _emailController.text,
      'password': _passwordController.text,
      'role': _selectedRole,
      'workshopName': _workshopNameController.text,
      'workshopAddress': _workshopAddressController.text,
      'acceptTerms': _acceptTerms,
      'country': 'México', // Default para esta fase
      'city': 'CDMX',
    });

    setState(() => _isLoading = false);

    if (success) {
      final role = await _authService.getUserRole();
      if (mounted) {
        String route = '/dashboard/client';
        if (role == 'SUPPORT') route = '/dashboard/support';
        if (role == 'TALLER') route = '/dashboard/workshop';
        Navigator.pushReplacementNamed(context, route);
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error al crear la cuenta. Revisa los datos.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildStep1(),
                  _buildStep2(),
                  _buildStep3(),
                ],
              ),
            ),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (_currentStep > 0)
                IconButton(
                  onPressed: _prevStep,
                  icon: const Icon(LucideIcons.arrow_left, color: Color(0xFF64748B)),
                )
              else
                const SizedBox(width: 48),
              Text(
                'REGISTRO',
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(width: 48),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(3, (index) => _buildStepIndicator(index)),
          ),
        ],
      ),
    );
  }

  Widget _buildStepIndicator(int index) {
    bool isActive = _currentStep == index;
    bool isCompleted = _currentStep > index;
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      width: isActive ? 32 : 12,
      height: 12,
      decoration: BoxDecoration(
        color: isActive || isCompleted ? const Color(0xFF10B981) : const Color(0xFFE2E8F0),
        borderRadius: BorderRadius.circular(10),
      ),
    );
  }

  Widget _buildStep1() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FadeInDown(
            child: Text(
              '¿Cómo quieres usar la App?',
              style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Selecciona tu perfil para personalizar tu experiencia.',
            style: GoogleFonts.outfit(color: const Color(0xFF64748B)),
          ),
          const SizedBox(height: 32),
          _buildRoleCard(
            'CLIENT', 
            'Soy Cliente', 
            'Busco talleres para reparar mi vehículo', 
            LucideIcons.user
          ),
          const SizedBox(height: 16),
          _buildRoleCard(
            'TALLER', 
            'Soy Dueño de Taller', 
            'Quiero gestionar mi negocio y clientes', 
            LucideIcons.wrench
          ),
        ],
      ),
    );
  }

  Widget _buildRoleCard(String role, String title, String subtitle, IconData icon) {
    bool isSelected = _selectedRole == role;
    
    return GestureDetector(
      onTap: () => setState(() => _selectedRole = role),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? const Color(0xFF10B981) : const Color(0xFFE2E8F0),
            width: 2,
          ),
          boxShadow: isSelected ? [
            BoxShadow(color: const Color(0xFF10B981).withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10))
          ] : null,
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFF10B981) : const Color(0xFFF1F5F9),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: isSelected ? Colors.white : const Color(0xFF64748B)),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(subtitle, style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF64748B))),
                ],
              ),
            ),
            if (isSelected)
              const Icon(LucideIcons.circle_check, color: Color(0xFF10B981)),
          ],
        ),
      ),
    );
  }

  Widget _buildStep2() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FadeInDown(
            child: Text(
              'Cuéntanos sobre ti',
              style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 32),
          KineticInput(label: 'Nombre', icon: LucideIcons.user, controller: _firstNameController),
          const SizedBox(height: 16),
          KineticInput(label: 'Apellido', icon: LucideIcons.user, controller: _lastNameController),
          const SizedBox(height: 16),
          KineticInput(label: 'Email', icon: LucideIcons.mail, controller: _emailController, keyboardType: TextInputType.emailAddress),
        ],
      ),
    );
  }

  Widget _buildStep3() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FadeInDown(
            child: Text(
              'Seguridad y más',
              style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 32),
          KineticInput(label: 'Contraseña', icon: LucideIcons.lock, controller: _passwordController, isPassword: true),
          const SizedBox(height: 16),
          KineticInput(label: 'Confirmar Contraseña', icon: LucideIcons.circle_check, controller: _confirmPasswordController, isPassword: true),
          if (_selectedRole == 'TALLER') ...[
            const SizedBox(height: 16),
            KineticInput(label: 'Nombre del Taller', icon: LucideIcons.briefcase, controller: _workshopNameController),
            const SizedBox(height: 16),
            KineticInput(label: 'Dirección del Taller', icon: LucideIcons.map, controller: _workshopAddressController),
          ],
          const SizedBox(height: 24),
          Row(
            children: [
              Checkbox(
                value: _acceptTerms, 
                onChanged: (v) => setState(() => _acceptTerms = v!),
                activeColor: const Color(0xFF10B981),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
              ),
              Expanded(
                child: Text(
                  'Acepto los términos y condiciones del servicio.',
                  style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF64748B)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: KineticIconButton(
        icon: _currentStep == 2 ? LucideIcons.rocket : LucideIcons.arrow_right,
        label: _isLoading ? 'PROCESANDO...' : (_currentStep == 2 ? '¡CREAR CUENTA!' : 'CONTINUAR'),
        onPressed: _isLoading ? null : _nextStep,
        isLarge: true,
      ),
    );
  }
}
