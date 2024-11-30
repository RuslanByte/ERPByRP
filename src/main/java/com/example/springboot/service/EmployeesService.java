package com.example.springboot.service;

import com.example.springboot.exception.ResourceNotFoundException;
import com.example.springboot.model.Employees;

import com.example.springboot.repository.EmployeesRepository;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmployeesService {
    @Autowired
    EmployeesRepository employeesRepository;

    public List<Employees> getAllEmployees(){
        return employeesRepository.findAll();
    }
    public Employees setEmployees(Employees employees){
        return employeesRepository.save(employees);
    }

    public List<Employees> findAllEmployeesLimit(int limit){
        Pageable pageable = PageRequest.of(0, limit);
        return employeesRepository.findAllEmployeesLimit(pageable);
    }

    public void generatePdf(HttpServletResponse response) throws IOException {

        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        pdf.setDefaultPageSize(PageSize.A4.rotate());
        Document document = new Document(pdf);


        PdfFont font = PdfFontFactory.createFont("src/main/resources/fonts/Roboto-Regular.ttf");
        document.setFont(font);


        document.add(new Paragraph("Отчет").setFontSize(20));


        Table table = new Table(new float[]{1, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f});
        table.addHeaderCell(new Paragraph("ID").setFont(font));
        table.addHeaderCell(new Paragraph("Имя пользователя").setFont(font));
        table.addHeaderCell(new Paragraph("Пароль").setFont(font));
        table.addHeaderCell(new Paragraph("У/д").setFont(font));
        table.addHeaderCell(new Paragraph("Фам.").setFont(font));
        table.addHeaderCell(new Paragraph("Имя").setFont(font));
        table.addHeaderCell(new Paragraph("Отч.").setFont(font));
        table.addHeaderCell(new Paragraph("Адрес").setFont(font));
        table.addHeaderCell(new Paragraph("Зарплата").setFont(font));
        table.addHeaderCell(new Paragraph("Тел.").setFont(font));
        table.addHeaderCell(new Paragraph("Комментарий").setFont(font));
        table.addHeaderCell(new Paragraph("Время Рег.").setFont(font));


        List<Employees> reports = employeesRepository.findAll();
        for (Employees report : reports) {
            table.addCell(new Paragraph(report.getId().toString()).setFont(font));
            table.addCell(new Paragraph(report.getUsername()).setFont(font));
            table.addCell(new Paragraph(report.getPassword()).setFont(font));
            table.addCell(new Paragraph(report.getAccessrights()).setFont(font));
            table.addCell(new Paragraph(report.getSurname()).setFont(font));
            table.addCell(new Paragraph(report.getName()).setFont(font));
            table.addCell(new Paragraph(report.getPatronymic()).setFont(font));
            table.addCell(new Paragraph(report.getAddress()).setFont(font));
            table.addCell(new Paragraph(report.getAmount()).setFont(font));
            table.addCell(new Paragraph(report.getTelephone()).setFont(font));
            table.addCell(new Paragraph(report.getComment()).setFont(font));
            table.addCell(new Paragraph(String.valueOf(report.getTime())).setFont(font));
        }

        document.add(table);
        document.close();
    }

    public void deleteEmployee(Long id) {
        employeesRepository.deleteById(id);
    }

    public Employees updateEmployee(Long id, Employees updateEmployee) {
        return employeesRepository.findById(id).map(employee -> {
            employee.setUsername(updateEmployee.getUsername());
            employee.setPassword(updateEmployee.getPassword());
            employee.setAccessrights(updateEmployee.getAccessrights());
            employee.setSurname(updateEmployee.getSurname());
            employee.setName(updateEmployee.getName());
            employee.setPatronymic(updateEmployee.getPatronymic());
            employee.setAddress(updateEmployee.getAddress());
            employee.setAmount(updateEmployee.getAmount());
            employee.setTelephone(updateEmployee.getTelephone());
            employee.setComment(updateEmployee.getComment());
            return employeesRepository.save(employee);
        }).orElseThrow(() -> new ResourceNotFoundException("Supplier not find with id" + id));
    }

    public Employees findEmployeeByUsername(String username) {
        Optional<Employees> employee = employeesRepository.findByUsername(username);
        return employee.orElse(null);
    }

    public String saveImage(MultipartFile file) {

        String directory = "/home/ruslan/images/";
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        File imageFile = new File(directory + filename);

        try {
            file.transferTo(imageFile);
        } catch (IOException e){
            e.printStackTrace();
            throw new RuntimeException("Ошибка сохранения файла " + e.getMessage());
        }
        return filename;
    }

    public Optional<String> getPhotopathByUsername(String username){
        return employeesRepository.findPhotopathByUsername(username);
    }

    public List<Employees> searchByTerm(String searchTerm){
        return employeesRepository.searchByTerm(searchTerm);
    }

}
