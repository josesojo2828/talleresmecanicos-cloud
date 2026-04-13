import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:workshops_mobile/services/workshop_service.dart';
import 'package:workshops_mobile/widgets/kinetic_button.dart';
import 'package:workshops_mobile/widgets/kinetic_input.dart';

class EditPartScreen extends StatefulWidget {
  final Map<String, dynamic>? part;
  const EditPartScreen({super.key, this.part});

  @override
  State<EditPartScreen> createState() => _EditPartScreenState();
}

class _EditPartScreenState extends State<EditPartScreen> {
  final _workshopService = WorkshopService();
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _skuController = TextEditingController();
  final _priceController = TextEditingController();
  final _qtyController = TextEditingController();
  final _descController = TextEditingController();

  String? _selectedCategoryId;
  List<dynamic> _categories = [];
  bool _isLoading = true;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    if (widget.part != null) {
      _nameController.text = widget.part!['name'] ?? '';
      _skuController.text = widget.part!['sku'] ?? '';
      _priceController.text = (widget.part!['price'] ?? 0).toString();
      _qtyController.text = (widget.part!['quantity'] ?? 0).toString();
      _descController.text = widget.part!['description'] ?? '';
      _selectedCategoryId = widget.part!['categoryId'];
    }
    _loadData();
  }

  Future<void> _loadData() async {
    final cats = await _workshopService.getPartCategories();
    setState(() {
      _categories = cats;
      _isLoading = false;
    });
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);

    final data = {
      'name': _nameController.text,
      'sku': _skuController.text,
      'price': double.parse(_priceController.text),
      'quantity': double.parse(_qtyController.text),
      'description': _descController.text,
      'categoryId': _selectedCategoryId,
    };

    bool success;
    if (widget.part != null) {
      success = await _workshopService.updatePart(widget.part!['id'], data);
    } else {
      success = await _workshopService.createPart(data);
    }

    setState(() => _isSaving = false);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(widget.part != null ? 'Repuesto actualizado' : 'Entrada creada')),
      );
      Navigator.pop(context, widget.part != null ? {...widget.part!, ...data} : true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.part != null;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.x, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          if (_isSaving)
            const Center(child: Padding(padding: EdgeInsets.only(right: 16), child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))))
        ],
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6)))
        : SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FadeInDown(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
                          child: Icon(isEdit ? LucideIcons.settings : LucideIcons.package_plus, color: const Color(0xFF0F172A), size: 24),
                        ),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(isEdit ? 'AJUSTES DEL REPUESTO' : 'CREAR ENTRADA', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w900, color: const Color(0xFF0F172A), letterSpacing: 0.5)),
                            Text(isEdit ? 'ACTUALIZA PRECIOS Y STOCK BASE' : 'REGISTRO DE NUEVO MATERIAL', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8), letterSpacing: 1)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),
                  
                  KineticInput(label: 'NOMBRE', controller: _nameController, icon: LucideIcons.tag),
                  const SizedBox(height: 20),
                  
                  KineticInput(label: 'SKU / CÓDIGO', controller: _skuController, icon: LucideIcons.barcode),
                  const SizedBox(height: 20),
                  
                  Row(
                    children: [
                      Expanded(child: KineticInput(label: 'PRECIO', controller: _priceController, icon: LucideIcons.dollar_sign, keyboardType: TextInputType.number)),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('MONEDA', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Dólar (USD)', style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFF0F172A), fontWeight: FontWeight.w500)),
                                  const Icon(LucideIcons.chevron_down, size: 16, color: Color(0xFF94A3B8)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  Row(
                    children: [
                      Expanded(child: KineticInput(label: 'CANTIDAD', controller: _qtyController, icon: LucideIcons.package, keyboardType: TextInputType.number)),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('CATEGORÍA', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1)),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 4),
                              decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<String>(
                                  isExpanded: true,
                                  value: _selectedCategoryId,
                                  hint: Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 12),
                                    child: Text('Seleccionar', style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFF94A3B8))),
                                  ),
                                  items: _categories.map((c) => DropdownMenuItem(
                                    value: c['id'].toString(),
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 12),
                                      child: Text(c['name'] ?? '', style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFF0F172A))),
                                    ),
                                  )).toList(),
                                  onChanged: (val) => setState(() => _selectedCategoryId = val),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  KineticInput(label: 'DESCRIPCIÓN', controller: _descController, icon: LucideIcons.quote, maxLines: 4),
                  
                  const SizedBox(height: 48),
                  
                  KineticButton(
                    label: isEdit ? 'ACTUALIZAR' : 'CREAR ENTRADA',
                    onPressed: _save,
                    color: const Color(0xFF0F172A),
                  ),
                  
                  const SizedBox(height: 16),
                  Center(
                    child: TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text('DESCARTAR', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w900, color: const Color(0xFF94A3B8), letterSpacing: 1.5)),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
    );
  }
}
