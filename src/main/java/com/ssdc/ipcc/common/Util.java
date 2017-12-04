package com.ssdc.ipcc.common;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.codehaus.jettison.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;


public class Util {
    public static String getCurrentDateTime(String pattern){
        DateFormat dateFormat = new SimpleDateFormat(pattern);
        dateFormat.setTimeZone(TimeZone.getTimeZone("Asia/Saigon"));
        Date date = new Date();
        return  dateFormat.format(date);
    }

    public static Sheet readExcel(){
        String FILE_NAME = "survey.xlsx";
            try {
                FileInputStream excelFile = new FileInputStream(new File(FILE_NAME));
                Workbook workbook = new XSSFWorkbook(excelFile);
                Sheet datatypeSheet = workbook.getSheetAt(0);
//                Iterator<Row> iterator = datatypeSheet.iterator();

//                while (iterator.hasNext()) {
//
//                    Row currentRow = iterator.next();
//                    Iterator<Cell> cellIterator = currentRow.iterator();
//
//                    while (cellIterator.hasNext()) {
//
//                        Cell currentCell = cellIterator.next();
//                        if (currentCell.getCellTypeEnum() == CellType.STRING) {
//                            System.out.print(currentCell.getStringCellValue() + "--");
//                        } else if (currentCell.getCellTypeEnum() == CellType.NUMERIC) {
//                            System.out.print(currentCell.getNumericCellValue() + "--");
//                        }
//
//                    }
//                    System.out.println();
//
//                }
                return  datatypeSheet;
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        return null;
    }

    public static <T> List<T> PaginationList(List<T> list,int page){
        List<T> p;
        int size =7;
        int numPage= getNumPage(list);
        if (page <0 || page>numPage){
            return null;
        }

        if (list.size() >size){
            if (page==1){
                p = list.subList(0,size);
                return p;
            } else if(page<numPage){
                p = list.subList(page*size - size,page*size);
                return p;
            } else if(page==numPage){
                p=list.subList(page*size -size,list.size());
                return p;
            }
        } else {
            return list;
        }
        return list;
    }

    public static <T> int getNumPage(List<T> list){
        int size =7;
        int numPage=0;
        if (list.size()%size > 0){
            numPage = list.size()/size +1;
        } else  {
            numPage = list.size()/size;
        }
        return numPage;
    }
}
