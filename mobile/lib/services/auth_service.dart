import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'dart:convert';

class AuthService {
  final _api = ApiClient();
  final _localAuth = LocalAuthentication();

  Future<bool> login(String email, String password) async {
    try {
      final response = await _api.post('/auth/login', {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        await prefs.setString('user_name', '${data['user']['firstName']} ${data['user']['lastName']}');
        await prefs.setString('user_role', data['user']['role']);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('token');
  }

  // Alias para compatibilidad con SplashScreen
  Future<String> getRole() async {
    return await getUserRole();
  }

  // Nombre principal para compatibilidad con LoginScreen
  Future<String> getUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_role') ?? 'TALLER';
  }

  Future<bool> canAuthenticateWithBiometrics() async {
    try {
      return await _localAuth.canCheckBiometrics || await _localAuth.isDeviceSupported();
    } catch (e) {
      return false;
    }
  }

  Future<bool> authenticateWithBiometrics() async {
    try {
      return await _localAuth.authenticate(
        localizedReason: 'Inicia sesión en Kinetic Atelier',
      );
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
