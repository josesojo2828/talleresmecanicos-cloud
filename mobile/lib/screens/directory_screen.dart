import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/services/workshop_service.dart';

class DirectoryScreen extends StatefulWidget {
  const DirectoryScreen({super.key});

  @override
  State<DirectoryScreen> createState() => _DirectoryScreenState();
}

class _DirectoryScreenState extends State<DirectoryScreen> {
  final _auth = AuthService();
  final _workshopService = WorkshopService();
  
  bool _isLoggedIn = false;
  String? _country;
  String? _city;
  List<dynamic> _workshops = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initData();
  }

  Future<void> _initData() async {
    final loggedIn = await _auth.isLoggedIn();
    final prefs = await SharedPreferences.getInstance();
    
    setState(() {
      _isLoggedIn = loggedIn;
      _country = prefs.getString('user_country');
      _city = prefs.getString('user_city');
    });

    if (_country == null || _city == null) {
      if (!loggedIn) {
        Future.delayed(Duration.zero, () => _showLocationDialog());
      } else {
        _fetchWorkshops();
      }
    } else {
      _fetchWorkshops();
    }
  }

  Future<void> _fetchWorkshops() async {
    setState(() => _isLoading = true);
    final data = await _workshopService.getWorkshops(
      country: _country,
      city: _city,
    );
    setState(() {
      _workshops = data;
      _isLoading = false;
    });
  }

  void _showLocationDialog() {
    String? selectedCountry = _country;
    String? selectedCity = _city;
    List<String> countries = [];
    List<String> cities = [];
    bool loadingZones = true;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) {
          if (countries.isEmpty && loadingZones) {
            _workshopService.getCountries().then((list) {
              setDialogState(() {
                countries = list.map((e) => e['name'].toString()).toList();
                loadingZones = false;
              });
            });
          }

          return AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
            title: Column(
              children: [
                const Icon(LucideIcons.map_pinned, color: Color(0xFF10B981), size: 40),
                const SizedBox(height: 16),
                Text(
                  'Elige tu zona',
                  style: GoogleFonts.outfit(color: const Color(0xFF0F172A), fontWeight: FontWeight.bold),
                ),
                Text(
                  'Para mostrarte talleres cercanos',
                  style: GoogleFonts.outfit(color: Colors.grey, fontSize: 13),
                ),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (loadingZones)
                  const CircularProgressIndicator(color: Color(0xFF10B981))
                else ...[
                  _buildDropdown(
                    label: 'País',
                    icon: LucideIcons.globe,
                    value: selectedCountry,
                    items: countries,
                    onChanged: (val) async {
                      setDialogState(() {
                        selectedCountry = val;
                        selectedCity = null;
                        cities = [];
                        loadingZones = true;
                      });
                      final list = await _workshopService.getCities(val!);
                      setDialogState(() {
                        cities = list.map((e) => e['name'].toString()).toList();
                        loadingZones = false;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  _buildDropdown(
                    label: 'Ciudad',
                    icon: LucideIcons.map_pin,
                    value: selectedCity,
                    items: cities,
                    onChanged: (val) => setDialogState(() => selectedCity = val),
                  ),
                ]
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  setState(() {
                    _country = null;
                    _city = null;
                  });
                  _fetchWorkshops();
                },
                child: Text('SALTAR', style: GoogleFonts.outfit(color: Colors.grey)),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
                onPressed: (selectedCountry != null && selectedCity != null)
                    ? () async {
                        final prefs = await SharedPreferences.getInstance();
                        await prefs.setString('user_country', selectedCountry!);
                        await prefs.setString('user_city', selectedCity!);
                        setState(() {
                          _country = selectedCountry;
                          _city = selectedCity;
                        });
                        Navigator.pop(context);
                        _fetchWorkshops();
                      }
                    : null,
                child: Text('BUSCAR', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
            actionsAlignment: MainAxisAlignment.spaceBetween,
          );
        },
      ),
    );
  }

  Widget _buildDropdown({
    required String label,
    required IconData icon,
    required String? value,
    required List<String> items,
    required Function(String?) onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      dropdownColor: Colors.white,
      style: const TextStyle(color: Color(0xFF0F172A)),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.grey),
        prefixIcon: Icon(icon, color: const Color(0xFF10B981), size: 20),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF10B981)),
        ),
        filled: true,
        fillColor: const Color(0xFFF1F5F9),
      ),
      items: items.map((String item) {
        return DropdownMenuItem<String>(
          value: item,
          child: Text(item),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: RefreshIndicator(
        onRefresh: _fetchWorkshops,
        color: const Color(0xFF10B981),
        backgroundColor: Colors.white,
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            _buildAppBar(),
            _buildWorkshopsList(),
          ],
        ),
      ),
      floatingActionButton: _buildFloatingButtons(),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      expandedHeight: 120.0,
      floating: true,
      pinned: true,
      backgroundColor: Colors.white,
      elevation: 0,
      surfaceTintColor: Colors.white,
      flexibleSpace: FlexibleSpaceBar(
        centerTitle: true,
        title: Text(
          'DIRECTORIO',
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            fontSize: 18,
            color: const Color(0xFF0F172A),
          ),
        ),
        background: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border(bottom: BorderSide(color: Colors.grey.withOpacity(0.1))),
          ),
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(LucideIcons.map_pinned, color: Color(0xFF10B981)),
          onPressed: _showLocationDialog,
        ),
      ],
    );
  }

  Widget _buildWorkshopsList() {
    if (_isLoading) {
      return const SliverFillRemaining(
        child: Center(child: CircularProgressIndicator(color: Color(0xFF10B981))),
      );
    }

    if (_workshops.isEmpty) {
      return SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.frown, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              Text(
                'No se encontraron talleres' + (_city != null ? ' en $_city, $_country' : ''),
                style: GoogleFonts.outfit(color: Colors.grey),
              ),
              if (_city != null) ...[
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () {
                    setState(() {
                      _country = null;
                      _city = null;
                    });
                    _fetchWorkshops();
                  },
                  child: const Text('Ver todos los talleres'),
                )
              ]
            ],
          ),
        ),
      );
    }

    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          final workshop = _workshops[index];
          return FadeInUp(
            delay: Duration(milliseconds: 100 * index),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.03),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(LucideIcons.wrench, color: Color(0xFF10B981)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          workshop['name'] ?? 'Taller Mecánico',
                          style: GoogleFonts.outfit(
                            color: const Color(0xFF0F172A),
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          workshop['address'] ?? 'Sin dirección',
                          style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                  const Icon(LucideIcons.chevron_right, color: Color(0xFFE2E8F0)),
                ],
              ),
            ),
          );
        },
        childCount: _workshops.length,
      ),
    );
  }

  Widget _buildFloatingButtons() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        FloatingActionButton.small(
          heroTag: 'map',
          elevation: 2,
          backgroundColor: Colors.white,
          child: const Icon(LucideIcons.map, color: Color(0xFF0F172A)),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Mapa en tiempo real (Próximamente)')),
            );
          },
        ),
        const SizedBox(height: 8),
        FloatingActionButton.small(
          heroTag: 'forum',
          elevation: 2,
          backgroundColor: Colors.white,
          child: const Icon(LucideIcons.message_square, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pushNamed(context, '/dashboard/workshop'),
        ),
        const SizedBox(height: 8),
        FloatingActionButton.extended(
          heroTag: 'auth',
          elevation: 4,
          backgroundColor: const Color(0xFF0F172A),
          icon: Icon(_isLoggedIn ? LucideIcons.layout_dashboard : LucideIcons.user, color: Colors.white),
          label: Text(
            _isLoggedIn ? 'DASHBOARD' : 'CUENTA', 
            style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)
          ),
          onPressed: () async {
            if (_isLoggedIn) {
              final role = await _auth.getRole();
              if (!mounted) return;
              if (role == 'ADMIN' || role == 'SUPPORT') {
                Navigator.pushNamed(context, '/dashboard/support');
              } else {
                Navigator.pushNamed(context, '/dashboard/workshop');
              }
            } else {
              Navigator.pushNamed(context, '/login');
            }
          },
        ),
      ],
    );
  }
}
