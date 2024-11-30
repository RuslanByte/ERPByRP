package com.example.springboot.service;


import com.example.springboot.exception.ResourceNotFoundException;
import com.example.springboot.model.Employees;
import com.example.springboot.model.Suppliers;
import com.example.springboot.repository.SuppliersRepository;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class SuppliersService {
    @Autowired
    SuppliersRepository suppliersRepository;

    public List<Suppliers> getAllSuppliers(){
        return suppliersRepository.findAll();
    }

    public List<Suppliers> findAllSuppliersLimit(int limit){
        Pageable pageable = PageRequest.of(0, limit);
        return suppliersRepository.findAllSuppliersLimit(pageable);
    }

    public Suppliers addSuppliers(Suppliers products){
        return suppliersRepository.save(products);
    }

    public void generatePdf(HttpServletResponse response) throws IOException {
        // Создайте документ PDF
        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Подключите шрифт с поддержкой кириллицы
        PdfFont font = PdfFontFactory.createFont("src/main/resources/fonts/Roboto-Regular.ttf");
        document.setFont(font);

        // Добавьте заголовок
        document.add(new Paragraph("Отчет").setFontSize(20));

        // Создайте таблицу и добавьте данные
        Table table = new Table(new float[]{1, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f});
        table.addHeaderCell(new Paragraph("ID").setFont(font));
        table.addHeaderCell(new Paragraph("Имя").setFont(font));
        table.addHeaderCell(new Paragraph("Тип").setFont(font));
        table.addHeaderCell(new Paragraph("Количество").setFont(font));
        table.addHeaderCell(new Paragraph("Телефон").setFont(font));
        table.addHeaderCell(new Paragraph("Комментарий").setFont(font));


        List<Suppliers> reports = suppliersRepository.findAll();
        for (Suppliers report : reports) {
            table.addCell(new Paragraph(report.getId().toString()).setFont(font));
            table.addCell(new Paragraph(report.getName()).setFont(font));
            table.addCell(new Paragraph(report.getType()).setFont(font));
            table.addCell(new Paragraph(report.getCount()).setFont(font));
            table.addCell(new Paragraph(report.getTelephone()).setFont(font));
            table.addCell(new Paragraph(report.getComment()).setFont(font));
        }

        document.add(table);
        document.close();
    }


    public void deleteSupplier(Long id){
        suppliersRepository.deleteById(id);
    }

    public Suppliers updateSupplier(Long id, Suppliers updateSupplier){
        return suppliersRepository.findById(id).map(supplier -> {
            supplier.setName(updateSupplier.getName());
            supplier.setType(updateSupplier.getType());
            supplier.setCount(updateSupplier.getCount());
            supplier.setTelephone(updateSupplier.getTelephone());
            supplier.setComment(updateSupplier.getComment());
            return suppliersRepository.save(supplier);
        }).orElseThrow(() -> new ResourceNotFoundException("Supplier not find with id" + id));
    }

    public List<Suppliers> searchByTerm(String searchTerm){
        return suppliersRepository.searchByTerm(searchTerm);
    }

}
