import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'dart:convert';

class ForumScreen extends StatefulWidget {
  const ForumScreen({super.key});

  @override
  State<ForumScreen> createState() => _ForumScreenState();
}

class _ForumScreenState extends State<ForumScreen> {
  final _api = ApiClient();
  List _posts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.get('/forum-post');
      if (response.statusCode == 200) {
        setState(() => _posts = jsonDecode(response.body));
      }
    } catch (e) { print('Forum load failed: $e'); }
    finally { setState(() => _isLoading = false); }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('FORO DE TALLERES', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A), elevation: 0,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {}, // Implementar creación de post luego
        backgroundColor: const Color(0xFF0F172A),
        child: const Icon(LucideIcons.plus, color: Colors.white),
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
        : RefreshIndicator(
            onRefresh: _loadPosts,
            color: const Color(0xFF10B981),
            child: ListView.separated(
              padding: const EdgeInsets.all(24),
              itemCount: _posts.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final post = _posts[index];
                return FadeInUp(
                  delay: Duration(milliseconds: index * 100),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.slate.shade100)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(children: [
                          const CircleAvatar(radius: 12, backgroundColor: Color(0xFFF1F5F9), child: Icon(LucideIcons.user, size: 12, color: Color(0xFF94A3B8))),
                          const SizedBox(width: 8),
                          Text(post['user']?['firstName'] ?? 'Taller Anon', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF64748B))),
                        ]),
                        const SizedBox(height: 12),
                        Text(post['title'] ?? 'Sin título', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
                        const SizedBox(height: 8),
                        Text(post['content'] ?? '', maxLines: 3, overflow: TextOverflow.ellipsis, style: GoogleFonts.outfit(color: const Color(0xFF64748B), fontSize: 13)),
                        const SizedBox(height: 16),
                        Row(children: [
                          _buildStat(LucideIcons.heart, '${post['_count']?['likes'] ?? 0}'),
                          const SizedBox(width: 16),
                          _buildStat(LucideIcons.message_circle, '${post['_count']?['comments'] ?? 0}'),
                        ]),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
    );
  }

  Widget _buildStat(IconData icon, String text) {
    return Row(children: [
      Icon(icon, size: 14, color: const Color(0xFF94A3B8)),
      const SizedBox(width: 4),
      Text(text, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8))),
    ]);
  }
}
