import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:geolocator/geolocator.dart';
import 'package:animate_do/animate_do.dart';

class MapScreen extends StatefulWidget {
  final List<dynamic> workshops;
  final Function(dynamic) onWorkshopTapped;

  const MapScreen({
    super.key,
    required this.workshops,
    required this.onWorkshopTapped,
  });

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  LatLng _center = const LatLng(-15, -70); // Default America Latina
  double _zoom = 3.5;
  bool _isLoadingLocation = true;

  @override
  void initState() {
    super.initState();
    _determinePosition();
  }

  Future<void> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    setState(() => _isLoadingLocation = true);

    try {
      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _useDefaultOrWorkshopsCenter();
        return;
      }

      permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _useDefaultOrWorkshopsCenter();
          return;
        }
      }
      
      if (permission == LocationPermission.deniedForever) {
        _useDefaultOrWorkshopsCenter();
        return;
      } 

      Position position = await Geolocator.getCurrentPosition();
      if (mounted) {
        setState(() {
          _center = LatLng(position.latitude, position.longitude);
          _zoom = 13.0;
          _isLoadingLocation = false;
        });
        _mapController.move(_center, _zoom);
      }
    } catch (e) {
      _useDefaultOrWorkshopsCenter();
    }
  }

  void _useDefaultOrWorkshopsCenter() {
    if (mounted) {
      final validWorkshops = widget.workshops.where((w) {
        return w['latitude'] != null && w['longitude'] != null;
      }).toList();

      if (validWorkshops.isNotEmpty) {
        double sumLat = 0;
        double sumLng = 0;
        for (var w in validWorkshops) {
          sumLat += double.parse(w['latitude'].toString());
          sumLng += double.parse(w['longitude'].toString());
        }
        setState(() {
          _center = LatLng(sumLat / validWorkshops.length, sumLng / validWorkshops.length);
          _zoom = 10.0;
          _isLoadingLocation = false;
        });
      } else {
        setState(() {
          _center = const LatLng(-15, -70); // Latinoamerica
          _zoom = 3.5;
          _isLoadingLocation = false;
        });
      }
    }
  }

  void _showWorkshopModal(dynamic w) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => FadeInUp(
        duration: const Duration(milliseconds: 300),
        child: Container(
          margin: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(32),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, -5),
              )
            ],
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: w['logoUrl'] != null && w['logoUrl'].isNotEmpty
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(20),
                          child: Image.network(w['logoUrl'], fit: BoxFit.cover),
                        )
                      : const Icon(LucideIcons.wrench, color: Color(0xFF94A3B8)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          w['name'] ?? 'Taller sin nombre',
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                            color: const Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(LucideIcons.map_pin, size: 14, color: Color(0xFF64748B)),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                w['address'] ?? 'Dirección no disponible',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        widget.onWorkshopTapped(w);
                      },
                      icon: const Icon(LucideIcons.external_link, size: 18, color: Colors.white),
                      label: Text('VER FICHA', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(LucideIcons.x, color: Color(0xFF64748B)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    List<Marker> markers = [];
    
    final validWorkshops = widget.workshops.where((w) {
      if (w['latitude'] == null || w['longitude'] == null) return false;
      final lat = double.tryParse(w['latitude'].toString());
      final lng = double.tryParse(w['longitude'].toString());
      return lat != null && lng != null;
    }).toList();

    for (var w in validWorkshops) {
      final lat = double.parse(w['latitude'].toString());
      final lng = double.parse(w['longitude'].toString());
      
      markers.add(
        Marker(
          point: LatLng(lat, lng),
          width: 60,
          height: 60,
          child: GestureDetector(
            onTap: () => _showWorkshopModal(w),
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Pulse Effect (Subtle)
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                  ),
                  // Real Marker
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 3),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    child: const Icon(LucideIcons.wrench, color: Colors.white, size: 18),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: Text('MAPA INTERACTIVO', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 1)),
        backgroundColor: Colors.white.withOpacity(0.9),
        surfaceTintColor: Colors.transparent,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
        leading: Container(
          margin: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: IconButton(
            icon: const Icon(LucideIcons.arrow_left, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _center,
              initialZoom: _zoom,
              interactionOptions: const InteractionOptions(
                flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
              ),
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.quanticarch.talleresmecanicos',
              ),
              MarkerLayer(markers: markers),
            ],
          ),
          if (_isLoadingLocation)
            Positioned(
              top: 100,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                    boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const SizedBox(
                        width: 14, height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF10B981)),
                      ),
                      const SizedBox(width: 10),
                      Text('Obteniendo ubicación...', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            heroTag: 'gps',
            onPressed: _determinePosition,
            backgroundColor: Colors.white,
            elevation: 4,
            child: const Icon(LucideIcons.crosshair, color: Color(0xFF10B981)),
          ),
          const SizedBox(height: 12),
          FloatingActionButton(
            heroTag: 'list',
            onPressed: () => Navigator.pop(context),
            backgroundColor: const Color(0xFF0F172A),
            elevation: 4,
            child: const Icon(LucideIcons.layout_list, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
