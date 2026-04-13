class JobDetailScreen extends StatefulWidget {
  final Map<String, dynamic> job;
  const JobDetailScreen({super.key, required this.job});

  @override
  State<JobDetailScreen> createState() => _JobDetailScreenState();
}

class _JobDetailScreenState extends State<JobDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late String _status;
  final pdfService = PdfService();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _status = widget.job['status'] ?? 'OPEN';
  }

  final Map<String, Color> _statusColors = {
    'OPEN': const Color(0xFF64748B),
    'IN_PROGRESS': const Color(0xFF3B82F6),
    'COMPLETED': const Color(0xFF10B981),
    'DELIVERED': const Color(0xFF0F172A),
  };

  final Map<String, String> _statusLabels = {
    'OPEN': 'ABIERTO',
    'IN_PROGRESS': 'EN PROGRESO',
    'COMPLETED': 'COMPLETADO',
    'DELIVERED': 'ENTREGADO',
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  _buildTabSelector(),
                  const SizedBox(height: 20),
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.7,
                    child: TabBarView(
                      controller: _tabController,
                      children: [
                        _buildSummaryTab(),
                        _buildPartsTab(),
                        _buildTechDataTab(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 220,
      backgroundColor: const Color(0xFF0F172A),
      pinned: true,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(LucideIcons.chevron_left, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
      actions: [
        IconButton(icon: const Icon(LucideIcons.share_2, color: Colors.white), onPressed: () {}),
        IconButton(icon: const Icon(LucideIcons.file_text, color: Colors.white), onPressed: () => pdfService.generateJobInvoice(widget.job)),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          children: [
            Positioned(
              left: -50, top: -50,
              child: Icon(LucideIcons.zap, size: 250, color: Colors.white.withOpacity(0.03)),
            ),
            Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(16)),
                        child: const Icon(LucideIcons.zap, color: Colors.white, size: 20),
                      ),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(widget.job['client_name']?.toString().toUpperCase() ?? 'CLIENTE FINAL', style: GoogleFonts.outfit(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                          Text('VEHÍCULO: ${widget.job['car_info'] ?? '---'} • ${widget.job['id']?.toString().substring(0, 8).toUpperCase() ?? ''}', style: GoogleFonts.outfit(color: Colors.white.withOpacity(0.5), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabSelector() {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFE2E8F0))),
      child: TabBar(
        controller: _tabController,
        dividerColor: Colors.transparent,
        indicator: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(16)),
        labelColor: Colors.white,
        unselectedLabelColor: const Color(0xFF64748B),
        labelStyle: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 10, letterSpacing: 1),
        tabs: const [
          Tab(text: 'RESUMEN'),
          Tab(text: 'REPUESTOS'),
          Tab(text: 'DATOS TÉCNICOS'),
        ],
      ),
    );
  }

  String _getVal(String key, [String? altKey]) {
    return widget.job[key]?.toString() ?? widget.job[altKey]?.toString() ?? '---';
  }

  Widget _buildSummaryTab() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildMainInfoCard(),
          const SizedBox(height: 20),
          _buildStatusSelector(),
          const SizedBox(height: 20),
          _buildEvidenceSection(),
        ],
      ),
    );
  }

  Widget _buildMainInfoCard() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32), border: Border.all(color: const Color(0xFFE2E8F0))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.wrench, color: Color(0xFF0F172A), size: 20),
              const SizedBox(width: 12),
              Expanded(child: Text(_getVal('title').toUpperCase(), style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 18, letterSpacing: -0.5))),
            ],
          ),
          const SizedBox(height: 16),
          Text(_getVal('description'), style: GoogleFonts.outfit(color: const Color(0xFF64748B), height: 1.5, fontSize: 13, fontWeight: FontWeight.w500)),
          const SizedBox(height: 32),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 20,
            crossAxisSpacing: 20,
            childAspectRatio: 1.5,
            children: [
              _buildMiniInfo('CLIENTE', _getVal('client_name', 'clientName'), LucideIcons.user),
              _buildMiniInfo('VEHÍCULO', _getVal('car_info', 'vehicleLicensePlate'), LucideIcons.hash),
              _buildMiniInfo('TELÉFONO', _getVal('client_phone', 'clientPhone'), LucideIcons.phone),
              _buildMiniPrice('INVERSIÓN ACTUAL', widget.job['total_price'] ?? widget.job['totalPrice'] ?? 0),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMiniInfo(String label, String value, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
        const SizedBox(height: 8),
        Row(
          children: [
            Icon(icon, size: 14, color: const Color(0xFF10B981)),
            const SizedBox(width: 8),
            Expanded(child: Text(value, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF0F172A), fontSize: 13), overflow: TextOverflow.ellipsis)),
          ],
        ),
      ],
    );
  }

  Widget _buildMiniPrice(String label, dynamic value) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: GoogleFonts.outfit(fontSize: 8, fontWeight: FontWeight.w900, color: Colors.white54, letterSpacing: 1)),
          const Spacer(),
          Text('\$$value', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, color: const Color(0xFF10B981), fontSize: 18)),
        ],
      ),
    );
  }

  Widget _buildStatusSelector() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text('ESTADO ACTUAL', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 2)),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            decoration: BoxDecoration(color: _statusColors[_status], borderRadius: BorderRadius.circular(100)),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(LucideIcons.package_check, color: Colors.white, size: 14),
                const SizedBox(width: 8),
                Text(_statusLabels[_status]!, style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 10, letterSpacing: 1)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: _statusLabels.keys.map((s) => _buildStatusButton(s)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusButton(String s) {
    final isSelected = _status == s;
    return GestureDetector(
      onTap: () => setState(() => _status = s),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0)),
        ),
        child: Text(_statusLabels[s]!, style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: isSelected ? Colors.white : const Color(0xFF94A3B8), letterSpacing: 1)),
      ),
    );
  }

  Widget _buildEvidenceSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32)),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(LucideIcons.image, size: 16, color: Color(0xFF0F172A)),
                  const SizedBox(width: 12),
                  Text('EVIDENCIAS ACTUALES', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1)),
                ],
              ),
              const Icon(LucideIcons.plus, size: 20, color: Color(0xFF94A3B8)),
            ],
          ),
          const SizedBox(height: 100),
          const Icon(LucideIcons.box, size: 48, color: Color(0xFFF1F5F9)),
          const SizedBox(height: 16),
          Text('SIN FOTOS DE EVIDENCIA CARGADAS', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildPartsTab() {
    final parts = widget.job['partsUsed'] as List?;
    if (parts == null || parts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.package, size: 64, color: Color(0xFFCBD5E1)),
            const SizedBox(height: 16),
            Text('NO HAY REPUESTOS EN ESTA FICHA', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), fontSize: 12, letterSpacing: 1)),
          ],
        ),
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: parts.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final p = parts[index];
        final partInfo = p['part'] ?? {};
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE2E8F0))),
          child: Row(
            children: [
              Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: const Color(0xFFF1F5F9), shape: BoxShape.circle), child: const Icon(LucideIcons.cog, size: 16, color: Color(0xFF0F172A))),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(partInfo['name']?.toString().toUpperCase() ?? 'REPUESTO', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 14)),
                    Text('CANTIDAD: ${p['quantity'] ?? 1}', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8))),
                  ],
                ),
              ),
              Text('\$${(p['quantity'] ?? 1) * (partInfo['price'] ?? 0)}', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, color: const Color(0xFF10B981))),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTechDataTab() {
    return Center(
      child: Text('EDITOR TÉCNICO EN DESARROLLO', style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 12, color: const Color(0xFF94A3B8))),
    );
  }
}
