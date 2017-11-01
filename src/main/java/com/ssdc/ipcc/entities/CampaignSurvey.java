package com.ssdc.ipcc.entities;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "campaign_survey")
public class CampaignSurvey {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private int stt;
    private String customer_id;
    private String customer_name;
    private String cell_phone;
    private String acctrbn;
    private String ten_cn_thuc_hien;
    private int chain_id;
    private int chain_n;
    private String import_time;

    public CampaignSurvey() {
    }

    public CampaignSurvey(int stt,String customer_name, String customer_id, String cell_phone,String acctrbn,
                     String ten_cn_thuc_hien,int  chain_id, int chain_n, String import_time) {
        this.customer_name = customer_name;
        this.stt = stt;
        this.customer_id = customer_id;
        this.cell_phone= cell_phone;
        this.acctrbn = acctrbn;
        this.ten_cn_thuc_hien= ten_cn_thuc_hien;
        this.chain_id= chain_id;
        this.chain_n= chain_n;
        this.import_time= import_time;
    }

    public CampaignSurvey(Object data[]){
        this.stt = (Integer) data[0];
        this.customer_id = (String) data[1];
        this.customer_name = (String) data[2];
        this.cell_phone= (String) data[3];
        this.acctrbn = (String) data[4];
        this.ten_cn_thuc_hien= (String) data[5];
        this.chain_id= (Integer) data[6];
        this.chain_n= (Integer) data[7];
        this.import_time= (String) data[8];
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getStt() {
        return stt;
    }

    public void setStt(Integer Stt) {
        this.stt = Stt;
    }

    public String getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(String customer_id) {
        this.customer_id = customer_id;
    }

    public String getCustomer_name() {
        return customer_name;
    }

    public void setCustomer_name(String customer_name) {
        this.customer_name = customer_name;
    }

    public String getAcctrbn() {
        return acctrbn;
    }

    public void setAcctrbn(String acctrbn) {
        this.acctrbn = acctrbn;
    }

    public String getCell_phone() {
        return cell_phone;
    }

    public void setCell_phone(String cell_phone) {
        this.cell_phone = cell_phone;
    }

    public String getTen_cn_thuc_hien() {
        return ten_cn_thuc_hien;
    }

    public void setTen_cn_thuc_hien(String ten_cn_thuc_hien) {
        this.ten_cn_thuc_hien = ten_cn_thuc_hien;
    }

    public int getChain_id() {
        return chain_id;
    }

    public void setChain_id(int chain_id) {
        this.chain_id = chain_id;
    }

    public int getChain_n() {
        return chain_n;
    }

    public void setChain_n(int chain_n) {
        this.chain_n = chain_n;
    }

    public String getImport_time() {
        return import_time;
    }

    public void setImport_time(String import_time) {
        this.import_time = import_time;
    }


}