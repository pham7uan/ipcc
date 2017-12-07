package com.ssdc.ipcc.view;


import com.ssdc.ipcc.entities.VoiceMail;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.util.CellRangeAddress;
import org.codehaus.jettison.json.JSONObject;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.servlet.view.document.AbstractExcelView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileOutputStream;
import java.util.Map;

public class VoiceMailExcelView extends AbstractExcelView{

    @Override
    protected void buildExcelDocument(Map model, HSSFWorkbook workbook,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        Map<Integer,VoiceMail> revenueData = (Map<Integer,VoiceMail>) model.get("voiceMailData");
        //create a wordsheet
//        FileOutputStream fileOut = new FileOutputStream("result.xlsx");
        HSSFSheet sheet = workbook.createSheet("Voice Mail");
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);

        HSSFRow header = sheet.createRow(0);
        Cell cell0 = header.createCell(0);
        cell0.setCellStyle(style);
        cell0.setCellValue("STT");
        sheet.setColumnWidth(0, 2000);

        Cell cell1 = header.createCell(1);
        cell1.setCellStyle(style);
        cell1.setCellValue("Customer Name");
        sheet.setColumnWidth(1, 7000);

        Cell cell2 = header.createCell(2);
        cell2.setCellStyle(style);
        cell2.setCellValue("Customer Type");
        sheet.setColumnWidth(2, 7000);

        Cell cell3 = header.createCell(3);
        cell3.setCellStyle(style);
        cell3.setCellValue("Phone");
        sheet.setColumnWidth(3, 5000);

        Cell cell4 = header.createCell(4);
        cell4.setCellStyle(style);
        cell4.setCellValue("Date record");
        sheet.setColumnWidth(4, 5000);

        Cell cell5 = header.createCell(5);
        cell5.setCellStyle(style);
        cell5.setCellValue("Brand Call");
        sheet.setColumnWidth(5, 5000);

        Cell cell6 = header.createCell(6);
        cell6.setCellStyle(style);
        cell6.setCellValue("Seen");
        sheet.setColumnWidth(6, 2000);

        Cell cell7 = header.createCell(7);
        cell7.setCellStyle(style);
        cell7.setCellValue("Note");
        sheet.setColumnWidth(7, 7000);

//        header.createCell(1).setCellValue("Customer Name");
//        header.createCell(2).setCellValue("Customer Type");
//        header.createCell(3).setCellValue("Customer Phone");
//        header.createCell(4).setCellValue("Date Record");
//        header.createCell(5).setCellValue("Brand Call");
//        header.createCell(6).setCellValue("Seen");
//        header.createCell(7).setCellValue("Note");

        int rowNum = 1;
        for (int i=0; i< revenueData.size(); i++){
            VoiceMail voicemail = revenueData.get(i);
            HSSFRow row = sheet.createRow(rowNum++);
            Cell c0 = row.createCell(0);
            c0.setCellStyle(style);
            c0.setCellValue(i+1);

            Cell c1 = row.createCell(1);
            c1.setCellStyle(style);
            if (voicemail.getCustomerName()!=null && !voicemail.getCustomerName().isEmpty()){
                c1.setCellValue(voicemail.getCustomerName());
            }

            Cell c2 = row.createCell(2);
            c2.setCellStyle(style);
            if (voicemail.getCustomerType()!=null && !voicemail.getCustomerType().isEmpty()){
                c2.setCellValue(voicemail.getCustomerType());
            }

            Cell c3 = row.createCell(3);
            c3.setCellStyle(style);
            if (voicemail.getCustomerPhone()!=null && !voicemail.getCustomerPhone().isEmpty()){
                c3.setCellValue(voicemail.getCustomerPhone());
            }

            Cell c4 = row.createCell(4);
            c4.setCellStyle(style);
            if (voicemail.getDateRecord()!=null && !voicemail.getDateRecord().isEmpty()){
                c4.setCellValue(voicemail.getDateRecord());
            }

            Cell c5 = row.createCell(5);
            c5.setCellStyle(style);
            if (voicemail.getBranchCall()!=null && !voicemail.getBranchCall().isEmpty()){
                c5.setCellValue(voicemail.getBranchCall());
            }

            Cell c6 = row.createCell(6);
            c6.setCellStyle(style);
            if (voicemail.getStatusAgentSeen()!=null && !voicemail.getStatusAgentSeen().isEmpty()){
                c6.setCellValue(voicemail.getStatusAgentSeen());
            }

            Cell c7 = row.createCell(7);
            c7.setCellStyle(style);
            if (voicemail.getAgentNote()!=null && !voicemail.getAgentNote().isEmpty()){
                c7.setCellValue(voicemail.getAgentNote());
            }


//            row.createCell(0).setCellValue((Integer)revenueData.get(i).get("id"));
//            row.createCell(1).setCellValue((String)revenueData.get(i).get("customer_name"));
//            row.createCell(2).setCellValue((String)revenueData.get(i).get("customer_type"));
//            row.createCell(3).setCellValue((String)revenueData.get(i).get("customer_phone"));
//            row.createCell(4).setCellValue((String)revenueData.get(i).get("date_record"));
//            row.createCell(5).setCellValue((String)revenueData.get(i).get("branch_call"));
//            row.createCell(6).setCellValue((String)revenueData.get(i).get("status_agent_seen"));
//            row.createCell(7).setCellValue((String)revenueData.get(i).get("agent_note"));
        }
//        workbook.write(fileOut);
//        fileOut.flush();
//        fileOut.close();
    }
}