import 'dart:io';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PdfService {
  Future<void> generateJobInvoice(Map<String, dynamic> job) async {
    final pdf = pw.Document();
    final prefs = await SharedPreferences.getInstance();
    final workshopName = prefs.getString('user_name') ?? 'Mi Taller';

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Padding(
            padding: const pw.EdgeInsets.all(40),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlign.start,
              children: [
                // Header
                pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
                  pw.Column(crossAxisAlignment: pw.CrossAxisAlign.start, children: [
                    pw.Text(workshopName.toUpperCase(), style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
                    pw.Text('Logística y Soporte Mecánico de Elite', style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey)),
                  ]),
                  pw.Text('FACTURA #${job['id']?.toString().substring(0,6) ?? 'ID'}', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                ]),
                pw.SizedBox(height: 48),

                // Client & Car Info
                pw.Text('DETALLES DEL BÓLIDO', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColors.grey600)),
                pw.Divider(),
                pw.SizedBox(height: 12),
                pw.Text('Vehículo: ${job['car_info'] ?? 'No especificado'}', style: const pw.TextStyle(fontSize: 12)),
                pw.Text('Fecha: ${job['created_at']?.split('T').first ?? 'Reciente'}', style: const pw.TextStyle(fontSize: 12)),
                pw.SizedBox(height: 48),

                // Table Header
                pw.Container(
                  padding: const pw.EdgeInsets.all(10),
                  color: PdfColors.grey200,
                  child: pw.Row(children: [
                    pw.Expanded(child: pw.Text('CONCEPTO', style: pw.TextStyle(fontWeight: pw.FontWeight.bold))),
                    pw.Container(width: 100, child: pw.Text('TOTAL', textAlign: pw.TextAlign.right, style: pw.TextStyle(pw.FontWeight.bold))),
                  ]),
                ),
                // Labor
                _buildTableRow('Mano de Obra / Honorarios', '\$${job['labor_price'] ?? 0}'),
                // Parts
                _buildTableRow('Kit de Repuestos e Insumos', '\$${job['parts_price'] ?? 0}'),

                pw.SizedBox(height: 24),
                pw.Divider(thickness: 2),
                pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
                  pw.Text('TOTAL FINAL CLIENTE', style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
                  pw.Text('\$${job['total_price'] ?? 0}', style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: PdfColors.green)),
                ]),

                pw.Spacer(),
                pw.Divider(),
                pw.Align(alignment: pw.Alignment.center, child: pw.Text('Gracias por confiar en KINETIC ATELIER.', style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey600))),
              ],
            ),
          );
        },
      ),
    );

    // Share result
    await Printing.sharePdf(bytes: await pdf.save(), filename: 'Factura_${job['id']}.pdf');
  }

  pw.Widget _buildTableRow(String concept, String price) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 8, horizontal: 10),
      child: pw.Row(children: [
        pw.Expanded(child: pw.Text(concept)),
        pw.Container(width: 100, child: pw.Text(price, textAlign: pw.TextAlign.right, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))),
      ]),
    );
  }
}
