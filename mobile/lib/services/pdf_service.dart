import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class PdfService {
  Future<void> generateJobInvoice(Map<String, dynamic> job) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        build: (pw.Context context) {
          return pw.Column(
            // FIX: Correct enum name CrossAxisAlignment
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
                    pw.Text('KINETIC ATELIER', style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
                    pw.Text('Terminal de Reparación Oficial', style: pw.TextStyle(fontSize: 10)),
                  ]),
                  pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
                    pw.Text('ORDEN DE TRABAJO', style: pw.TextStyle(fontSize: 16, fontWeight: pw.FontWeight.bold)),
                    pw.Text('#${job['id']?.toString() ?? '0000'}'),
                  ]),
                ],
              ),
              pw.SizedBox(height: 48),
              pw.Text('INFORMACIÓN DEL BÓLIDO', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
              pw.Divider(),
              pw.Text('Vehículo: ${job['car_info'] ?? 'Indefinido'}'),
              pw.Text('Fecha: ${job['created_at']?.split('T').first ?? 'Reciente'}'),
              pw.SizedBox(height: 24),
              pw.Text('RESUMEN DE MANIOBRAS', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
              pw.Divider(),
              pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
                pw.Text('Mano de Obra'),
                pw.Text('\$${job['labor_price'] ?? 0}'),
              ]),
              pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
                pw.Text('Repuestos e Insumos'),
                pw.Text('\$${job['parts_price'] ?? 0}'),
              ]),
              pw.SizedBox(height: 24),
              pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
                pw.Text('TOTAL FINAL', style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
                pw.Text('\$${job['total_price'] ?? 0}', style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: PdfColors.green)),
              ]),
              pw.SizedBox(height: 48),
              pw.Center(child: pw.Text('GRACIAS POR CONFIAR EN KINETIC ATELIER', style: pw.TextStyle(fontSize: 8))),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(onLayout: (PdfPageFormat format) async => pdf.save());
  }
}
