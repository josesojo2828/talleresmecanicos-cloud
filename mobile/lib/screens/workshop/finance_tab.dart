import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/widgets/kinetic_header.dart';
import 'package:intl/intl.dart';

class FinanceTab extends StatefulWidget {
  const FinanceTab({super.key});

  @override
  State<FinanceTab> createState() => _FinanceTabState();
}

class _FinanceTabState extends State<FinanceTab> {
  final _workshopService = WorkshopService();
  bool _isLoading = true;
  Map<String, dynamic>? _financeData;
  final _formatter = NumberFormat.currency(symbol: '\$', decimalDigits: 0);

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final data = await _workshopService.getDashboardData();
      if (mounted) {
        setState(() {
          _financeData = data;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
    }

    final stats = _financeData?['stats'];
    final chartData = _financeData?['chartData'] as List? ?? [];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          color: const Color(0xFF10B981),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FadeInDown(
                  child: const KineticHeader(
                    title: 'DASHBOARD FINANCIERO',
                    subtitle: 'Evolución de Ingresos y Activos',
                  ),
                ),
                const SizedBox(height: 32),

                // Top Stats Row
                Row(
                  children: [
                    Expanded(
                      child: _buildFinCard(
                        'EARNINGS',
                        _formatter.format(stats?['totalIncome'] ?? 0),
                        '+12.8%', // Hardcoded for design, update later if backend provides
                        LucideIcons.dollar_sign,
                        const Color(0xFF10B981),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildFinCard(
                        'SPENDING\'S',
                        _formatter.format(stats?['totalParts'] ?? 0),
                        '+2.4%',
                        LucideIcons.shopping_cart,
                        const Color(0xFF3B82F6),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildFinCard(
                  'INVENTORY STOCK',
                  _formatter.format(stats?['inventoryValue'] ?? 0),
                  '-6.7%',
                  LucideIcons.package,
                  const Color(0xFF8B5CF6),
                  isFullWidth: true,
                ),

                const SizedBox(height: 32),

                // Balance Summary Chart
                _buildBalanceChart(chartData),

                const SizedBox(height: 32),

                // Expenses Breakdown (Pie Chart equivalent)
                _buildExpensesBreakdown(stats),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFinCard(String label, String value, String trend, IconData icon, Color color, {bool isFullWidth = false}) {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF1F5F9)),
          boxShadow: [
            BoxShadow(color: const Color(0xFF0F172A).withOpacity(0.02), blurRadius: 20, offset: const Offset(0, 5))
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                  child: Icon(icon, color: color, size: 18),
                ),
                if (!isFullWidth)
                  Text(trend, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: trend.startsWith('+') ? const Color(0xFF10B981) : Colors.redAccent)),
              ],
            ),
            const SizedBox(height: 16),
            Text(label, style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
            const SizedBox(height: 4),
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(value, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), height: 1)),
                if (isFullWidth) ...[
                  const Spacer(),
                  Text(trend, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: trend.startsWith('+') ? const Color(0xFF10B981) : Colors.redAccent)),
                  const SizedBox(width: 4),
                  Text('IN ASSETS', style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
                ]
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceChart(List<dynamic> chartData) {
    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('BALANCE SUMMARY', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
                    Text('EVOLUCIÓN DE INGRESOS OPERATIVOS', style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(10)),
                  child: Text(DateFormat('MMMM yyyy').format(DateTime.now()).toUpperCase(), style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.bold, color: const Color(0xFF64748B))),
                ),
              ],
            ),
            const SizedBox(height: 32),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: true, drawVerticalLine: false),
                  titlesData: FlTitlesData(
                    show: true,
                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          if (value.toInt() < 0 || value.toInt() >= chartData.length) return const SizedBox();
                          final dateStr = chartData[value.toInt()]['date'].toString();
                          final date = dateStr.contains('-') ? DateTime.parse('$dateStr-01') : DateTime.now();
                          return Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(
                              DateFormat('MMM').format(date).toUpperCase(),
                              style: GoogleFonts.outfit(fontSize: 8, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8)),
                            ),
                          );
                        },
                        reservedSize: 30,
                      )
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: chartData.asMap().entries.map((e) {
                        return FlSpot(e.key.toDouble(), (e.value['total'] as num).toDouble());
                      }).toList(),
                      isCurved: true,
                      color: const Color(0xFF10B981),
                      barWidth: 4,
                      isStrokeCapRound: true,
                      dotData: const FlDotData(show: true),
                      belowBarData: BarAreaData(
                        show: true,
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            const Color(0xFF10B981).withOpacity(0.2),
                            const Color(0xFF10B981).withOpacity(0.0),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExpensesBreakdown(dynamic stats) {
    final double labor = (stats?['totalLabor'] ?? 0).toDouble();
    final double parts = (stats?['totalParts'] ?? 0).toDouble();
    final double total = labor + parts;

    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('EXPENSES SUMMARY', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
            const SizedBox(height: 24),
            Row(
              children: [
                SizedBox(
                  height: 120,
                  width: 120,
                  child: PieChart(
                    PieChartData(
                      sectionsSpace: 0,
                      centerSpaceRadius: 35,
                      sections: [
                        PieChartSectionData(color: const Color(0xFF10B981), value: labor, title: '', radius: 20),
                        PieChartSectionData(color: const Color(0xFFE2E8F0), value: parts, title: '', radius: 20),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 24),
                Expanded(
                  child: Column(
                    children: [
                      _buildPieLegend('REPUESTOS', _formatter.format(parts), const Color(0xFFE2E8F0), LucideIcons.package),
                      const SizedBox(height: 12),
                      _buildPieLegend('LABOR', _formatter.format(labor), const Color(0xFF10B981), LucideIcons.wrench),
                      const Divider(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('TOTAL', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8))),
                          Text(_formatter.format(total), style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
                        ],
                      )
                    ],
                  ),
                )
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildPieLegend(String label, String value, Color color, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
          child: Icon(icon, size: 12, color: color),
        ),
        const SizedBox(width: 12),
        Text(label, style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 0.5)),
        const Spacer(),
        Text(value, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A))),
      ],
    );
  }
}
