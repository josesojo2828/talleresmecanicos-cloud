import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workshops_mobile/services/api_client.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  late IO.Socket _socket;
  final _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  bool _isConnected = false;
  bool _isOffline = false;

  @override
  void initState() {
    super.initState();
    _checkConnectivityAndConnect();
  }

  Future<void> _checkConnectivityAndConnect() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    if (connectivityResult.contains(ConnectivityResult.none)) {
      setState(() => _isOffline = true);
      return;
    }
    
    _connectSocket();
  }

  Future<void> _connectSocket() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');
    final baseUrl = ApiClient().baseUrl.replaceAll('/api', '');

    _socket = IO.io(baseUrl, IO.OptionBuilder()
      .setTransports(['websocket'])
      .setNamespace('/chat')
      .setAuth({'token': token})
      .build());

    _socket.onConnect((_) {
      if (mounted) setState(() => _isConnected = true);
    });

    _socket.on('history', (data) {
      if (mounted) setState(() => _messages.addAll(List<Map<String, dynamic>>.from(data)));
    });

    _socket.on('newMessage', (data) {
      if (mounted) setState(() => _messages.insert(0, data));
    });

    _socket.onDisconnect((_) {
      if (mounted) setState(() => _isConnected = false);
    });
  }

  @override
  void dispose() {
    _socket.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isOffline) return _buildOfflineState();

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('CHAT PÚBLICO', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 16)),
          Text(_isConnected ? 'Online' : 'Conectando...', style: GoogleFonts.outfit(fontSize: 10, color: _isConnected ? Colors.green : Colors.orange)),
        ]),
        backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A), elevation: 0,
      ),
      body: Column(
        children: [
          Expanded(child: _buildMessageList()),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildOfflineState() {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            const Icon(LucideIcons.wifi_off, size: 80, color: Color(0xFF94A3B8)),
            const SizedBox(height: 24),
            Text('ZONA SIN SEÑAL', style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
            const SizedBox(height: 8),
            Text('El Chat requiere una conexión en tiempo real. Reconéctate para hablar con otros talleres.', textAlign: TextAlign.center, style: GoogleFonts.outfit(color: const Color(0xFF64748B))),
            const SizedBox(height: 32),
            ElevatedButton(onPressed: _checkConnectivityAndConnect, child: const Text('REINTENTAR CONEXIÓN')),
          ]),
        ),
      ),
    );
  }

  Widget _buildMessageList() {
    return ListView.builder(
      reverse: true,
      padding: const EdgeInsets.all(20),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final msg = _messages[index];
        final isMe = false; // Implementar lógica con CurrentUser
        return Align(
          alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
          child: FadeInUp(
            delay: const Duration(milliseconds: 100),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: isMe ? const Color(0xFF0F172A) : Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (!isMe) Text(msg['user']?['firstName'] ?? 'Taller', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF3B82F6))),
                  Text(msg['content'] ?? '', style: GoogleFonts.outfit(color: isMe ? Colors.white : const Color(0xFF0F172A), fontSize: 14)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(20),
      color: Colors.white,
      child: SafeArea(
        child: Row(children: [
          Expanded(child: TextField(
            controller: _messageController,
            decoration: InputDecoration(hintText: 'Escribe un mensaje...', filled: true, fillColor: const Color(0xFFF1F5F9), border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none)),
          )),
          const SizedBox(width: 12),
          IconButton.filled(onPressed: () {
            if (_messageController.text.isNotEmpty) {
              _socket.emit('sendMessage', _messageController.text);
              _messageController.clear();
            }
          }, icon: const Icon(LucideIcons.send_horizontal), style: IconButton.styleFrom(backgroundColor: const Color(0xFF0F172A))),
        ]),
      ),
    );
  }
}
