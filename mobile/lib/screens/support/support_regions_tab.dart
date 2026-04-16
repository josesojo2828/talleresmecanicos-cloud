import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/screens/support/create_city_screen.dart';
import 'dart:convert';

class SupportRegionsTab extends StatefulWidget {
  const SupportRegionsTab({super.key});

  @override
  State<SupportRegionsTab> createState() => _SupportRegionsTabState();
}

class _SupportRegionsTabState extends State<SupportRegionsTab> {
  final _api = ApiClient();
  final _auth = AuthService();
  bool _isLoading = true;
  List<dynamic> _assignedCountries = [];
  List<dynamic> _assignedCities = [];

  @override
  void initState() {
    super.initState();
    _loadAssignments();
  }

  Future<void> _loadAssignments() async {
    setState(() => _isLoading = true);
    
    // Carga inicial rápida desde caché local
    final cachedRegions = await _auth.getUserRegions();
    if (cachedRegions.isNotEmpty) {
      await _processAssignments(cachedRegions);
      setState(() => _isLoading = false);
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('user_id');
      if (userId == null) return;

      final response = await _api.get('/user/$userId');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final user = data['body'] ?? data;
        final assignments = user['regions'] ?? [];
        
        // Guardar en caché para la próxima vez
        await prefs.setString('user_regions', jsonEncode(assignments));
        
        await _processAssignments(assignments);
      }
    } catch (e) {
      print('Error cargando regiones: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _processAssignments(List<dynamic> assignments) async {
    final countries = assignments
        .where((a) => a['country'] != null && a['city'] == null)
        .map((a) => a['country'])
        .toList();
    
    final explicitCities = assignments
        .where((a) => a['city'] != null)
        .map((a) => a['city'])
        .toList();

    List<dynamic> allCities = List.from(explicitCities);

    // Si tiene países asignados, cargamos TODAS las ciudades de esos países
    for (var country in countries) {
      try {
        final response = await _api.get('/public/locations/cities?countryId=${country['id']}');
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final countryCities = data['body']?['data'] ?? data['data'] ?? [];
          
          for (var city in countryCities) {
            // Evitar duplicados
            if (!allCities.any((c) => c['id'] == city['id'])) {
              // Añadimos info del país para el subtítulo
              city['country_name'] = country['name'];
              allCities.add(city);
            }
          }
        }
      } catch (e) {
        print('Error cargando ciudades para ${country['name']}: $e');
      }
    }

    if (mounted) {
      setState(() {
        _assignedCountries = countries;
        _assignedCities = allCities;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      floatingActionButton: _assignedCountries.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => CreateCityScreen(assignedCountries: _assignedCountries),
                  ),
                );
                _loadAssignments();
              },
              backgroundColor: const Color(0xFF0F172A),
              label: Text('NUEVA CIUDAD', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white)),
              icon: const Icon(LucideIcons.plus, size: 18, color: Colors.white),
            )
          : null,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadAssignments,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                const SizedBox(height: 32),
                _buildSectionTitle('PAÍSES ASIGNADOS', LucideIcons.globe),
                const SizedBox(height: 16),
                _buildCountryList(),
                const SizedBox(height: 32),
                _buildSectionTitle('CIUDADES ASIGNADAS', LucideIcons.map_pin),
                const SizedBox(height: 16),
                _buildCityList(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return FadeInDown(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'REGIONES',
            style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: -0.5),
          ),
          Text(
            'Gestión de cobertura territorial',
            style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 14, color: const Color(0xFF94A3B8)),
        const SizedBox(width: 8),
        Text(
          title,
          style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2),
        ),
      ],
    );
  }

  Widget _buildCountryList() {
    if (_isLoading) return const Center(child: CircularProgressIndicator());
    if (_assignedCountries.isEmpty) return _buildEmptyState('No tienes países asignados.');

    return Column(
      children: _assignedCountries.map((c) {
        return FadeInLeft(
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFF1F5F9))),
            child: Row(
              children: [
                Text(c['flag'] ?? '🌍', style: const TextStyle(fontSize: 24)),
                const SizedBox(width: 16),
                Text(c['name'], style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                const Spacer(),
                const Icon(LucideIcons.circle_check, color: Color(0xFF10B981), size: 16),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCityList() {
    if (_isLoading) return const Center(child: CircularProgressIndicator());
    if (_assignedCities.isEmpty) return _buildEmptyState('No tienes ciudades asignadas.');

    return Column(
      children: _assignedCities.map((c) {
        return FadeInLeft(
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFF1F5F9))),
            child: Row(
              children: [
                const Icon(LucideIcons.building_2, color: Color(0xFF3B82F6), size: 20),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(c['name'], style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                    Text(c['country_name'] ?? (c['country']?['name'] ?? 'Región'), style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF94A3B8))),
                  ],
                ),
                const Spacer(),
                Transform.scale(
                  scale: 0.7,
                  child: Switch(
                    value: c['enabled'] ?? true,
                    onChanged: (val) async {
                      await _api.put('/city/${c['id']}', {'enabled': val});
                      _loadAssignments();
                    },
                    activeColor: const Color(0xFF10B981),
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildEmptyState(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(24)),
      child: Column(
        children: [
          const Icon(LucideIcons.search_x, color: Color(0xFF94A3B8), size: 32),
          const SizedBox(height: 12),
          Text(message, style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
