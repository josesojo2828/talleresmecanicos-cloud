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
        final rawData = jsonDecode(response.body);
        final data = rawData['body'] ?? rawData;
        
        final token = data['access_token'] ?? data['token'];
        if (token == null) return false;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);
        await prefs.setString('user_name', '${data['user']['firstName']} ${data['user']['lastName']}');
        await prefs.setString('user_role', data['user']['role']);
        await prefs.setString('user_email', data['user']['email'] ?? '');
        
        if (data['user']['country'] != null) await prefs.setString('user_country', data['user']['country'].toString());
        if (data['user']['city'] != null) await prefs.setString('user_city', data['user']['city'].toString());
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> register(Map<String, dynamic> userData) async {
    try {
      final response = await _api.post('/auth/register', userData);

      if (response.statusCode == 201 || response.statusCode == 200) {
        final rawData = jsonDecode(response.body);
        final data = rawData['body'] ?? rawData;
        
        final token = data['access_token'] ?? data['token'];
        if (token == null) return false;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);
        await prefs.setString('user_name', '${data['user']['firstName']} ${data['user']['lastName']}');
        await prefs.setString('user_role', data['user']['role']);
        await prefs.setString('user_email', data['user']['email'] ?? '');
        
        if (data['user']['country'] != null) await prefs.setString('user_country', data['user']['country'].toString());
        if (data['user']['city'] != null) await prefs.setString('user_city', data['user']['city'].toString());
        
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

  Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final fullName = prefs.getString('user_name');
    if (fullName == null) return null;
    
    return {
      'firstName': fullName.split(' ').first,
      'lastName': fullName.contains(' ') ? fullName.split(' ').sublist(1).join(' ') : '',
      'fullName': fullName,
      'email': prefs.getString('user_email') ?? '',
      'role': prefs.getString('user_role'),
    };
  }

  Future<bool> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await _api.patch('/user/profile', data);
      if (response.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        if (data.containsKey('firstName') && data.containsKey('lastName')) {
          await prefs.setString('user_name', '${data['firstName']} ${data['lastName']}');
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
