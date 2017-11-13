package com.ssdc.ipcc.controller;

import com.ssdc.ipcc.entities.Birthday;
import com.ssdc.ipcc.entities.BirthdayRepository;
import com.ssdc.ipcc.entities.Survey;
import com.ssdc.ipcc.entities.SurveyRepository;
import com.ssdc.ipcc.view.BirthdayExcelView;
import com.ssdc.ipcc.view.MyExcelView;
import com.ssdc.ipcc.common.Util;

import com.ssdc.ipcc.view.SurveyExcelView;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.codehaus.jettison.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.sql.SQLException;
import java.util.*;

@Controller
@RequestMapping(path="/api/survey")
public class SurveyController {
    @Value("${voice_mail_host}")
    private String host;
    @Value("${server.port}")
    private String port;
    @Value("${app_name}")
    private String app_name;
    @Autowired
    private SurveyRepository surveyRepository;
    private List<Survey> import_list = new LinkedList<>();
    @PostMapping(path="/import")
    public @ResponseBody
    Map<String,String> importSurvey(@RequestParam("file") MultipartFile file) throws IOException, JSONException {
        import_list.clear();
        Map<String,String> iResult = new HashMap<>();
        InputStream in = file.getInputStream();
        String errorLog ="";
        String log_form_err = "Import fail. Your excel file is not correct form.\nYou can get form by click Get form import";
        Integer numSuccess = 0;
        Integer numFail = 0;
        Integer total =0;
        Integer [] notNulls = {1,2,3,5,6};
        Integer [] strings = {1,3,4,5};
        ArrayList<Integer> notNullList = new ArrayList<Integer>(Arrays.asList(notNulls));
        ArrayList<Integer> stringsList = new ArrayList<Integer>(Arrays.asList(strings));
//        String FILE_NAME = "survey_form.xlsx";
        try{
//            FileInputStream excelFile = new FileInputStream(new File(FILE_NAME));
            Workbook workbook = new XSSFWorkbook(in);
            Sheet datatypeSheet = workbook.getSheetAt(0);
            int numOfRows=datatypeSheet.getPhysicalNumberOfRows();
            if (numOfRows < 2){
                iResult.put("pages","0");
                iResult.put("error",log_form_err);
                iResult.put("success","0");
                iResult.put("fail","0");
                return iResult;
            }
            total = numOfRows -1;
            for(int rowNum=1;rowNum<numOfRows;rowNum++){
                Row row=datatypeSheet.getRow(rowNum);
                int numOfCellPerRow=row.getLastCellNum();
                if (numOfCellPerRow !=7){
                    iResult.put("pages","0");
                    iResult.put("error",log_form_err);
                    iResult.put("success","0");
                    iResult.put("fail","0");
                    return iResult;
                }
                Object[] data = new Object[9];
                boolean validate = true;
                for(int cellNum=0;cellNum<numOfCellPerRow;cellNum++){
                    Cell currentCell=row.getCell(cellNum);
                    if (currentCell != null){
                        if (currentCell.getCellType() == currentCell.CELL_TYPE_STRING) {
                            data[cellNum] = currentCell.getStringCellValue();
                        } else if (currentCell.getCellType() == currentCell.CELL_TYPE_NUMERIC) {
                            if (stringsList.contains(cellNum)){
                                data[cellNum] = Integer.toString((int)currentCell.getNumericCellValue());
                            } else {
                                data[cellNum] = (int)currentCell.getNumericCellValue();
                            }
                        }

                    } else {
                        if (notNullList.contains(cellNum)){
                            errorLog = errorLog + " -Line "+rowNum + ". Column "+cellNum+" is null.&";
                            validate = false;
                            numFail++;
                            break;
                        }
                    }
                }

                if (!validate){
                    System.out.println(errorLog);
                    continue;
                }
                int maxChainId = surveyRepository.getMaxChaniId();
                long record_id = surveyRepository.getMaxRecordId() + 1;
                data[0] =  record_id;

                if (data[3] != null && data[4] != null){
                    data[7] =maxChainId +1;
                    data[8] =0;
                    Survey s = new Survey(data);
                    surveyRepository.save(s);
                    data[0] = (Long)data[0] +1;
                    data[3] = data[4];
                    data[8] = (Integer)data[8] +1;
                    Survey s2 = new Survey(data);
                    surveyRepository.save(s2);
                } else {
                    data[7] =maxChainId +1;
                    data[8] =0;
                    Survey s = new Survey(data);
                    surveyRepository.save(s);
                }
                Survey b = surveyRepository.findOne(record_id);
                import_list.add(b);
                numSuccess++;
            }
        } catch (Exception e) {
            e.printStackTrace();
            iResult.put("pages","0");
            iResult.put("error",log_form_err);
            iResult.put("success","0");
            iResult.put("fail","0");
            return iResult;
        }

        int numPage = Util.getNumPage(import_list);
        iResult.put("pages",Integer.toString(numPage));
        iResult.put("error",errorLog);
        iResult.put("success",Integer.toString(numSuccess));
        iResult.put("fail",Integer.toString(numFail));
        return iResult;
//        return log;
    }

    @GetMapping(path="/export") // Map ONLY GET Requests
    public @ResponseBody
    ModelAndView getResult (HttpServletRequest request, HttpServletResponse response) {
        Map<Integer,Survey> surveyData = new HashMap<Integer,Survey>();
        Iterable<Survey> surveys = surveyRepository.findAll();
        int stt =0;
        for (Survey b:surveys){
            surveyData.put(stt,b);
            stt++;
        }

        response.setContentType( "application/ms-excel" );
        response.setHeader( "Content-disposition", "attachment; filename=SurveyCampaign.xls" );
        return new ModelAndView(new SurveyExcelView(),"surveyData",surveyData);
    }

    @GetMapping(path="/form") // Map ONLY GET Requests
    public void getDownload(HttpServletResponse response) throws IOException {

        String url = "http://localhost:" + port +"/"+app_name+"/survey_form.xlsx";
        InputStream input = new URL(url).openStream();
        response.addHeader("Content-disposition", "attachment;filename=SurveyCampaignForm.xlsx");
        response.setContentType("application/ms-excel");

        // Copy the stream to the response's output stream.
        IOUtils.copy(input, response.getOutputStream());
        response.flushBuffer();
    }

    @GetMapping(path="/all")
    @ResponseBody
    public List<Survey> search(@RequestParam(value = "page") int page ) {
        return Util.PaginationList(import_list,page);
    }
}
