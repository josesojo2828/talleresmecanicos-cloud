import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/database/database_service.dart';
import 'package:workshops_mobile/screens/workshop/job_detail_screen.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:workshops_mobile/widgets/kinetic_search.dart';

class JobsTab extends StatefulWidget {
  const JobsTab({super.key});

  @override
  State<JobsTab> createState() => _JobsTabState();
}

class _JobsTabState extends State<JobsTab> {
  final _db = DatabaseService();
  List<Map<String, dynamic>> _jobs = [];
  List<Map<String, dynamic>> _filteredJobs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadJobs();
  }

  Future<void> _loadJobs() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query('works', orderBy: 'created_at DESC');
    setState(() { _jobs = maps; _filteredJobs = maps; _isLoading = false; });
  }

  void _filterJobs(String query) {
    setState(() {
      _filteredJobs = _jobs.where((job) => (job['car_info']?.toString().toLowerCase() ?? "").contains(query.toLowerCase())).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(child: KineticHeader(title: 'Panel de Control', subtitle: 'Órdenes Activas', trailing: IconButton.filled(onPressed: () {}, icon: const Icon(LucideIcons.plus), style: IconButton.styleFrom(backgroundColor: const Color(0xFF0F172A))))),
              const SizedBox(height: 24),
              KineticSearch(onChanged: _filterJobs, hint: 'Buscar bólido por nombre o cliente...'),
              const SizedBox(height: 16),
              Expanded(child: _buildJobsList()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildJobsList() {
    if (_isLoading) return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
    if (_filteredJobs.isEmpty) return const Center(child: Text('Sin coincidencias en boxes.'));

    return ListView.separated(
      itemCount: _filteredJobs.length,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final job = _filteredJobs[index];
        final isSynced = job['sync_status'] == 1;

        return FadeInUp(
          delay: Duration(milliseconds: index * 50),
          child: InkWell(
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => JobDetailScreen(job: job))),
            borderRadius: BorderRadius.circular(24),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), 
                // FIX: Border.all(color: ...)
                border: Border.all(color: const Color(0xFFF1F5F9))),
              child: Row(
                children: [
                  Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
                    child: Icon(LucideIcons.car, color: isSynced ? const Color(0xFF10B981) : Colors.orange, size: 20),
                  ),
                  const SizedBox(width: 16),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(job['car_info'] ?? 'Vehículo', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A))),
                    Text('Total: \$${job['total_price']}', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: const Color(0xFF10B981))),
                  ])),
                  if (!isSynced) const Icon(LucideIcons.cloud_off, size: 14, color: Colors.orange),
                  const SizedBox(width: 12),
                  const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFF94A3B8)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
