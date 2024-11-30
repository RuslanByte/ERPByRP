package com.example.springboot.service;

import com.example.springboot.exception.ResourceNotFoundException;
import com.example.springboot.model.Products;
import com.example.springboot.repository.ProductsRepository;
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
public class ProductsService {
    @Autowired
    ProductsRepository productsRepository;

    public List<Products> getAllProdustc(){
        return productsRepository.findAll();
    }

    public Products addProducts(Products products){
        return productsRepository.save(products);
    }

    public void generatePdf(HttpServletResponse response) throws IOException  {
        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        PdfFont font = PdfFontFactory.createFont("src/main/resources/fonts/Roboto-Regular.ttf");
        document.setFont(font);

        document.add(new Paragraph("Отчет").setFontSize(20));

        Table table = new Table(new float[]{1, 1.5f, 1.5f, 1.5f, 1.5f});
        table.addHeaderCell(new Paragraph("ID").setFont(font));
        table.addHeaderCell(new Paragraph("Имя").setFont(font));
        table.addHeaderCell(new Paragraph("Тип").setFont(font));
        table.addHeaderCell(new Paragraph("Количество").setFont(font));
        table.addHeaderCell(new Paragraph("Комментарий").setFont(font));


        List<Products> reports = productsRepository.findAll();
        for (Products report : reports) {
            table.addCell(new Paragraph(report.getId().toString()).setFont(font));
            table.addCell(new Paragraph(report.getName()).setFont(font));
            table.addCell(new Paragraph(report.getType()).setFont(font));
            table.addCell(new Paragraph(report.getCount()).setFont(font));
            table.addCell(new Paragraph(report.getComment()).setFont(font));
        }

        document.add(table);
        document.close();
    }

    public List<Products> findAllProductLimit(int limit){
        Pageable pageable = PageRequest.of(0,limit);
        return productsRepository.findAllProductsLimit(pageable);
    }

    public void deleteProduct(Long id) {
        productsRepository.deleteById(id);
    }

    public Products updateProduct(Long id, Products updateProduct) {
        return productsRepository.findById(id).map(product -> {
            product.setName(updateProduct.getName());
            product.setType(updateProduct.getType());
            product.setCount(updateProduct.getCount());
            product.setComment(updateProduct.getComment());
            return productsRepository.save(product);
        }).orElseThrow(() -> new ResourceNotFoundException("Supplier not find with id" + id));
    }

    public List<Products> searchByTerm(String searchTerm){
        return productsRepository.searchByTerm(searchTerm);
    }
}
