import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/services/auth_service.dart';

class WorkshopReviewsSection extends StatefulWidget {
  final String workshopId;

  const WorkshopReviewsSection({super.key, required this.workshopId});

  @override
  State<WorkshopReviewsSection> createState() => _WorkshopReviewsSectionState();
}

class _WorkshopReviewsSectionState extends State<WorkshopReviewsSection> {
  final _workshopService = WorkshopService();
  final _auth = AuthService();
  
  List<dynamic> _reviews = [];
  bool _isLoading = true;
  bool _isLoggedIn = false;
  String _userRole = '';
  bool _hasRated = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final reviews = await _workshopService.getWorkshopReviews(widget.workshopId);
    final loggedIn = await _auth.isLoggedIn();
    final role = await _auth.getUserRole();
    
    // Simulación de check para ver si ya calificó
    // En una versión real, esto vendría del API o se filtraría en el listado
    bool hasRated = false;
    if (loggedIn) {
      // Nota: Aquí necesitaríamos el ID del usuario actual para comparar
      // Por ahora confiamos en el listado que trae el backend
    }

    if (mounted) {
      setState(() {
        _reviews = reviews;
        _isLoggedIn = loggedIn;
        _userRole = role;
        _isLoading = false;
        _hasRated = hasRated;
      });
    }
  }

  void _showRatingDialog() {
    int selectedRating = 0;
    final commentController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Padding(
            padding: const EdgeInsets.all(32.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CALIFICAR TALLER',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'CUÉNTANOS TU EXPERIENCIA CON ESTE EQUIPO TÉCNICO',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.slate400,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 32),
                Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: List.generate(5, (index) {
                      return IconButton(
                        icon: Icon(
                          index < selectedRating ? LucideIcons.star : LucideIcons.star,
                          color: index < selectedRating ? const Color(0xFFF59E0B) : Colors.slate100,
                          size: 40,
                        ),
                        onPressed: () => setModalState(() => selectedRating = index + 1),
                      );
                    }),
                  ),
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: commentController,
                  maxLines: 4,
                  decoration: InputDecoration(
                    hintText: 'Escribe tu reseña aquí...',
                    hintStyle: GoogleFonts.outfit(color: Colors.slate300),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 60,
                  child: ElevatedButton(
                    onPressed: () async {
                      if (selectedRating == 0) return;
                      final success = await _workshopService.createWorkshopReview(
                        widget.workshopId, 
                        selectedRating, 
                        commentController.text
                      );
                      if (success) {
                        Navigator.pop(context);
                        _loadData();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F172A),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                    child: Text(
                      'PUBLICAR OPINIÓN',
                      style: GoogleFonts.spaceGrotesk(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
    }

    final averageRating = _reviews.isEmpty 
        ? 0.0 
        : _reviews.map((e) => (e['rating'] as num)).reduce((a, b) => a + b) / _reviews.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'OPINIONES REALES',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFF0F172A),
                    letterSpacing: -0.5,
                  ),
                ),
                Text(
                  'FEEDBACK DE CLIENTES_VERIFICADOS',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.slate400,
                    letterSpacing: 1.5,
                  ),
                ),
              ],
            ),
            if (_reviews.isNotEmpty)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF7ED),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFFEDD5)),
                ),
                child: Row(
                  children: [
                    const Icon(LucideIcons.star, color: Color(0xFFF59E0B), size: 14),
                    const SizedBox(width: 4),
                    Text(
                      averageRating.toStringAsFixed(1),
                      style: GoogleFonts.spaceGrotesk(
                        color: const Color(0xFF9A3412),
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
        const SizedBox(height: 24),
        if (_isLoggedIn && _userRole == 'CLIENT' && !_hasRated)
          GestureDetector(
            onTap: _showRatingDialog,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  const Icon(LucideIcons.message_square_plus, color: Color(0xFF0F172A)),
                  const SizedBox(width: 16),
                  Text(
                    '¿YA VISITASTE ESTE TALLER? CALIFICA AQUÍ',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF0F172A),
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ),
          ),
        const SizedBox(height: 16),
        if (_reviews.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 40),
            child: Center(
              child: Column(
                children: [
                  const Icon(LucideIcons.message_square, color: Colors.slate200, size: 48),
                  const SizedBox(height: 16),
                  Text(
                    'SIN OPINIONES REGISTRADAS',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.slate300,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _reviews.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final review = _reviews[index];
              return Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFF1F5F9)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${review['user']['firstName']} ${review['user']['lastName']}'.toUpperCase(),
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.5,
                          ),
                        ),
                        Row(
                          children: List.generate(5, (i) => Icon(
                            LucideIcons.star,
                            size: 10,
                            color: i < (review['rating'] as int) ? const Color(0xFFF59E0B) : Colors.slate100,
                          )),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      review['comment'] ?? 'Sin comentario',
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        color: const Color(0xFF64748B),
                        height: 1.4,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
      ],
    );
  }
}
