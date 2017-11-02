package com.ssdc.ipcc.controller;

import com.ssdc.ipcc.entities.Survey;
import com.ssdc.ipcc.entities.SurveyRepository;
import com.ssdc.ipcc.view.MyExcelView;
import com.ssdc.ipcc.common.Util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Controller    // This means that this class is a Controller
@RequestMapping(path="/api/survey")
public class SurveyController {
    @Autowired
    private SurveyRepository surveyRepository;

    @GetMapping(path="/import") // Map ONLY GET Requests
    public @ResponseBody
    String importSurvey() {
        String FILE_NAME = "survey.xlsx";
        try{
            FileInputStream excelFile = new FileInputStream(new File(FILE_NAME));
            Workbook workbook = new XSSFWorkbook(excelFile);
            Sheet datatypeSheet = workbook.getSheetAt(0);
            Iterator<Row> iterator = datatypeSheet.iterator();
            int row = 0;
            while (iterator.hasNext()) {
                Row currentRow = iterator.next();
                Iterator<Cell> cellIterator = currentRow.iterator();
                if (row >0){
                    int col = 0;
                    Object[] data = new Object[9];
                    while (cellIterator.hasNext()) {
                        if (col < 6) {//number column need to import
                            Cell currentCell = cellIterator.next();
                            if (currentCell.getCellTypeEnum() == CellType.STRING) {
                                data[col] = currentCell.getStringCellValue();
                            } else if (currentCell.getCellTypeEnum() == CellType.NUMERIC) {
                                if (col == 1 || col ==3 || col ==4){
                                    data[col] = Integer.toString((int)currentCell.getNumericCellValue());
                                } else {
                                    data[col] = (int)currentCell.getNumericCellValue();
                                }
                            }
                        }
                        col ++;
                    }
//                    List<Survey> existRecords = surveyRepository.findByCustomer_id((String)data[1]);
//                    if (existRecords.size() > 0){
//                        data[6] = 1;
//                        data[7] = existRecords.size();
//                    }
                    data[6] =1;
                    data[7] =0;
                    data[8] = Util.getCurrentDateTime();
                    Survey s = new Survey(data);
                    surveyRepository.save(s);
                }
                row++;
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "imported";
    }

    @GetMapping(path = "/export")
    public ModelAndView getMyData(HttpServletRequest request, HttpServletResponse response) throws SQLException {

        Map<String,String> revenueData = new HashMap<String,String>();
        revenueData.put("Jan-2010", "$100,000,000");
        revenueData.put("Feb-2010", "$110,000,000");
        revenueData.put("Mar-2010", "$130,000,000");
        revenueData.put("Apr-2010", "$140,000,000");
        revenueData.put("May-2010", "$200,000,000");
        response.setContentType( "application/ms-excel" );
        response.setHeader( "Content-disposition", "attachment; filename=myfile.xls" );
        return new ModelAndView(new MyExcelView(),"revenueData",revenueData);
    }


    @GetMapping(path="/all")
    @ResponseBody
    public Iterable<Survey> search() {
        return surveyRepository.findAll();
    }
}
