package com.ssdc.ipcc.controller;

import com.ssdc.ipcc.common.Util;
import com.ssdc.ipcc.entities.Birthday;
import com.ssdc.ipcc.entities.BirthdayRepository;
import com.ssdc.ipcc.view.BirthdayExcelView;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.codehaus.jettison.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.util.*;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toMap;


@Controller    // This means that this class is a Controller
@RequestMapping(path="/api/birthday") // This means URL's start with /demo (after Application path)
public class BirthdayController {
    @Value("${voice_mail_host}")
    private String host;
    @Value("${server.port}")
    private String port;
    @Value("${app_name}")
    private String app_name;
    @Autowired // This means to get the bean called userRepository
    // Which is auto-generated by Spring, we will use it to handle the data
    private BirthdayRepository birthdayRepository;
    private List<Birthday> import_list = new LinkedList<>();
    private List<Object[]> reviewList = new LinkedList<>();
    private String fileName;
    @CrossOrigin
    @PostMapping(path="/review")
    public @ResponseBody
    List<Object[]> reviewBirthday(@RequestParam("file") MultipartFile file) throws IOException {
        reviewList.clear();
        Integer [] notNulls = {1,2,3,6,7,12};
        ArrayList<Integer> notNullList = new ArrayList<Integer>(Arrays.asList(notNulls));
        fileName = file.getOriginalFilename();
        String importTime = Util.getCurrentDateTime("yyyy-MM-dd HH:mm:ss");
//        String FILE_NAME = "BirthdayCampaignForm.xlsx";
        try{
            InputStream in = file.getInputStream();
//            FileInputStream excelFile = new FileInputStream(new File(FILE_NAME));
            Workbook workbook = new XSSFWorkbook(in);
            Sheet datatypeSheet = workbook.getSheetAt(0);
            int numOfRows=datatypeSheet.getPhysicalNumberOfRows();
            if (numOfRows < 3){
                return null;
            }
            for(int rowNum=2;rowNum<numOfRows;rowNum++){
                Row row=datatypeSheet.getRow(rowNum);
                int numOfCellPerRow=row.getLastCellNum();
                if (numOfCellPerRow !=13){
                    return null;
                }
                Object[] data = new Object[18];
                data[17] = 1;
                boolean validate = true;
                for(int cellNum=0;cellNum<numOfCellPerRow;cellNum++){
                    Cell currentCell=row.getCell(cellNum);
                    if (currentCell != null){
                        if (currentCell.getCellType() == currentCell.CELL_TYPE_STRING) {
                            if (cellNum == 6 || cellNum==7){
                                data[cellNum] = Integer.parseInt(currentCell.getStringCellValue());
                            } else {
                                data[cellNum] = currentCell.getStringCellValue();
                            }
                        } else if (currentCell.getCellType() == currentCell.CELL_TYPE_NUMERIC) {
                            if (cellNum == 2 || cellNum ==4 || cellNum ==5){
                                data[cellNum] = Integer.toString((int)currentCell.getNumericCellValue());
                            } else {
                                data[cellNum] = (int)currentCell.getNumericCellValue();
                            }
                        }

                    } else {
                        if (notNullList.contains(cellNum)){
                            data[17]=0;
                        }
                    }
                }

                if (data[4] == null && data[5] == null){
                    data[17]=0;
                }
                data[15] = fileName+"_"+Util.getCurrentDateTime("ddMMyyyy");
                data[16] = importTime;

                reviewList.add(data);

            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return reviewList;
    }
    @CrossOrigin
    @GetMapping(path="/import")
    public @ResponseBody
    Map<String,String> importBirthday() throws IOException, JSONException {
        import_list.clear();
        Map<String,String> iResult = new HashMap<>();

        String log = "Import result\n";
        String errorLog ="";
        Integer numSuccess = 0;
        Integer numFail = 0;
        Integer total =reviewList.size();
        Integer [] notNulls = {1,2,3,6,7,12};
//        ArrayList<Integer> notNullList = new ArrayList<Integer>(Arrays.asList(notNulls));
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

                if (data[4] == null && data[5] == null){
                    errorLog = errorLog + " -Line "+i + ": Phone number is empty";
                    validate = false;
                }

                if (!validate){
                    numFail++;
                    continue;
                }
                int maxChainId = birthdayRepository.getMaxChaniId();
                long record_id = birthdayRepository.getMaxRecordId() + 1;
                data[0] =  record_id;

                if (data[8] == null){
                    data[8] = data[9];
                }

                if (data[10] == null){
                    data[10] = "Banh kem";
                } else {
                    data[10] = "Hoa";
                }


                if (data[4] != null && data[5] != null){
                    data[13] =maxChainId +1;
                    data[14] =0;
                    Birthday s = new Birthday(data);
                    birthdayRepository.save(s);
                    import_list.add(s);
                    data[0] = (Long)data[0] +1;
                    data[4] = data[5];
                    data[14] = (Integer)data[14] +1;
                    Birthday s2 = new Birthday(data);
                    birthdayRepository.save(s2);
                    import_list.add(s2);
                } else {
                    data[13] =maxChainId +1;
                    data[14] =0;
                    if (data[4] == null){
                        data[4] = data[5];
                    }
                    Birthday s = new Birthday(data);
                    birthdayRepository.save(s);
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

//        log = log + "- Import success "+numSuccess+"/"+total+".\n";
//        log = log + " -Import fail "+numFail+"/"+total+".\n";
//        if (numFail>0){
//            log = log + errorLog;
//        }
        int numPage = Util.getNumPage(import_list);
        iResult.put("pages",Integer.toString(numPage));
        iResult.put("error",errorLog);
        iResult.put("success",Integer.toString(numSuccess));
        iResult.put("fail",Integer.toString(numFail));
        return iResult;
    }
    @CrossOrigin
    @GetMapping(path="/export")
    public @ResponseBody
    ModelAndView getResult (HttpServletRequest request, HttpServletResponse response) {
        Map<Integer,Birthday> birthdayData = new HashMap<Integer,Birthday>();
        Iterable<Birthday> birthdays = birthdayRepository.findAll();
        int stt =0;
        for (Birthday b:birthdays){
            birthdayData.put(stt,b);
            stt++;
        }

        response.setContentType( "application/ms-excel" );
        response.setHeader( "Content-disposition", "attachment; filename=BirthdayCampaign.xls" );
        return new ModelAndView(new BirthdayExcelView(),"birthdayData",birthdayData);
    }
    @CrossOrigin
    @GetMapping(path="/form") // Map ONLY GET Requests
    public void getDownload(HttpServletResponse response) throws IOException {
        String url ="";
        if (app_name.isEmpty() || app_name == null){
            url = "http://localhost:" + port +"/birthday_form.xlsx";
        } else {
            url = "http://localhost:" + port +"/"+app_name+"/birthday_form.xlsx";
        }

        InputStream input = new URL(url).openStream();
        response.addHeader("Content-disposition", "attachment;filename=BirthdayCampaignForm.xlsx");
        response.setContentType("application/ms-excel");

        // Copy the stream to the response's output stream.
        IOUtils.copy(input, response.getOutputStream());
        response.flushBuffer();
    }
    @CrossOrigin
    @GetMapping(path="/all")
    @ResponseBody
    public List<Birthday> search(@RequestParam(value = "page") int page ) {
        return Util.PaginationList(import_list,page);
    }

    @CrossOrigin
    @GetMapping(path="/history")
    @ResponseBody
    public List<Object> getImportHistory() {
        return birthdayRepository.findImportHistory();
    }

    @CrossOrigin
    @GetMapping(path="/remove")
    @ResponseBody
    public String removeImport(@RequestParam(value = "filename") String filename,
                                   @RequestParam(value = "date") String date) {
        List<Long> ids= birthdayRepository.findByHisory(filename,date);
        if (!ids.isEmpty()){
            birthdayRepository.deleteByIdIn(ids);
            return "Deleted";
        }

        return "Nothing deleted";
    }
}
