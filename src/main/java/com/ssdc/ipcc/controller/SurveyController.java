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
    private List<Object[]> reviewList = new LinkedList<>();
    private String fileName;
    @CrossOrigin
    @PostMapping(path="/review")
    public @ResponseBody
    List<Object[]> reviewSurvey(@RequestParam("file") MultipartFile file) throws IOException {
        reviewList.clear();
        fileName = file.getOriginalFilename();
        String importTime = Util.getCurrentDateTime("yyyy-MM-dd HH:mm:ss");
        InputStream in = file.getInputStream();
        Integer [] notNulls = {1,2,5,6};
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
                return reviewList;
            }
            for(int rowNum=1;rowNum<numOfRows;rowNum++){
                Row row=datatypeSheet.getRow(rowNum);
                int numOfCellPerRow=row.getLastCellNum();
                if (numOfCellPerRow !=7){
                    return reviewList;
                }
                Object[] data = new Object[12];
                data[11]=1;
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
                            data[11]=0;
                        }
                    }
                }
                if (data[3] == null && data[4] == null){
                    data[11]=0;
                }
                data[9] = fileName+"_"+Util.getCurrentDateTime("ddMMyyyy");
                data[10] = importTime;
                reviewList.add(data);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return reviewList;
        }
        return reviewList;
    }
    @CrossOrigin
    @GetMapping(path="/import")
    public @ResponseBody
    Map<String,String> importSurvey()  {
        import_list.clear();
        Map<String,String> iResult = new HashMap<>();
        String errorLog ="";
        Integer numSuccess = 0;
        Integer numFail = 0;
        Integer [] notNulls = {1,2,5,6};
        try{
            for(int i=0;i<reviewList.size();i++){
                Object[] data = reviewList.get(i);
                boolean validate = true;
                for (int j=0; j<notNulls.length;j++){
                    if (data[notNulls[j]] == null){
                        errorLog = errorLog + " -Line "+i + ". Column "+notNulls[j]+" is null.&";
                        validate = false;
                    }
                }
                if (data[3] == null && data[4] == null){
                    errorLog = errorLog + " -Line "+i + ": Phone/Cellphone is empty, fill one.";
                    validate = false;
                }
                if (!validate){
                    numFail++;
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
                    import_list.add(s);
                    data[0] = (Long)data[0] +1;
                    data[3] = data[4];
                    data[8] = (Integer)data[8] +1;
                    Survey s2 = new Survey(data);
                    surveyRepository.save(s2);
                    import_list.add(s2);
                } else {
                    data[7] =maxChainId +1;
                    data[8] =0;
                    if (data[3] == null){
                        data[3] = data[4];
                    }
                    Survey s = new Survey(data);
                    surveyRepository.save(s);
                    import_list.add(s);
                }
                numSuccess++;
            }
        } catch (Exception e) {
            e.printStackTrace();
            StringWriter errors = new StringWriter();
            e.printStackTrace(new PrintWriter(errors));
            iResult.put("pages","0");
            iResult.put("error",errors.toString());
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

    }

    @CrossOrigin
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

    @CrossOrigin
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

    @CrossOrigin
    @GetMapping(path="/all")
    @ResponseBody
    public List<Survey> search(@RequestParam(value = "page") int page ) {
        return Util.PaginationList(import_list,page);
    }

    @CrossOrigin
    @GetMapping(path="/history")
    @ResponseBody
    public List<Object> getImportHistory() {
        return surveyRepository.findImportHistory();
    }

    @CrossOrigin
    @GetMapping(path="/remove")
    @ResponseBody
    public String removeImport(@RequestParam(value = "filename") String filename,
                               @RequestParam(value = "date") String date) {
        List<Long> ids= surveyRepository.findByHisory(filename,date);
        if (!ids.isEmpty()){
            surveyRepository.deleteByIdIn(ids);
            return "Deleted";
        }

        return "Nothing deleted";
    }
}
