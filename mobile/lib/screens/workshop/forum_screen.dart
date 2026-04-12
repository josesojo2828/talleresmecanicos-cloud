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
  List<dynamic> _topics = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTopics();
  }

  Future<void> _loadTopics() async {
    try {
      final res = await _api.get('/forum/topics');
      if (res.statusCode == 200) {
        setState(() { _topics = jsonDecode(res.body); _isLoading = false; });
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: Text('COMUNIDAD KINETIC', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A), elevation: 0.5,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
        : ListView.separated(
            padding: const EdgeInsets.all(24),
            itemCount: _topics.length,
            separatorBuilder: (context, index) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final topic = _topics[index];
              return FadeInUp(
                delay: Duration(milliseconds: index * 50),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), 
                    // FIX: Border.all(color: ...)
                    border: Border.all(color: const Color(0xFFF1F5F9))),
                  child: Row(children: [
                    CircleAvatar(backgroundColor: const Color(0xFF10B981).withOpacity(0.1), child: const Icon(LucideIcons.message_square, color: Color(0xFF10B981), size: 18)),
                    const SizedBox(width: 16),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(topic['title'] ?? 'Sin título', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('${topic['replies']} respuestas • ${topic['author']}', style: GoogleFonts.outfit(fontSize: 11, color: Colors.blueGrey)),
                    ])),
                    const Icon(LucideIcons.chevron_right, size: 16, color: Color(0xFF94A3B8)),
                  ]),
                ),
              );
            },
          ),
    );
  }
}
