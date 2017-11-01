package com.ssdc.ipcc.common;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;


public class Util {
    public static String getCurrentDateTime(){
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
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
}
