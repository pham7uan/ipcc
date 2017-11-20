package com.ssdc.ipcc.view;

import com.ssdc.ipcc.common.Constants;
import com.ssdc.ipcc.entities.Birthday;
import com.ssdc.ipcc.entities.Survey;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractExcelView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class SurveyExcelView extends AbstractExcelView{

    @Override
    protected void buildExcelDocument(Map model, HSSFWorkbook workbook,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        Map<Integer,Survey> revenueData = (Map<Integer,Survey>) model.get("surveyData");
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


        Cell cell0 = header.createCell(0);
        cell0.setCellStyle(style);
        cell0.setCellValue("STT");
        sheet.addMergedRegion(new CellRangeAddress(0,1,0,0));
        sheet.setColumnWidth(0, 2000);

        Cell cell1 = header.createCell(1);
        cell1.setCellStyle(style);
        cell1.setCellValue("Mã KH");
        sheet.addMergedRegion(new CellRangeAddress(0,1,1,1));
        sheet.setColumnWidth(1, 3000);

        Cell cell2 = header.createCell(2);
        cell2.setCellStyle(style);
        cell2.setCellValue("Họ tên KH");
        sheet.addMergedRegion(new CellRangeAddress(0,1,2,2));
        sheet.setColumnWidth(2, 7000);

        Cell cell3 = header.createCell(3);
        cell3.setCellStyle(style);
        cell3.setCellValue("PHONE");
        sheet.addMergedRegion(new CellRangeAddress(0,1,3,3));
        sheet.setColumnWidth(3, 5000);

        Cell cell4 = header.createCell(4);
        cell4.setCellStyle(style);
        cell4.setCellValue("CELLPHONE");
        sheet.addMergedRegion(new CellRangeAddress(0,1,4,4));
        sheet.setColumnWidth(4, 5000);

        Cell cell5 = header.createCell(5);
        cell5.setCellStyle(style);
        cell5.setCellValue("ACCTNBR");
        sheet.addMergedRegion(new CellRangeAddress(0,1,5,5));
        sheet.setColumnWidth(5, 5000);

        Cell cell6 = header.createCell(6);
        cell6.setCellStyle(style);
        cell6.setCellValue("TEN_CN_THUC_HIEN");
        sheet.addMergedRegion(new CellRangeAddress(0,1,6,6));
        sheet.setColumnWidth(6, 7000);

        Cell cell7 = header.createCell(7);
        cell7.setCellStyle(style);
        cell7.setCellValue("Hài lòng với quy trình");
        sheet.addMergedRegion(new CellRangeAddress(0,0,7,8));


        Cell cell7_1 = header1.createCell(7);
        cell7_1.setCellStyle(style);
        cell7_1.setCellValue("Có");

        Cell cell7_2 = header1.createCell(8);
        cell7_2.setCellStyle(style);
        cell7_2.setCellValue("Không");

        Cell cell9 = header.createCell(9);
        cell9.setCellStyle(style);
        cell9.setCellValue("Hài lòng với thái độ nhân viên");
        sheet.addMergedRegion(new CellRangeAddress(0,0,9,10));


        Cell cell9_1 = header1.createCell(9);
        cell9_1.setCellStyle(style);
        cell9_1.setCellValue("Có");

        Cell cell9_2 = header1.createCell(10);
        cell9_2.setCellStyle(style);
        cell9_2.setCellValue("Không");

        Cell cell11 = header.createCell(11);
        cell11.setCellStyle(style);
        cell11.setCellValue("Chi phí phát sinh");
        sheet.addMergedRegion(new CellRangeAddress(0,0,11,12));


        Cell cell11_1 = header1.createCell(11);
        cell11_1.setCellStyle(style);
        cell11_1.setCellValue("Có");

        Cell cell11_2 = header1.createCell(12);
        cell11_2.setCellStyle(style);
        cell11_2.setCellValue("Không");

        Cell cell13 = header.createCell(13);
        cell13.setCellStyle(style);
        cell13.setCellValue("Ý kiến khác");
        sheet.addMergedRegion(new CellRangeAddress(0,1,13,13));
        sheet.setColumnWidth(13, 7000);

        Cell cell14 = header.createCell(14);
        cell14.setCellStyle(style);
        cell14.setCellValue("Trạng thái cuộc gọi");
        sheet.addMergedRegion(new CellRangeAddress(0,1,14,14));
        sheet.setColumnWidth(14, 7000);

        Cell cell15 = header.createCell(15);
        cell15.setCellStyle(style);
        cell15.setCellValue("Note");
        sheet.addMergedRegion(new CellRangeAddress(0,1,15,15));
        sheet.setColumnWidth(15, 7000);

        int rowNum = 2;
        int stt = 1;
        System.out.println(revenueData.size());
        for (int i=0; i< revenueData.size(); i++){
            HSSFRow row = sheet.createRow(rowNum++);
            Survey survey = revenueData.get(i);

            Cell c4 = row.createCell(4);
            c4.setCellStyle(style);
            if (i<revenueData.size()-1){
                Survey survey2 = revenueData.get(i+1);
                if (survey.getChain_id() == survey2.getChain_id()){
                    c4.setCellValue(survey2.getContact_info());
                    i++;
                }
            }

            Cell c0 = row.createCell(0);
            c0.setCellStyle(style);
            c0.setCellValue(stt);

            Cell c1 = row.createCell(1);
            c1.setCellStyle(style);
            c1.setCellValue(survey.getCustomer_id());

            Cell c2 = row.createCell(2);
            c2.setCellStyle(style);
            c2.setCellValue(survey.getCustomer_name());

            Cell c3 = row.createCell(3);
            c3.setCellStyle(style);
            c3.setCellValue(survey.getContact_info());

//            Cell c4 = row.createCell(4);
//            c4.setCellStyle(style);
//            c4.setCellValue(survey.getContact_info2());

            Cell c5 = row.createCell(5);
            c5.setCellStyle(style);
            c5.setCellValue(survey.getAcctnbr());

            Cell c6 = row.createCell(6);
            c6.setCellStyle(style);
            c6.setCellValue(survey.getTen_cn_thuc_hien());

            Cell c7 = row.createCell(7);
            c7.setCellStyle(style);
            Cell c8 = row.createCell(8);
            c8.setCellStyle(style);
            if ("0" == survey.getSurvey_qn_1()){
                c8.setCellValue("x");
            } else if ("1" == survey.getSurvey_qn_1()){
                c7.setCellValue("x");
            }

            Cell c9 = row.createCell(9);
            c9.setCellStyle(style);
            Cell c10 = row.createCell(10);
            c10.setCellStyle(style);
            if ("0" == survey.getSurvey_qn_2()){
                c10.setCellValue("x");
            } else if ("1" == survey.getSurvey_qn_2()){
                c9.setCellValue("x");
            }

            Cell c11 = row.createCell(11);
            c11.setCellStyle(style);
            Cell c12 = row.createCell(12);
            c12.setCellStyle(style);
            if ("0" == survey.getSurvey_qn_3()){
                c12.setCellValue("x");
            } else if ("1" == survey.getSurvey_qn_3()){
                c11.setCellValue("x");
            }

            Cell c13 = row.createCell(13);
            c13.setCellStyle(style);
            c13.setCellValue(survey.getFeedback());

            Cell c14 = row.createCell(14);
            c14.setCellStyle(style);
            if (survey.getCall_result() > -1){
                String callResult = Constants.call_result.get(survey.getCall_result());
                c14.setCellValue(callResult);
            }

            Cell c15 = row.createCell(15);
            c15.setCellStyle(style);
            c15.setCellValue(survey.getNote());

            stt++;
        }

    }
}
