package com.example.springboot.service;

import com.example.springboot.exception.ResourceNotFoundException;
import com.example.springboot.model.Orders;
import com.example.springboot.repository.OrderRepository;

import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;


import java.io.IOException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    public void generatePdf(HttpServletResponse response) throws IOException {

        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        pdf.setDefaultPageSize(PageSize.A4.rotate());
        Document document = new Document(pdf);


        PdfFont font = PdfFontFactory.createFont("src/main/resources/fonts/Roboto-Regular.ttf");
        document.setFont(font);


        document.add(new Paragraph("Отчет").setFontSize(20));


        Table table = new Table(new float[]{1, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f});
        table.addHeaderCell(new Paragraph("ID").setFont(font));
        table.addHeaderCell(new Paragraph("Населеный пункт").setFont(font));
        table.addHeaderCell(new Paragraph("Округ").setFont(font));
        table.addHeaderCell(new Paragraph("Улица").setFont(font));
        table.addHeaderCell(new Paragraph("Дом").setFont(font));
        table.addHeaderCell(new Paragraph("Подъезд").setFont(font));
        table.addHeaderCell(new Paragraph("Этаж").setFont(font));
        table.addHeaderCell(new Paragraph("Квартира").setFont(font));
        table.addHeaderCell(new Paragraph("Х/c").setFont(font));
        table.addHeaderCell(new Paragraph("Г/с").setFont(font));
        table.addHeaderCell(new Paragraph("Т/с").setFont(font));
        table.addHeaderCell(new Paragraph("Сумма").setFont(font));
        table.addHeaderCell(new Paragraph("Телефон").setFont(font));


        List<Orders> reports = orderRepository.findAllOrderByIdDesc();
        for (Orders report : reports) {
            table.addCell(new Paragraph(report.getId().toString()).setFont(font));
            table.addCell(new Paragraph(report.getCity()).setFont(font));
            table.addCell(new Paragraph(report.getDistrict()).setFont(font));
            table.addCell(new Paragraph(report.getStreet()).setFont(font));
            table.addCell(new Paragraph(report.getHouse()).setFont(font));
            table.addCell(new Paragraph(report.getEntrance()).setFont(font));
            table.addCell(new Paragraph(report.getFloor()).setFont(font));// Если название содержит русские символы
            table.addCell(new Paragraph(report.getApartment()).setFont(font));
            table.addCell(new Paragraph(report.getColdcounter()).setFont(font));
            table.addCell(new Paragraph(report.getHotcounter()).setFont(font));
            table.addCell(new Paragraph(report.getHeatmeter()).setFont(font));
            table.addCell(new Paragraph(report.getAmount()).setFont(font));
            table.addCell(new Paragraph(report.getTelephone()).setFont(font));
        }

        document.add(table);
        document.close();
    }



    public List<Orders> getAllPostsOrderedByIdDesc() {
        return orderRepository.findAllOrderByIdDesc();
    }


    public List<Orders> getAllPostsOrderedByIdDescLimit(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return orderRepository.findAllOrderByIdDescLimit(pageable);
    }


    public List<Orders> getAllOrders(){
        return orderRepository.findAll();
    }


    public Orders addOrder(Orders order){
        return orderRepository.save(order);
    }


    public Orders updateOrderStatus(Long id, String status){
        Orders order = orderRepository.findById(id).orElse(null);
        if(order != null){
            order.setStatus(status);
            if (!status.equals("в работе") && !status.equals("перенесен")){
                order.setCompleteOrderTime();
            }
            return orderRepository.save(order);
        } else {
            return null;
        }
    }

    public List<Orders> getFilteredOrdersStatus(){
        List<String> excludedStatuses = Arrays.asList("выполнено","отказ");
        return orderRepository.findAllExcludedStatus(excludedStatuses);
    }


    public List<Orders> findAllExcludedStatusAndName(String name){
        List<String> excludedStatuses = Arrays.asList("выполнено","отказ");
        return orderRepository.findAllExcludedStatusAndName(excludedStatuses, name);
    }


    public void deleteOrders(Long id){
        orderRepository.deleteById(id);
    }


    public Orders updateOrders(Long id, Orders updatedOrders){
        return orderRepository.findById(id).map(order -> {
            order.setCity(updatedOrders.getCity());
            order.setDistrict(updatedOrders.getDistrict());
            order.setStreet(updatedOrders.getStreet());
            order.setHouse(updatedOrders.getHouse());
            order.setEntrance(updatedOrders.getEntrance());
            order.setFloor(updatedOrders.getFloor());
            order.setApartment(updatedOrders.getApartment());
            order.setColdcounter(updatedOrders.getColdcounter());
            order.setHotcounter(updatedOrders.getHotcounter());
            order.setPricecoldhotcounter(updatedOrders.getPricecoldhotcounter());
            order.setHeatmeter(updatedOrders.getHeatmeter());
            order.setPriceheatmeter(updatedOrders.getPriceheatmeter());
            order.setamount(updatedOrders.getAmount());
            order.setTelephone(updatedOrders.getTelephone());
            order.setComment(updatedOrders.getComment());
            order.setMaster(updatedOrders.getMaster());
            order.setFormofpayment(updatedOrders.getFormofpayment());
            order.setStatus(updatedOrders.getStatus());
            return orderRepository.save(order);
        }).orElseThrow(() -> new ResourceNotFoundException("Order not find with id " + id));
    }

    public Map<String, Long> getOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate){

        List<Orders> orders = orderRepository.findByAddOrderTimeBetween(startDate, endDate);;

        long newCount = orders.stream().filter(order -> order.getStatus().equals("Новый")).count();
        long completedCount = orders.stream().filter(order -> order.getStatus().equals("выполнено")).count();
        long inWorkCount = orders.stream().filter(order -> order.getStatus().equals("в работе")).count();
        long transferred = orders.stream().filter(order -> order.getStatus().equals("перенесен")).count();
        long refusedCount = orders.stream().filter(order -> order.getStatus().equals("отказ")).count();

        Map<String, Long> formattedStatusCounts = new HashMap<>();
        formattedStatusCounts.put("New", newCount);
        formattedStatusCounts.put("Complete", completedCount);
        formattedStatusCounts.put("InWork", inWorkCount);
        formattedStatusCounts.put("Transferred", transferred);
        formattedStatusCounts.put("Refusal", refusedCount);

        return formattedStatusCounts;
    }

    public Map<String, Long> findByAddOrderTimeBetweenAndName(LocalDateTime startDate, LocalDateTime endDate, String master){

        List<Orders> orders = orderRepository.findByAddOrderTimeBetweenAndName(startDate, endDate, master);

        long newCount = orders.stream().filter(order -> order.getStatus().equals("Новый")).count();
        long completedCount = orders.stream().filter(order -> order.getStatus().equals("выполнено")).count();
        long inWorkCount = orders.stream().filter(order -> order.getStatus().equals("в работе")).count();
        long transferred = orders.stream().filter(order -> order.getStatus().equals("перенесен")).count();
        long refusedCount = orders.stream().filter(order -> order.getStatus().equals("отказ")).count();

        Map<String, Long> formattedStatusCounts = new HashMap<>();
        formattedStatusCounts.put("New", newCount);
        formattedStatusCounts.put("Complete", completedCount);
        formattedStatusCounts.put("InWork", inWorkCount);
        formattedStatusCounts.put("Transferred", transferred);
        formattedStatusCounts.put("Refusal", refusedCount);

        return formattedStatusCounts;
    }

    public List<Orders> getOrdersBetweenDatesForIncomeCalculate(LocalDateTime startDate, LocalDateTime endDate){
        return orderRepository.findByAddOrderTimeBetween(startDate, endDate);
    }

    public List<Orders> findByAddOrderTimeBetweenAndNameForIncomeCalculate(LocalDateTime startDate, LocalDateTime endDate, String master){
        return orderRepository.findByAddOrderTimeBetweenAndName(startDate, endDate, master);
    }

    public Map<String, Integer> calculateIncomeByPaymentType(List<Orders> orders){
        Map<String, Integer> income = new HashMap<>();
        int cashPayment = 0;
        int cashlessPayment = 0;
        int employeeProfit = 0;

        for(Orders order: orders){
            if (order.getCity().toLowerCase().equals("краснодар") && (order.getStatus().toLowerCase().equals("выполнено")) || order.getStatus().toLowerCase().equals("в работе")){
                if (order.getStatus().toLowerCase().equals("в работе")){
                    if(order.getApartment() != null && !order.getApartment().isBlank()){
                        if (order.getFormofpayment() != null && !order.getFormofpayment().isBlank() && order.getFormofpayment().toLowerCase().equals("нал/р")){
                            if(order.getColdcounter() != null && !order.getColdcounter().isBlank() && !order.getPricecoldhotcounter().isBlank()){
                                employeeProfit += (Integer.parseInt(order.getColdcounter())) * 130;
                                cashPayment += (Integer.parseInt(order.getPricecoldhotcounter())) * (Integer.parseInt(order.getColdcounter()));
                            }
                            if(order.getHotcounter() != null && !order.getHotcounter().isBlank() && !order.getPricecoldhotcounter().isBlank()){
                                employeeProfit += (Integer.parseInt(order.getHotcounter())) * 130;
                                cashPayment += (Integer.parseInt(order.getPricecoldhotcounter())) * (Integer.parseInt(order.getHotcounter()));
                            }
                            if (order.getHeatmeter() != null && !order.getHeatmeter().isBlank()){
                                employeeProfit += (Integer.parseInt(order.getHeatmeter())) * 500;
                                cashPayment += (Integer.parseInt(order.getHeatmeter())) * 1000;
                            }

                        } else if (order.getFormofpayment() != null && !order.getFormofpayment().isBlank() && order.getFormofpayment().toLowerCase().equals("без/р")) {
                            if(order.getColdcounter() != null && !order.getColdcounter().isBlank() && !order.getPricecoldhotcounter().isBlank()){
                                employeeProfit += (Integer.parseInt(order.getColdcounter())) * 130;
                                cashlessPayment += (Integer.parseInt(order.getPricecoldhotcounter())) * (Integer.parseInt(order.getColdcounter()));
                            }
                            if(order.getHotcounter() != null && !order.getHotcounter().isBlank() && !order.getPricecoldhotcounter().isBlank()){
                                employeeProfit += (Integer.parseInt(order.getHotcounter())) * 130;
                                cashlessPayment += (Integer.parseInt(order.getPricecoldhotcounter())) * (Integer.parseInt(order.getHotcounter()));
                            }
                            if (order.getHeatmeter() != null && !order.getHeatmeter().isBlank()){
                                employeeProfit += (Integer.parseInt(order.getHeatmeter())) * 500;
                                cashlessPayment += (Integer.parseInt(order.getHeatmeter())) * 1000;
                            }
                        }
                    }
                } else if(order.getApartment() != null && !order.getApartment().isBlank()){
                    if (order.getFormofpayment() != null && !order.getFormofpayment().isBlank() && order.getFormofpayment().toLowerCase().equals("нал/р")){
                        if(order.getColdcounter() != null && !order.getColdcounter().isBlank() && !order.getPriceheatmeter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getColdcounter())) * 130;
                        }
                        if(order.getHotcounter() != null && !order.getHotcounter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getHotcounter())) * 130;
                        }
                        if (order.getHeatmeter() != null && !order.getHeatmeter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getHeatmeter())) * 1000; // усновно цена за выполненую работу можно в будущем изменить
                        }

                        cashPayment += (order.getAmount().isBlank() ? 0 : Integer.parseInt(order.getAmount()));

                    } else if (order.getFormofpayment() != null && !order.getFormofpayment().isBlank() && order.getFormofpayment().toLowerCase().equals("без/р")) {
                        if(order.getColdcounter() != null && !order.getColdcounter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getColdcounter())) * 130;
                        }
                        if(order.getHotcounter() != null && !order.getHotcounter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getHotcounter())) * 130;
                        }
                        if (order.getHeatmeter() != null && !order.getHeatmeter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getHeatmeter())) * 1000;
                        }

                        cashlessPayment += (order.getAmount().isBlank() ? 0 : Integer.parseInt(order.getAmount()));
                    }
                } else {
                    if (order.getFormofpayment() != null && !order.getFormofpayment().isBlank() && order.getFormofpayment().toLowerCase().equals("нал/р")){
                        if(order.getColdcounter() != null && !order.getColdcounter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getColdcounter())) * 200;
                        }
                        if(order.getHotcounter() != null && !order.getHotcounter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getHotcounter())) * 200;
                        }

                        cashPayment += (order.getAmount().isBlank() ? 0 : Integer.parseInt(order.getAmount()));

                    } else if (order.getFormofpayment() != null && !order.getFormofpayment().isBlank() && order.getFormofpayment().toLowerCase().equals("без/р")) {
                        if(order.getColdcounter() != null && !order.getColdcounter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getColdcounter())) * 200;
                        }
                        if(order.getHotcounter() != null && !order.getHotcounter().isBlank()){
                            employeeProfit += (Integer.parseInt(order.getHotcounter())) * 200;
                        }

                        cashlessPayment += (order.getAmount().isBlank() ? 0 : Integer.parseInt(order.getAmount()));
                    }
                }

            }
        }

        income.put("CashPayment", cashPayment);
        income.put("CashlessPayment", cashlessPayment);
        income.put("EmployeeProfit", employeeProfit);
        income.put("CompanyIncome", (cashPayment + cashlessPayment));
        income.put("NetProfitOfTheCompany", ((cashPayment + cashlessPayment) - employeeProfit));
        return income;

    }


    public long countByStatus(String status){
        return orderRepository.countByStatus(status);
    }

    public List<Orders> searchByTerm(String searchTerm){
        return orderRepository.searchByTerm(searchTerm);
    }

    public List<Orders> findAllStatusWithOneValue(String status){
        if (status.equals("New")){
            return orderRepository.findAllStatusWithOneValue("Новый");
        } else if(status.equals("InWork")) {
            return orderRepository.findAllStatusWithOneValue("в работе");
        } else if(status.equals("Transferred")) {
            return orderRepository.findAllStatusWithOneValue("перенесен");
        } else {
            return null;
        }
    }

    public List<Orders> findAllStatusWithOneValueAndName(String status, String name){
        if (status.equals("New")){
            return orderRepository.findAllStatusWithOneValueAndName("Новый", name);
        } else if(status.equals("InWork")) {
            return orderRepository.findAllStatusWithOneValueAndName("в работе", name);
        } else if(status.equals("Transferred")) {
            return orderRepository.findAllStatusWithOneValueAndName("перенесен", name);
        } else {
            return null;
        }
    }
}
