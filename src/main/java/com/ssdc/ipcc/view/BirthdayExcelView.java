package com.ssdc.ipcc.view;

import com.ssdc.ipcc.entities.Birthday;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.servlet.view.document.AbstractExcelView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class BirthdayExcelView extends AbstractExcelView{

    @Override
    protected void buildExcelDocument(Map model, HSSFWorkbook workbook,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        Map<Integer,Birthday> revenueData = (Map<Integer,Birthday>) model.get("birthdayData");
        HSSFSheet sheet = workbook.createSheet("Birthday campaign");

        HSSFRow header = sheet.createRow(0);
        HSSFRow header1 = sheet.createRow(1);
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);

//        CellStyle style = workbook.createCellStyle();
//        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
//        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
//        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
//        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
//        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
//        style.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
//        style.setFillPattern(CellStyle.BIG_SPOTS);

//        CellStyle style = workbook.createCellStyle();
//        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
//        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
//        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
//        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
//        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
//        style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
//        style.setFillPattern(CellStyle.BIG_SPOTS);

        Cell cell0 = header.createCell(0);
        cell0.setCellStyle(style);
        cell0.setCellValue("STT");
        sheet.addMergedRegion(new CellRangeAddress(0,1,0,0));
        sheet.setColumnWidth(0, 2000);

        Cell cell1 = header.createCell(1);
        cell1.setCellStyle(style);
        cell1.setCellValue("Đơn vị");
        sheet.addMergedRegion(new CellRangeAddress(0,1,1,1));
        sheet.setColumnWidth(1, 7000);

        Cell cell2 = header.createCell(2);
        cell2.setCellStyle(style);
        cell2.setCellValue("Họ tên khách hàng");
        sheet.addMergedRegion(new CellRangeAddress(0,1,2,2));
        sheet.setColumnWidth(2, 7000);

        Cell cell3 = header.createCell(3);
        cell3.setCellStyle(style);
        cell3.setCellValue("Đối tượng khách hàng");
        sheet.addMergedRegion(new CellRangeAddress(0,0,3,4));

        Cell cell3_1 = header1.createCell(3);
        cell3_1.setCellStyle(style);
        cell3_1.setCellValue("KHUT");

        Cell cell3_2 = header1.createCell(4);
        cell3_2.setCellStyle(style);
        cell3_2.setCellValue("HV Blue Diamond");
        sheet.setColumnWidth(4, 4000);

        Cell cell5 = header.createCell(5);
        cell5.setCellStyle(style);
        cell5.setCellValue("Loại quà");
        sheet.addMergedRegion(new CellRangeAddress(0,0,5,6));

        Cell cell5_1 = header1.createCell(5);
        cell5_1.setCellStyle(style);
        cell5_1.setCellValue("Hoa");

        Cell cell5_2 = header1.createCell(6);
        cell5_2.setCellStyle(style);
        cell5_2.setCellValue("Bánh kem");

        Cell cell7 = header.createCell(7);
        cell7.setCellStyle(style);
        cell7.setCellValue("NV Quản lý KH");
        sheet.addMergedRegion(new CellRangeAddress(0,1,7,7));
        sheet.setColumnWidth(7, 7000);

        Cell cell8 = header.createCell(8);
        cell8.setCellStyle(style);
        cell8.setCellValue("Xác nhận việc nhận quà");
        sheet.addMergedRegion(new CellRangeAddress(0,0,8,10));

        Cell cell8_1 = header1.createCell(8);
        cell8_1.setCellStyle(style);
        cell8_1.setCellValue("Đã nhận");

        Cell cell8_2 = header1.createCell(9);
        cell8_2.setCellStyle(style);
        cell8_2.setCellValue("Chưa nhận");
        sheet.setColumnWidth(9, 3000);

        Cell cell8_3 = header1.createCell(10);
        cell8_3.setCellStyle(style);
        cell8_3.setCellValue("Khác");

        Cell cell11 = header.createCell(11);
        cell11.setCellStyle(style);
        cell11.setCellValue("Người giao quà");
        sheet.addMergedRegion(new CellRangeAddress(0,0,11,13));


        Cell cell11_1 = header1.createCell(11);
        cell11_1.setCellStyle(style);
        cell11_1.setCellValue("NV ACB");

        Cell cell11_2 = header1.createCell(12);
        cell11_2.setCellStyle(style);
        cell11_2.setCellValue("Không phải NV ACB");
        sheet.setColumnWidth(12, 4500);

        Cell cell11_3 = header1.createCell(13);
        cell11_3.setCellStyle(style);
        cell11_3.setCellValue("Khác");

        Cell cell14 = header.createCell(14);
        cell14.setCellStyle(style);
        cell14.setCellValue("Ghi nhận sự hài lòng,\n không hài lòng và các ý kiến khác của KH");
        sheet.addMergedRegion(new CellRangeAddress(0,1,14,14));
        sheet.setColumnWidth(14, 9100);

        int rowNum = 2;
        System.out.println(revenueData.size());
        for (int i=0; i< revenueData.size(); i++){
            Birthday birthday = revenueData.get(i);
            if (i>0){
                Birthday birthday2 = revenueData.get(i-1);
                if (birthday.getChainid() == birthday2.getChainid()){
                    continue;
                }
            }
            HSSFRow row = sheet.createRow(rowNum++);


            Cell c0 = row.createCell(0);
            c0.setCellStyle(style);
            c0.setCellValue(i+1);

            Cell c1 = row.createCell(1);
            c1.setCellStyle(style);
            c1.setCellValue(birthday.getBusinessUnit());

            Cell c2 = row.createCell(2);
            c2.setCellStyle(style);
            c2.setCellValue(birthday.getCustomerName());

            Cell c3 = row.createCell(3);
            c3.setCellStyle(style);
            Cell c4 = row.createCell(4);
            c4.setCellStyle(style);
            if (birthday.getCustomerSegment() !=null && !birthday.getCustomerSegment().isEmpty()){
                if ("KHUT" == birthday.getCustomerSegment()){
                    c3.setCellValue(birthday.getCustomerSegment());
                } else {
                    c4.setCellValue(birthday.getCustomerSegment());
                }
            }

            Cell c5 = row.createCell(5);
            c5.setCellStyle(style);
            Cell c6 = row.createCell(6);
            c6.setCellStyle(style);
            if (birthday.getGift() !=null && !birthday.getGift().isEmpty()){
                if ("Hoa"==birthday.getGift()){
                    c5.setCellValue("x");
                } else {
                    c6.setCellValue("x");
                }
            }


            Cell c7 = row.createCell(7);
            c7.setCellStyle(style);
            c7.setCellValue(birthday.getManagerName());

            Cell c8 = row.createCell(8);
            c8.setCellStyle(style);
            Cell c9 = row.createCell(9);
            c9.setCellStyle(style);
            Cell c10 = row.createCell(10);
            c10.setCellStyle(style);
            if (birthday.getLoyaltyQn1() !=null && !birthday.getLoyaltyQn1().isEmpty()){
                switch (birthday.getLoyaltyQn1()){
                    case "0": c8.setCellValue("x");
                        break;
                    case "1": c9.setCellValue("x");
                        break;
                    default: c10.setCellValue("x");
                        break;
                }
            }


            Cell c11 = row.createCell(11);
            c11.setCellStyle(style);
            Cell c12 = row.createCell(12);
            c12.setCellStyle(style);
            Cell c13 = row.createCell(13);
            c13.setCellStyle(style);
            if (birthday.getShiperName() !=null && !birthday.getShiperName().isEmpty()){
                switch (birthday.getShiperName()){
                    case "0": c11.setCellValue("x");
                        break;
                    case "1": c12.setCellValue("x");
                        break;
                    default: c13.setCellValue("x");
                        break;
                }
            }


            Cell c14 = row.createCell(14);
            c14.setCellStyle(style);
            c14.setCellValue(birthday.getFeedback());
        }

    }
}
