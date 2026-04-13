import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'dart:convert';

class PublicationsScreen extends StatefulWidget {
  const PublicationsScreen({super.key});

  @override
  State<PublicationsScreen> createState() => _PublicationsScreenState();
}

class _PublicationsScreenState extends State<PublicationsScreen> {
  final _api = ApiClient();
  List<dynamic> _publications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final res = await _api.get('/publication');
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        setState(() {
          _publications = decoded['body']?['data'] ?? [];
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          color: const Color(0xFF10B981),
          child: CustomScrollView(
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.all(24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    FadeInDown(
                      child: const KineticHeader(
                        title: 'MIS PUBLICACIONES',
                        subtitle: 'Gestión de Marketplace y Ofertas',
                      ),
                    ),
                    const SizedBox(height: 32),
                  ]),
                ),
              ),

              if (_isLoading)
                const SliverFillRemaining(child: Center(child: CircularProgressIndicator(color: Color(0xFF10B981))))
              else if (_publications.isEmpty)
                SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.layout_grid, size: 64, color: const Color(0xFFCBD5E1)),
                        const SizedBox(height: 16),
                        Text('No tienes publicaciones activas', style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Text('Publica repuestos o servicios para la red.', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 12)),
                      ],
                    ),
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final pub = _publications[index];
                        return _buildPublicationCard(pub);
                      },
                      childCount: _publications.length,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
      floatingActionButton: FadeInRight(
        child: FloatingActionButton.extended(
          onPressed: () {
            // TODO: Pantalla de crear publicación
          },
          backgroundColor: const Color(0xFF0F172A),
          icon: const Icon(LucideIcons.plus, color: Colors.white),
          label: Text('NUEVA PUBLICACIÓN', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
      ),
    );
  }

  Widget _buildPublicationCard(dynamic pub) {
    return FadeInUp(
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Column(
          children: [
            if (pub['images'] != null && (pub['images'] as List).isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                child: Image.network(
                  pub['images'][0],
                  height: 150,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 150,
                    color: const Color(0xFFF1F5F9),
                    child: const Icon(LucideIcons.image, color: Color(0xFFCBD5E1)),
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                        child: Text(pub['category']?['name'] ?? 'REPUESTO', style: GoogleFonts.outfit(color: const Color(0xFF10B981), fontSize: 8, fontWeight: FontWeight.w900)),
                      ),
                      Text('\$${pub['price'] ?? '0'}', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16, color: const Color(0xFF0F172A))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(pub['title'] ?? 'Sin título', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14, color: const Color(0xFF0F172A))),
                  const SizedBox(height: 4),
                  Text(pub['description'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF64748B))),
                  const Divider(height: 32),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(LucideIcons.eye, size: 14, color: Color(0xFF94A3B8)),
                          const SizedBox(width: 8),
                          Text('${pub['views'] ?? 0} vistas', style: GoogleFonts.outfit(fontSize: 11, color: const Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Text('ACTIVA', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF10B981))),
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
