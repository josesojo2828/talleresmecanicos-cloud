import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:geolocator/geolocator.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'dart:convert';

class CreateWorkshopScreen extends StatefulWidget {
  const CreateWorkshopScreen({super.key});

  @override
  State<CreateWorkshopScreen> createState() => _CreateWorkshopScreenState();
}

class _CreateWorkshopScreenState extends State<CreateWorkshopScreen> {
  final _formKey = GlobalKey<FormState>();
  final _api = ApiClient();
  final _auth = AuthService();
  
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _websiteController = TextEditingController();
  final _latController = TextEditingController();
  final _lngController = TextEditingController();
  final _ownerEmailController = TextEditingController();
  
  String? _selectedCountryId;
  String? _selectedCityId;
  String? _selectedUserId;
  String? _ownerName;
  
  List<dynamic> _allRegions = [];
  List<dynamic> _availableCountries = [];
  List<dynamic> _availableCities = [];
  
  bool _isLoading = false;
  bool _isDataLoading = true;
  bool _isSearchingUser = false;

  @override
  void initState() {
    super.initState();
    _loadRegions();
  }

  Future<void> _loadRegions() async {
    final regions = await _auth.getUserRegions();
    setState(() {
      _allRegions = regions;
      
      final countriesMap = <String, dynamic>{};
      for (var reg in regions) {
        final c = reg['country'];
        if (c != null && c['enabled'] == true) {
          countriesMap[c['id']] = c;
        }
      }
      _availableCountries = countriesMap.values.toList();
      
      if (_availableCountries.length == 1) {
        _selectedCountryId = _availableCountries[0]['id'];
        _onCountryChanged(_selectedCountryId);
      }
      
      _isDataLoading = false;
    });
  }

  void _onCountryChanged(String? countryId) {
    setState(() {
      _selectedCountryId = countryId;
      _selectedCityId = null;
      
      _availableCities = _allRegions.where((reg) {
        final sameCountry = reg['country'] != null && reg['country']['id'] == countryId;
        final cityEnabled = reg['city'] != null && reg['city']['enabled'] == true;
        return sameCountry && cityEnabled;
      }).map((reg) => reg['city']).toList();
      
      if (_availableCities.length == 1) {
        _selectedCityId = _availableCities[0]['id'];
      }
    });
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return;

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }
    
    if (permission == LocationPermission.deniedForever) return;

