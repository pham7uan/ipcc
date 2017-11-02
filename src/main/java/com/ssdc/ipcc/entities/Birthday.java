package com.ssdc.ipcc.entities;

import javax.persistence.*;

@Entity
@Table(name = "cc247loyalty")
public class Birthday {
    @Id
//    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name="record_id")
    private Integer id;

    @Column(name="business_unit")
    private String businessunit;
    @Column(name="customer_id")
    private String Customerid;
    @Column(name="customer_name")
    private String CustomerName;
    @Column(name="contact_info")
    private String contactinfo;
    private int contact_info_type = 1;
    private int record_type = 2;
    private int record_status =1;
    private int call_result = 28;
    private int attempt = 0;
    private int daily_from = 28800;
    private int daily_till = 72000;
    private int tz_dbid = 111;
    @Column(name="chain_id")
    private int chainid;
    private int chain_n;
    @Column(name="date_of_birth")
    private int DateOfBrith;
    @Column(name="month_of_birth")
    private int MonthOfBirth;
    private String Gift;
    @Column(name="manager_name")
    private String ManagerName;
    @Column(name="customer_segment")
    private String CustomerSegment;
    @Column(name="loyalty_qn_1")
    private String loyaltyQn1 ="0";
    @Column(name="other_reason01")
    private String OtherReason01 ="0";
    @Column(name="other_reason02")
    private String OtherReason02 ="0";
    @Column(name="shiper_name")
    private String ShiperName ="0";
    @Column(name="feedback")
    private String Feedback ="0";



    public Birthday(){}

    public Birthday(Object data[]){
        this.id = (Integer)data[0];
        this.businessunit = (String) data[1];
        this.Customerid = (String) data[2];
        this.CustomerName = (String) data[3];
        this.contactinfo= (String) data[4];
        this.DateOfBrith = (Integer) data[6];
        this.MonthOfBirth = (Integer) data[7];
        this.CustomerSegment = (String) data[8];
        this.Gift = (String) data[10];
        this.ManagerName = (String) data[12];
        this.chainid = (Integer) data[13];
        this.chain_n = (Integer) data[14];
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBusinessunit() {
        return businessunit;
    }

    public void setBusinessunit(String businessunit) {
        businessunit = businessunit;
    }

    public String getCustomerid() {
        return Customerid;
    }

    public void setCustomerid(String Customerid) {
        Customerid = Customerid;
    }

    public String getCustomerName() {
        return CustomerName;
    }

    public void setCustomerName(String customerName) {
        CustomerName = customerName;
    }

    public String getContactinfo() {
        return contactinfo;
    }

    public void setContactinfo(String contactinfo) {
        this.contactinfo = contactinfo;
    }

    public int getContact_info_type() {
        return contact_info_type;
    }

    public void setContact_info_type(int contact_info_type) {
        this.contact_info_type = contact_info_type;
    }

    public int getRecord_type() {
        return record_type;
    }

    public void setRecord_type(int record_type) {
        this.record_type = record_type;
    }

    public int getRecord_status() {
        return record_status;
    }

    public void setRecord_status(int record_status) {
        this.record_status = record_status;
    }

    public int getCall_result() {
        return call_result;
    }

    public void setCall_result(int call_result) {
        this.call_result = call_result;
    }

    public int getAttempt() {
        return attempt;
    }

    public void setAttempt(int attempt) {
        this.attempt = attempt;
    }

    public int getDaily_from() {
        return daily_from;
    }

    public void setDaily_from(int daily_from) {
        this.daily_from = daily_from;
    }

    public int getDaily_till() {
        return daily_till;
    }

    public void setDaily_till(int daily_till) {
        this.daily_till = daily_till;
    }

    public int getTz_dbid() {
        return tz_dbid;
    }

    public void setTz_dbid(int tz_dbid) {
        this.tz_dbid = tz_dbid;
    }

    public int getChainid() {
        return chainid;
    }

    public void setChainid(int chainid) {
        this.chainid = chainid;
    }

    public int getChain_n() {
        return chain_n;
    }

    public void setChain_n(int chain_n) {
        this.chain_n = chain_n;
    }

    public int getDateOfBrith() {
        return DateOfBrith;
    }

    public void setDateOfBrith(int dateOfBrith) {
        DateOfBrith = dateOfBrith;
    }

    public int getMonthOfBirth() {
        return MonthOfBirth;
    }

    public void setMonthOfBirth(int monthOfBirth) {
        MonthOfBirth = monthOfBirth;
    }

    public String getGift() {
        return Gift;
    }

    public void setGift(String gift) {
        Gift = gift;
    }

    public String getManagerName() {
        return ManagerName;
    }

    public void setManagerName(String managerName) {
        ManagerName = managerName;
    }

    public String getCustomerSegment() {
        return CustomerSegment;
    }

    public void setCustomerSegment(String customerSegment) {
        CustomerSegment = customerSegment;
    }

    public String getLoyaltyQn1() {
        return loyaltyQn1;
    }

    public void setLoyaltyQn1(String loyaltyQn1) {
        this.loyaltyQn1 = loyaltyQn1;
    }

    public String getOtherReason01() {
        return OtherReason01;
    }

    public void setOtherReason01(String otherReason01) {
        OtherReason01 = otherReason01;
    }

    public String getOtherReason02() {
        return OtherReason02;
    }

    public void setOtherReason02(String otherReason02) {
        OtherReason02 = otherReason02;
    }
}
