import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/api_client.dart';
import 'package:workshops_mobile/screens/support/user_detail_screen.dart';
import 'package:workshops_mobile/screens/support/create_user_screen.dart'; // Crearemos esta pantalla
import 'dart:convert';

class SupportUserListTab extends StatefulWidget {
  const SupportUserListTab({super.key});

  @override
  State<SupportUserListTab> createState() => _SupportUserListTabState();
}

class _SupportUserListTabState extends State<SupportUserListTab> {
  final _api = ApiClient();
  List<dynamic> _users = [];
  List<dynamic> _filteredUsers = [];
  bool _isLoading = true;
  String _activeFilter = 'ALL';

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.get('/user');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final list = data['body']?['data'] ?? data['data'] ?? [];
        setState(() {
          _users = list;
          _filteredUsers = list;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error al cargar usuarios: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _toggleUserStatus(String id, bool currentStatus) async {
    try {
      final response = await _api.put('/user/$id', {'enabled': !currentStatus});
      if (response.statusCode == 200) {
        _loadUsers(); // Recargamos para asegurar sincronía
      }
    } catch (e) {
      print('Error al cambiar estado: $e');
    }
  }

  void _filterUsers(String role) {
    setState(() {
      _activeFilter = role;
      if (role == 'ALL') {
        _filteredUsers = _users;
      } else {
        _filteredUsers = _users.where((u) => u['role'] == role).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const CreateUserScreen()),
          );
          _loadUsers();
        },
        backgroundColor: const Color(0xFF3B82F6),
        child: const Icon(LucideIcons.plus, color: Colors.white),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              _buildFilters(),
              const SizedBox(height: 16),
              Expanded(child: _buildList()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return FadeInDown(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'GESTIÓN DE USUARIOS',
            style: GoogleFonts.outfit(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF0F172A),
              letterSpacing: -0.5,
            ),
          ),
          Text(
            'Control de acceso y estados',
            style: GoogleFonts.outfit(
              fontSize: 14,
              color: const Color(0xFF64748B),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildFilterChip('Todos', 'ALL'),
          const SizedBox(width: 8),
          _buildFilterChip('Talleres', 'TALLER'),
          const SizedBox(width: 8),
          _buildFilterChip('Clientes', 'CLIENT'),
          const SizedBox(width: 8),
          _buildFilterChip('Soporte', 'SUPPORT'),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _activeFilter == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => _filterUsers(value),
      selectedColor: const Color(0xFF3B82F6),
      labelStyle: GoogleFonts.outfit(
        fontSize: 12,
        fontWeight: FontWeight.bold,
        color: isSelected ? Colors.white : const Color(0xFF64748B),
      ),
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: isSelected ? Colors.transparent : const Color(0xFFE2E8F0))),
      showCheckmark: false,
    );
  }

  Widget _buildList() {
    if (_isLoading) return const Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6)));
    if (_filteredUsers.isEmpty) return const Center(child: Text('No hay usuarios en esta categoría.'));

    return RefreshIndicator(
      onRefresh: _loadUsers,
      child: ListView.separated(
        itemCount: _filteredUsers.length,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final user = _filteredUsers[index];
          final role = user['role'] ?? 'CLIENT';
          final isTaller = role == 'TALLER';
          final isEnabled = user['enabled'] ?? true;

          return FadeInUp(
            delay: Duration(milliseconds: index * 50),
            child: InkWell(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => UserDetailScreen(user: user)));
              },
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFF1F5F9)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: isTaller ? const Color(0xFF3B82F6).withOpacity(0.1) : const Color(0xFF10B981).withOpacity(0.1),
                      child: Icon(
                        isTaller ? LucideIcons.building_2 : LucideIcons.user,
                        color: isTaller ? const Color(0xFF3B82F6) : const Color(0xFF10B981),
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${user['firstName'] ?? ''} ${user['lastName'] ?? ''}'.trim(),
                            style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15, color: const Color(0xFF0F172A)),
                          ),
                          Text(
                            user['email'] ?? 'Sin email',
                            style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF94A3B8)),
                          ),
                        ],
                      ),
                    ),
                    Transform.scale(
                      scale: 0.8,
                      child: Switch(
                        value: isEnabled,
                        onChanged: (val) => _toggleUserStatus(user['id'].toString(), isEnabled),
                        activeColor: const Color(0xFF10B981),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