    final position = await Geolocator.getCurrentPosition();
    setState(() {
      _latController.text = position.latitude.toString();
      _lngController.text = position.longitude.toString();
    });
  }

  Future<void> _searchUser() async {
    if (_ownerEmailController.text.isEmpty) return;
    
    setState(() => _isSearchingUser = true);
    try {
      final filters = jsonEncode({'email': _ownerEmailController.text});
      final response = await _api.get('/user?filters=$filters');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List users = data['data'] ?? [];
        if (users.isNotEmpty) {
          final user = users[0];
          setState(() {
            _selectedUserId = user['id'];
            _ownerName = '${user['firstName']} ${user['lastName']}';
          });
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Usuario no encontrado')),
          );
        }
      }
    } catch (e) {
      print('Search user failed: $e');
    } finally {
      setState(() => _isSearchingUser = false);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCountryId == null || _selectedCityId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Selecciona País y Ciudad')));
      return;
    }
    if (_selectedUserId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Asigna un Dueño (Taller)')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final payload = {
        'name': _nameController.text,
        'description': _descriptionController.text,
        'address': _addressController.text,
        'phone': _phoneController.text,
        'whatsapp': _whatsappController.text,
        'website': _websiteController.text,
        'latitude': double.tryParse(_latController.text) ?? 0.0,
        'longitude': double.tryParse(_lngController.text) ?? 0.0,
        'countryId': _selectedCountryId,
        'cityId': _selectedCityId,
        'userId': _selectedUserId,
        'categoryIds': [], // Opcional por ahora
      };

      final response = await _api.post('/workshop', payload);

      if (response.statusCode == 201 || response.statusCode == 200) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Taller creado con éxito'), backgroundColor: Colors.green));
          Navigator.pop(context);
        }
      } else {
        throw Exception('Error al crear taller');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.redAccent));
      }
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
        leading: IconButton(icon: const Icon(LucideIcons.x, color: Color(0xFF0F172A)), onPressed: () => Navigator.pop(context)),
        title: Text('NUEVO TALLER', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 1.5)),
      ),
      body: _isDataLoading 
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('DATOS DEL TALLER'),
                  _buildTextField(_nameController, 'Nombre del taller', LucideIcons.warehouse),
                  const SizedBox(height: 16),
                  _buildTextField(_descriptionController, 'Descripción detallada', LucideIcons.align_left, maxLines: 3),
                  const SizedBox(height: 16),
                  _buildTextField(_addressController, 'Dirección física', LucideIcons.map),
                  const SizedBox(height: 24),

                  _buildSectionTitle('UBICACIÓN GEOGRÁFICA'),
                  Row(
                    children: [
                      Expanded(child: _buildTextField(_latController, 'Latitud', LucideIcons.navigation, keyboardType: TextInputType.number)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildTextField(_lngController, 'Longitud', LucideIcons.navigation, keyboardType: TextInputType.number)),
                      const SizedBox(width: 12),
                      IconButton.filled(
                        onPressed: _getCurrentLocation,
                        icon: const Icon(LucideIcons.locate, size: 20),
                        style: IconButton.styleFrom(backgroundColor: const Color(0xFF3B82F6), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  _buildSectionTitle('REGIÓN ADMINISTRATIVA'),
                  Row(
                    children: [
                      Expanded(child: _buildDropdown(value: _selectedCountryId, items: _availableCountries, onChanged: _onCountryChanged, icon: LucideIcons.globe)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildDropdown(value: _selectedCityId, items: _availableCities, onChanged: (v) => setState(() => _selectedCityId = v), icon: LucideIcons.map_pin, enabled: _selectedCountryId != null)),
                    ],
                  ),
                  const SizedBox(height: 24),

                  _buildSectionTitle('CONTACTO & REDES'),
                  _buildTextField(_phoneController, 'Teléfono fijo', LucideIcons.phone, keyboardType: TextInputType.phone),
                  const SizedBox(height: 12),
                  _buildTextField(_whatsappController, 'WhatsApp', LucideIcons.message_circle, keyboardType: TextInputType.phone),
                  const SizedBox(height: 12),
                  _buildTextField(_websiteController, 'Sitio Web', LucideIcons.external_link, keyboardType: TextInputType.url),
                  const SizedBox(height: 24),

                  _buildSectionTitle('DUEÑO DEL TALLER (USER)'),
                  Row(
                    children: [
                      Expanded(child: _buildTextField(_ownerEmailController, 'Email del responsable', LucideIcons.mail, keyboardType: TextInputType.emailAddress)),
                      const SizedBox(width: 12),
                      IconButton.filled(
                        onPressed: _isSearchingUser ? null : _searchUser,
                        icon: _isSearchingUser ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(LucideIcons.search, size: 20),
                        style: IconButton.styleFrom(backgroundColor: const Color(0xFF0F172A), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                      ),
                    ],
                  ),
                  if (_ownerName != null) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                      child: Row(
                        children: [
                          const Icon(LucideIcons.check_circle, size: 14, color: Color(0xFF10B981)),
                          const SizedBox(width: 8),
                          Text(_ownerName!, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                        ],
                      ),
                    ),
                  ],

                  const SizedBox(height: 40),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _submit,
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F172A), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)), elevation: 0),
                      child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text('CREAR TALLER', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Text(title, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1.5)),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint, IconData icon, {TextInputType? keyboardType, int maxLines = 1}) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      validator: (v) => v == null || v.isEmpty ? 'Requerido' : null,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.outfit(color: const Color(0xFFCBD5E1), fontSize: 13),
        prefixIcon: Icon(icon, size: 18, color: const Color(0xFF64748B)),
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
        contentPadding: const EdgeInsets.all(16),
      ),
    );
  }

  Widget _buildDropdown({required String? value, required List<dynamic> items, required void Function(String?) onChanged, required IconData icon, bool enabled = true}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(color: enabled ? const Color(0xFFF8FAFC) : const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          isExpanded: true,
          hint: Text('...', style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF94A3B8))),
          icon: const Icon(LucideIcons.chevron_down, size: 14),
          onChanged: enabled ? onChanged : null,
          items: items.map<DropdownMenuItem<String>>((item) {
            return DropdownMenuItem<String>(
              value: item['id'],
              child: Text(item['name'], style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF0F172A))),
            );
          }).toList(),
        ),
      ),
    );
  }
}
