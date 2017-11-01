package com.ssdc.ipcc.view;


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

        Map<Integer,JSONObject> revenueData = (Map<Integer,JSONObject>) model.get("voiceMailData");
        //create a wordsheet
//        FileOutputStream fileOut = new FileOutputStream("result.xlsx");
        HSSFSheet sheet = workbook.createSheet("Voice Mail");

        HSSFRow header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("Customer Name");
        header.createCell(2).setCellValue("Customer Type");
        header.createCell(3).setCellValue("Customer Phone");
        header.createCell(4).setCellValue("Date Record");
        header.createCell(5).setCellValue("Brand Call");
        header.createCell(6).setCellValue("Seen");
        header.createCell(7).setCellValue("Note");

        int rowNum = 1;
        for (int i=0; i< revenueData.size(); i++){
            HSSFRow row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue((Integer)revenueData.get(i).get("id"));
            row.createCell(1).setCellValue((String)revenueData.get(i).get("customer_name"));
            row.createCell(2).setCellValue((String)revenueData.get(i).get("customer_type"));
            row.createCell(3).setCellValue((String)revenueData.get(i).get("customer_phone"));
            row.createCell(4).setCellValue((String)revenueData.get(i).get("date_record"));
            row.createCell(5).setCellValue((String)revenueData.get(i).get("branch_call"));
            row.createCell(6).setCellValue((String)revenueData.get(i).get("status_agent_seen"));
            row.createCell(7).setCellValue((String)revenueData.get(i).get("agent_note"));
        }
//        workbook.write(fileOut);
//        fileOut.flush();
//        fileOut.close();
    }
}