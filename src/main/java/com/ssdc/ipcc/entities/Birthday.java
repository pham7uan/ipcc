package com.ssdc.ipcc.entities;

import javax.persistence.*;

@Entity
@Table(name = "cc247loyalty")
public class Birthday {
    @Id
//    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name="record_id")
    private Long id;

    @Column(name="business_unit")
    private String businessUnit;
    @Column(name="customer_id")
    private String customerId;
    @Column(name="customer_name")
    private String customerName;
    @Column(name="contact_info")
    private String contactInfo;
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
    private int dateOfBirth;
    @Column(name="month_of_birth")
    private int monthOfBirth;
    private String gift;
    @Column(name="manager_name")
    private String managerName;
    @Column(name="customer_segment")
    private String customerSegment;
    @Column(name="loyalty_qn_1")
    private String loyaltyQn1 ="0";
    @Column(name="other_reason01")
    private String otherReason01 ="0";
    @Column(name="other_reason02")
    private String otherReason02 ="0";
    @Column(name="shiper_name")
    private String shiperName ="0";
    @Column(name="feedback")
    private String feedback ="0";

    public Birthday(){}

    public Birthday(Object data[]){
        this.id = (Long)data[0];
        this.businessUnit = (String) data[1];
        this.customerId = (String) data[2];
        this.customerName = (String) data[3];
        this.contactInfo= (String) data[4];
        this.dateOfBirth = (Integer) data[6];
        this.monthOfBirth = (Integer) data[7];
        this.customerSegment = (String) data[8];
        this.gift = (String) data[10];
        this.managerName = (String) data[12];
        this.chainid = (Integer) data[13];
        this.chain_n = (Integer) data[14];
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusinessUnit() {
        return businessUnit;
    }

    public void setBusinessUnit(String businessUnit) {
        this.businessUnit = businessUnit;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
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
        return dateOfBirth;
    }

    public void setDateOfBrith(int dateOfBrith) {
        this.dateOfBirth = dateOfBrith;
    }

    public int getMonthOfBirth() {
        return monthOfBirth;
    }

    public void setMonthOfBirth(int monthOfBirth) {
        this.monthOfBirth = monthOfBirth;
    }

    public String getGift() {
        return gift;
    }

    public void setGift(String gift) {
        this.gift = gift;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getCustomerSegment() {
        return customerSegment;
    }

    public void setCustomerSegment(String customerSegment) {
        this.customerSegment = customerSegment;
    }

    public String getLoyaltyQn1() {
        return loyaltyQn1;
    }

    public void setLoyaltyQn1(String loyaltyQn1) {
        this.loyaltyQn1 = loyaltyQn1;
    }

    public String getOtherReason01() {
        return otherReason01;
    }

    public void setOtherReason01(String otherReason01) {
        this.otherReason01 = otherReason01;
    }

    public String getOtherReason02() {
        return otherReason02;
    }

    public void setOtherReason02(String otherReason02) {
        this.otherReason02 = otherReason02;
    }

    public String getShiperName() {
        return shiperName;
    }

    public void setShiperName(String shiperName) {
        this.shiperName = shiperName;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
