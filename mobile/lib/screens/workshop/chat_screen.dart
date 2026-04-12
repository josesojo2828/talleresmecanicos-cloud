import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:workshops_mobile/services/api_client.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _msgController = TextEditingController();
  late IO.Socket _socket;
  final List<Map<String, dynamic>> _messages = [];
  bool _isConnected = false;

  @override
  void initState() {
    super.initState();
    _initSocket();
  }

  void _initSocket() {
    final baseUrl = ApiClient().baseUrl.replaceAll('/api', '');
    
    // FIX: Proper socket configuration without setNamespace
    _socket = IO.io('$baseUrl/chat', IO.OptionBuilder()
      .setTransports(['websocket'])
      .disableAutoConnect()
      .build());

    _socket.connect();

    _socket.onConnect((_) {
      if (mounted) setState(() => _isConnected = true);
    });

    _socket.onDisconnect((_) {
      if (mounted) setState(() => _isConnected = false);
    });

    _socket.on('message', (data) {
      if (mounted) {
        setState(() {
          _messages.add({
            'user': data['user'] ?? 'Anónimo',
            'text': data['text'] ?? '',
            'isMe': false,
          });
        });
      }
    });
  }

  void _sendMessage() {
    if (_msgController.text.isNotEmpty) {
      final msg = {'text': _msgController.text, 'user': 'Piloto'};
      _socket.emit('message', msg);
      setState(() {
        _messages.add({'user': 'Yo', 'text': _msgController.text, 'isMe': true});
      });
      _msgController.clear();
    }
  }

  @override
  void dispose() {
    _socket.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('CANAL PÚBLICO RADIO', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 13)),
          Text(_isConnected ? '🛰️ EN LÍNEA' : '🔴 DESCONECTADO', style: GoogleFonts.outfit(fontSize: 9, color: _isConnected ? const Color(0xFF10B981) : Colors.red)),
        ]),
        backgroundColor: Colors.white, foregroundColor: const Color(0xFF0F172A), elevation: 1,
      ),
      body: Column(
        children: [
          Expanded(child: ListView.builder(
            padding: const EdgeInsets.all(24),
            itemCount: _messages.length,
            itemBuilder: (context, index) {
              final msg = _messages[index];
              return _buildMessageBubble(msg);
            },
          )),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> msg) {
    final isMe = msg['isMe'] ?? false;
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isMe ? const Color(0xFF10B981) : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: Radius.circular(isMe ? 20 : 0),
            bottomRight: Radius.circular(isMe ? 0 : 20),
          ),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 5)],
        ),
        child: Column(crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start, children: [
          Text(msg['user'], style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: isMe ? Colors.white70 : Colors.blueGrey)),
          Text(msg['text'], style: GoogleFonts.outfit(color: isMe ? Colors.white : const Color(0xFF0F172A), fontWeight: FontWeight.bold)),
        ]),
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(20),
      color: Colors.white,
      child: SafeArea(child: Row(children: [
        Expanded(child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
          child: TextField(controller: _msgController, decoration: const InputDecoration(border: InputBorder.none, hintText: 'Enviá un mensaje a boxes...')),
        )),
        const SizedBox(width: 12),
        IconButton.filled(onPressed: _sendMessage, icon: const Icon(LucideIcons.send_horizontal), style: IconButton.styleFrom(backgroundColor: const Color(0xFF10B981))),
      ])),
    );
  }
}
