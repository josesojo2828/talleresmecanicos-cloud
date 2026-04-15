import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';

class MapScreen extends StatelessWidget {
  final List<dynamic> workshops;
  final Function(dynamic) onWorkshopTapped;

  const MapScreen({
    super.key,
    required this.workshops,
    required this.onWorkshopTapped,
  });

  @override
  Widget build(BuildContext context) {
    // Calcular el centro del mapa basado en los talleres (o usar default)
    LatLng initialCenter = const LatLng(0, 0);
    double initialZoom = 2;

    List<Marker> markers = [];
    
    // Filtramos solo los que tengan coordenadas válidas
    final validWorkshops = workshops.where((w) {
      if (w['latitude'] == null || w['longitude'] == null) return false;
      final lat = double.tryParse(w['latitude'].toString());
      final lng = double.tryParse(w['longitude'].toString());
      return lat != null && lng != null;
    }).toList();

    if (validWorkshops.isNotEmpty) {
      // Calcular centroide simple
      double sumLat = 0;
      double sumLng = 0;
      for (var w in validWorkshops) {
        final lat = double.parse(w['latitude'].toString());
        final lng = double.parse(w['longitude'].toString());
        sumLat += lat;
        sumLng += lng;
        
        markers.add(
          Marker(
            point: LatLng(lat, lng),
            width: 80,
            height: 80,
            child: GestureDetector(
              onTap: () => onWorkshopTapped(w),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF10B981).withOpacity(0.4),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: const Icon(LucideIcons.wrench, color: Colors.white, size: 20),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4),
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                    ),
                    child: Text(
                      w['name'] ?? 'Taller',
                      style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A)),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }
      initialCenter = LatLng(sumLat / validWorkshops.length, sumLng / validWorkshops.length);
      initialZoom = 12; // Acercar si hay datos
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('MAPA DE TALLERES', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
      ),
      body: FlutterMap(
        options: MapOptions(
          initialCenter: initialCenter,
          initialZoom: initialZoom,
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
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pop(context),
        backgroundColor: const Color(0xFF0F172A),
        child: const Icon(LucideIcons.layout_list, color: Colors.white),
      ),
    );
  }
}
