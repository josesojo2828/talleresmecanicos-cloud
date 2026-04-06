import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class KineticFinanceChart extends StatelessWidget {
  final List<FlSpot> data;
  final Color? color;

  const KineticFinanceChart({super.key, required this.data, this.color});

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) return const Center(child: Text('Sin datos para telemetría.'));

    return LineChart(
      LineChartData(
        gridData: const FlGridData(show: false),
        titlesData: const FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: data,
            isCurved: true,
            color: color ?? const Color(0xFF10B981),
            barWidth: 4,
            isStrokeCapRound: true,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
              show: true,
              color: (color ?? const Color(0xFF10B981)).withOpacity(0.1),
            ),
          ),
        ],
      ),
    );
  }
}
