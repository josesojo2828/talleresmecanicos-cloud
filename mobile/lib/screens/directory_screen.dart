import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/services/auth_service.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/screens/workshop_detail_screen.dart';
import 'package:workshops_mobile/screens/map_screen.dart';

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
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(color: const Color(0xFF0F172A), fontWeight: FontWeight.bold),
                ),
                Text(
                  'Para mostrarte talleres cercanos',
                  textAlign: TextAlign.center,
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
              Wrap(
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                spacing: 8,
                runSpacing: 12,
                children: [
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
                    onPressed: (selectedCountry != null)
                        ? () async {
                            final prefs = await SharedPreferences.getInstance();
                            await prefs.setString('user_country', selectedCountry!);
                            if (selectedCity != null) {
                              await prefs.setString('user_city', selectedCity!);
                            } else {
                              await prefs.remove('user_city');
                            }
                            
                            setState(() {
                              _country = selectedCountry;
                              _city = selectedCity;
                            });
                            if (mounted) Navigator.pop(context);
                            _fetchWorkshops();
                          }
                        : null,
                    child: Text('BUSCAR', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ],
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
      isExpanded: true,
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
          child: Text(
            item,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.outfit(fontSize: 14),
          ),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }

  void _showQuickLinksMenu() async {
    final role = await _auth.getUserRole();
    
    if (!mounted) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.fromLTRB(32, 12, 32, 48),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(48)),
          boxShadow: [
            BoxShadow(color: Colors.black26, blurRadius: 40, spreadRadius: 0)
          ]
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(10))),
            const SizedBox(height: 32),
            Text('ACCESO RÁPIDO', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 4, fontSize: 10)),
            const SizedBox(height: 40),
            GridView.count(
              shrinkWrap: true,
              crossAxisCount: 2,
              mainAxisSpacing: 20,
              crossAxisSpacing: 20,
              childAspectRatio: 1.2,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildMenuButton(LucideIcons.layout_list, 'DIRECTORIO', () => Navigator.pop(context), color: const Color(0xFF10B981)),
                _buildMenuButton(LucideIcons.map, 'MAPA', () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => MapScreen(
                        workshops: _workshops,
                        onWorkshopTapped: (w) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => WorkshopDetailScreen(workshop: w),
                            ),
                          );
                        },
                      ),
                    ),
                  );
                }, color: const Color(0xFF3B82F6)),
                if (!_isLoggedIn) ...[
                  _buildMenuButton(LucideIcons.log_in, 'LOGIN', () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, '/login').then((_) => _initData());
                  }, color: const Color(0xFF0F172A)),
                ] else ...[
                  _buildMenuButton(LucideIcons.layout_dashboard, 'DASHBOARD', () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, role == 'TALLER' ? '/dashboard/workshop' : '/dashboard/support');
                  }, color: const Color(0xFF0F172A)),
                  _buildMenuButton(LucideIcons.log_out, 'CERRAR SESIÓN', () async {
                    Navigator.pop(context);
                    await _auth.logout();
                    _initData();
                  }, color: const Color(0xFFF43F5E)),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuButton(IconData icon, String label, VoidCallback onTap, {required Color color}) {
    return Material(
      color: color.withOpacity(0.05),
      borderRadius: BorderRadius.circular(24),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: color.withOpacity(0.1)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 28),
              const SizedBox(height: 12),
              Text(label, style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 13, color: color)),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      floatingActionButton: FadeInRight(
        child: FloatingActionButton.extended(
          onPressed: _showQuickLinksMenu,
          backgroundColor: const Color(0xFF0F172A),
          elevation: 4,
          icon: const Icon(LucideIcons.compass, color: Colors.white, size: 20),
          label: Text('NAVEGAR', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, color: Colors.white, fontSize: 13, letterSpacing: 1)),
        ),
      ),
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
        IconButton(
          icon: Icon(
            _isLoggedIn ? LucideIcons.circle_user : LucideIcons.log_in, 
            color: const Color(0xFF334155)
          ),
          onPressed: () async {
            if (_isLoggedIn) {
              final role = await _auth.getRole();
              if (mounted) {
                Navigator.pushReplacementNamed(
                  context, 
                  role == 'SUPPORT' ? '/dashboard/support' : '/dashboard/workshop'
                );
              }
            } else {
              Navigator.pushNamed(context, '/login');
            }
          },
        ),
      ],
    );
  }

  String _getImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return 'https://talleresmecanicos.quanticarch.com$path';
    return 'https://talleresmecanicos.quanticarch.com/$path';
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
          final logoUrl = _getImageUrl(workshop['logoUrl']);
          final bannerUrl = (workshop['images'] != null && workshop['images'] is List && workshop['images'].isNotEmpty) 
            ? _getImageUrl(workshop['images'][0]) 
            : null;

          return FadeInUp(
            delay: Duration(milliseconds: 100 * index),
            child: GestureDetector(
              onTap: () => Navigator.pushNamed(
                context, 
                '/workshop-detail', 
                arguments: workshop
              ),
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0F172A).withOpacity(0.06),
                      blurRadius: 24,
                      offset: const Offset(0, 12),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Banner Image
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Container(
                          height: 140,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                            image: bannerUrl != null && bannerUrl.isNotEmpty
                              ? DecorationImage(
                                  image: NetworkImage(bannerUrl),
                                  fit: BoxFit.cover,
                                )
                              : logoUrl.isNotEmpty
                                ? DecorationImage(
                                    image: NetworkImage(logoUrl),
                                    fit: BoxFit.cover,
                                  )
                                : null,
                            color: const Color(0xFFF1F5F9),
                          ),
                          child: (bannerUrl == null || bannerUrl.isEmpty) && logoUrl.isEmpty
                            ? const Center(child: Icon(LucideIcons.wrench, color: Color(0xFFCBD5E1), size: 40))
                            : null,
                        ),
                        // Logo Overlay
                        if (logoUrl.isNotEmpty)
                          Positioned(
                            bottom: -20,
                            left: 20,
                            child: Container(
                              width: 60,
                              height: 60,
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  )
                                ],
                              ),
                              child: CircleAvatar(
                                backgroundColor: const Color(0xFFF8FAFC),
                                backgroundImage: NetworkImage(logoUrl),
                              ),
                            ),
                          ),
                      ],
                    ),
                    
                    const SizedBox(height: 28),
                    
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  workshop['name'] ?? 'Taller Mecánico',
                                  style: GoogleFonts.outfit(
                                    color: const Color(0xFF0F172A),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                              ),
                              const Icon(LucideIcons.arrow_up_right, color: Color(0xFF10B981), size: 20),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(LucideIcons.map_pin, color: Color(0xFF64748B), size: 14),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  workshop['address'] ?? 'Sin dirección',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.inter(
                                    color: const Color(0xFF64748B),
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Wrap(
                            spacing: 8,
                            children: [
                              if (workshop['category'] != null)
                                _buildMiniBadge(
                                  workshop['category']['name'] ?? 'General', 
                                  const Color(0xFF10B981),
                                ),
                              _buildMiniBadge(
                                'Ver Detalles', 
                                const Color(0xFF0F172A),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          ),
        );
      },
        childCount: _workshops.length,
      ),
    );
  }

  Widget _buildMiniBadge(String text, Color color, {Color? textColor}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text.toUpperCase(),
        style: GoogleFonts.inter(
          color: textColor ?? color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }


}
