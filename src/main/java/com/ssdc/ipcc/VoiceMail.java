package com.ssdc.ipcc;
import javax.persistence.*;

@Entity
@Table(name = "log_voice_mail")
public class VoiceMail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String customer_name;
    private String customer_type;
    private String customer_phone;
    private String date_record;
    private String branch_call;
    private String status_agent_seen;
    private int agent_seen_id;
    private String agent_seen_name;
    private String agent_seen_time;
    private String agent_note;
    private String path_file_record;
    public VoiceMail() {
    }

    public VoiceMail(String customer_name, String customer_type, String customer_phone,
                    String date_record,String  branch_call, String status_agent_seen,
                    int agent_seen_id,String agent_seen_name,String agent_seen_time,
                    String agent_note, String path_file_record) {
        this.customer_name = customer_name;
        this.customer_type = customer_type;
        this.customer_phone = customer_phone;
        this.date_record= date_record;
        this.branch_call= branch_call;
        this.status_agent_seen= status_agent_seen;
        this.agent_seen_id= agent_seen_id;
        this.agent_seen_name= agent_seen_name;
        this.agent_seen_time= agent_seen_time;
        this.agent_note= agent_note;
        this.path_file_record= path_file_record;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getCustomer_name() {
        return customer_name;
    }

    public void setCustomer_name(String customer_name) {
        this.customer_name = customer_name;
    }

    public String getCustomer_type() {
        return customer_type;
    }

    public void setCustomer_type(String customer_type) {
        this.customer_type = customer_type;
    }

    public String getCustomer_phone() {
        return customer_phone;
    }

    public void setCustomer_phone(String customer_phone) {
        this.customer_phone = customer_phone;
    }

    public String getDate_record() {
        return date_record;
    }

    public void setDate_record(String date_record) {
        this.date_record = date_record;
    }

    public String getBranch_call() {
        return branch_call;
    }

    public void setBranch_call(String branch_call) {
        this.branch_call = branch_call;
    }

    public String getStatus_agent_seen() {
        return status_agent_seen;
    }

    public void setStatus_agent_seen(String status_agent_seen) {
        this.status_agent_seen = status_agent_seen;
    }

    public int getAgent_seen_id() {
        return agent_seen_id;
    }

    public void setAgent_seen_id(int agent_seen_id) {
        this.agent_seen_id = agent_seen_id;
    }

    public String getAgent_seen_name() {
        return agent_seen_name;
    }

    public void setAgent_seen_name(String agent_seen_name) {
        this.agent_seen_name = agent_seen_name;
    }

    public String getAgent_seen_time() {
        return agent_seen_time;
    }

    public void setAgent_seen_time(String agent_seen_time) {
        this.agent_seen_time = agent_seen_time;
    }

    public String getAgent_note() {
        return agent_note;
    }

    public void setAgent_note(String agent_note) {
        this.agent_note = agent_note;
    }

    public String getPath_file_record() {
        return path_file_record;
    }

    public void setPath_file_record(String path_file_record) {
        this.path_file_record = path_file_record;
    }

//    @Override
//    public String toString() {
//        return "void_mail{" +
//                ", customer_name='" + customer_name + '\'' +
//                ", customer_phone=" + customer_phone +
//                '}';
//    }
}