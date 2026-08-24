package com.ohotech.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.ohotech.backend.entity.Order;
import com.ohotech.backend.entity.OrderItem;
import com.ohotech.backend.entity.Payment;
import com.ohotech.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfInvoiceService {

    private final PaymentRepository paymentRepository;

    public byte[] generateInvoicePdf(Order order) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, baos);

            document.open();

            // Colors
            Color primaryColor = new Color(13, 13, 14); // #0d0d0e
            Color accentColor = new Color(2, 132, 199);  // #0284c7 (Sky-600)
            Color borderColor = new Color(226, 232, 240); // Slate-200

            // Fonts
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, primaryColor);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, accentColor);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, primaryColor);
            Font regularFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);

            // 1. Company Header Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.addElement(new Paragraph("OHO TECHN", headerFont));
            leftCell.addElement(new Paragraph("Turnkey Enterprise Software & Cloud Solutions", subHeaderFont));
            leftCell.addElement(new Paragraph("Email: support@ohotech.com | Website: https://ohotech.com", subHeaderFont));

            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph invTitle = new Paragraph("TAX INVOICE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, accentColor));
            invTitle.setAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(invTitle);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
            String orderDateStr = order.getCreatedAt() != null ? order.getCreatedAt().format(formatter) : new Date().toString();
            
            Paragraph invMeta = new Paragraph("Invoice #: INV-" + order.getId() + "\nOrder #: ORD-" + order.getId() + "\nDate: " + orderDateStr, regularFont);
            invMeta.setAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(invMeta);

            headerTable.addCell(leftCell);
            headerTable.addCell(rightCell);
            document.add(headerTable);

            document.add(new Paragraph(" "));

            // Divider Line
            Paragraph divider = new Paragraph("_______________________________________________________________________________", 
                    FontFactory.getFont(FontFactory.HELVETICA, 10, borderColor));
            document.add(divider);
            document.add(new Paragraph(" "));

            // 2. Customer & Billing Details
            PdfPTable customerTable = new PdfPTable(2);
            customerTable.setWidthPercentage(100);
            customerTable.setWidths(new float[]{50, 50});

            PdfPCell custCell = new PdfPCell();
            custCell.setBorder(Rectangle.NO_BORDER);
            custCell.addElement(new Paragraph("CUSTOMER DETAILS", sectionTitleFont));
            custCell.addElement(new Paragraph("Name: " + (order.getUser() != null ? order.getUser().getName() : "N/A"), boldFont));
            custCell.addElement(new Paragraph("Email: " + (order.getUser() != null ? order.getUser().getEmail() : "N/A"), regularFont));
            custCell.addElement(new Paragraph("Phone: " + (order.getContactPhone() != null ? order.getContactPhone() : "N/A"), regularFont));

            PdfPCell shipCell = new PdfPCell();
            shipCell.setBorder(Rectangle.NO_BORDER);
            shipCell.addElement(new Paragraph("SHIPPING & FULFILLMENT", sectionTitleFont));
            shipCell.addElement(new Paragraph("Address: " + (order.getShippingAddress() != null ? order.getShippingAddress() : "Digital Fulfillment"), regularFont));
            shipCell.addElement(new Paragraph("Order Status: " + order.getStatus().name(), boldFont));

            customerTable.addCell(custCell);
            customerTable.addCell(shipCell);
            document.add(customerTable);

            document.add(new Paragraph(" "));

            // 3. Line Items Table
            PdfPTable itemsTable = new PdfPTable(4);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{45, 15, 20, 20});

            // Table Headers
            String[] headers = {"PRODUCT / SERVICE ITEM", "QTY", "UNIT PRICE (INR)", "LINE TOTAL (INR)"};
            for (String headerText : headers) {
                PdfPCell cell = new PdfPCell(new Paragraph(headerText, tableHeaderFont));
                cell.setBackgroundColor(primaryColor);
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                itemsTable.addCell(cell);
            }

            // Table Rows
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    String productName = item.getProduct() != null ? item.getProduct().getName() : "Software Module";
                    BigDecimal lineTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

                    PdfPCell pCell = new PdfPCell(new Paragraph(productName, regularFont));
                    pCell.setPadding(6);
                    itemsTable.addCell(pCell);

                    PdfPCell qCell = new PdfPCell(new Paragraph(String.valueOf(item.getQuantity()), regularFont));
                    qCell.setPadding(6);
                    qCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemsTable.addCell(qCell);

                    PdfPCell upCell = new PdfPCell(new Paragraph("INR " + item.getPrice().toString(), regularFont));
                    upCell.setPadding(6);
                    upCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemsTable.addCell(upCell);

                    PdfPCell ltCell = new PdfPCell(new Paragraph("INR " + lineTotal.toString(), boldFont));
                    ltCell.setPadding(6);
                    ltCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemsTable.addCell(ltCell);
                }
            }

            document.add(itemsTable);

            document.add(new Paragraph(" "));

            // 4. Summary & Payment Status
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{60, 40});

            Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);

            PdfPCell payCell = new PdfPCell();
            payCell.setBorder(Rectangle.NO_BORDER);
            payCell.addElement(new Paragraph("PAYMENT INFORMATION", sectionTitleFont));
            if (payment != null) {
                payCell.addElement(new Paragraph("Payment ID: " + (payment.getRazorpayPaymentId() != null ? payment.getRazorpayPaymentId() : "N/A"), regularFont));
                payCell.addElement(new Paragraph("Gateway Order ID: " + (payment.getRazorpayOrderId() != null ? payment.getRazorpayOrderId() : "N/A"), regularFont));
                payCell.addElement(new Paragraph("Payment Status: " + payment.getStatus().name(), boldFont));
            } else {
                payCell.addElement(new Paragraph("Payment Status: PENDING", boldFont));
            }

            PdfPCell totalCell = new PdfPCell();
            totalCell.setBorder(Rectangle.NO_BORDER);
            totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            Paragraph subtotalP = new Paragraph("Subtotal: INR " + order.getTotalAmount(), regularFont);
            subtotalP.setAlignment(Element.ALIGN_RIGHT);
            totalCell.addElement(subtotalP);

            Paragraph totalP = new Paragraph("Grand Total: INR " + order.getTotalAmount(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, primaryColor));
            totalP.setAlignment(Element.ALIGN_RIGHT);
            totalCell.addElement(totalP);

            summaryTable.addCell(payCell);
            summaryTable.addCell(totalCell);
            document.add(summaryTable);

            document.add(new Paragraph(" "));
            document.add(divider);
            
            // Footer Notice
            Paragraph footer = new Paragraph("This is a computer-generated tax invoice issued by OHO TECHN. No physical signature is required.", 
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            log.info("Generated PDF invoice for order #{}", order.getId());
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF invoice for order #{}: {}", order.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF invoice: " + e.getMessage(), e);
        }
    }
}
