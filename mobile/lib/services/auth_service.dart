import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:local_auth/local_auth.dart';
import 'package:workshops_mobile/services/api_client.dart';

class AuthService {
  final ApiClient _api = ApiClient();
  final LocalAuthentication _localAuth = LocalAuthentication();

  Future<Map<String, dynamic>?> login(String email, String password) async {
    try {
      final response = await _api.post('/auth/login', {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('access_token', data['access_token']);
        await prefs.setString('user_role', data['user']['role']);
        await prefs.setString('user_name', data['user']['firstName']);
        return data;
      }
    } catch (e) { print('Login failed: $e'); }
    return null;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('user_role');
  }

  // --- Helpers de Sesión ---
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token') != null;
  }

  Future<String?> getRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_role');
  }

  // --- Biometría (Huella) ---
  Future<bool> canUseBiometrics() async {
    final bool canAuthenticateWithBiometrics = await _localAuth.canCheckBiometrics;
    final bool canAuthenticate = canAuthenticateWithBiometrics || await _localAuth.isDeviceSupported();
    return canAuthenticate;
  }

  Future<bool> authenticateBiometrically() async {
    try {
      return await _localAuth.authenticate(
        localizedReason: 'Inicia sesión con tu huella para entrar al taller',
        options: const AuthenticationOptions(stickyAuth: true, biometricOnly: true),
      );
    } catch (e) { print('Biometric auth error: $e'); return false; }
  }

  Future<void> setBiometricsPreference(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('biometrics_enabled', enabled);
  }

  Future<bool> getBiometricsPreference() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('biometrics_enabled') ?? false;
  }
}
