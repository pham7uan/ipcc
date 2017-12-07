package com.ssdc.ipcc.entities;
import javax.persistence.*;

@Entity
@Table(name = "log_voice_mail")
public class VoiceMail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(name="customer_name")
    private String customerName;
    @Column(name="customer_type")
    private String customerType;
    @Column(name="customer_phone")
    private String customerPhone;
    @Column(name="date_record")
    private String dateRecord;
    @Column(name="branch_call")
    private String branchCall;
    @Column(name="status_agent_seen")
    private String statusAgentSeen;
    @Column(name="agent_seen_id")
    private int agentSeenId;
    @Column(name="agent_seen_name")
    private String agentSeenName;
    @Column(name="agent_seen_time")
    private String agentSeenTime;
    @Column(name="agent_note")
    private String agentNote;
    @Column(name="path_file_record")
    private String pathFileRecord;
    public VoiceMail() {
    }

    public VoiceMail(String customer_name, String customer_type, String customer_phone,
                    String date_record,String  branch_call, String status_agent_seen,
                    int agent_seen_id,String agent_seen_name,String agent_seen_time,
                    String agent_note, String path_file_record) {
        this.customerName = customer_name;
        this.customerType = customer_type;
        this.customerPhone = customer_phone;
        this.dateRecord= date_record;
        this.branchCall= branch_call;
        this.statusAgentSeen= status_agent_seen;
        this.agentSeenId= agent_seen_id;
        this.agentSeenName= agent_seen_name;
        this.agentSeenTime= agent_seen_time;
        this.agentNote= agent_note;
        this.pathFileRecord= path_file_record;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerType() {
        return customerType;
    }

    public void setCustomerType(String customerType) {
        this.customerType = customerType;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getDateRecord() {
        return dateRecord;
    }

    public void setDateRecord(String dateRecord) {
        this.dateRecord = dateRecord;
    }

    public String getBranchCall() {
        return branchCall;
    }

    public void setBranchCall(String branchCall) {
        this.branchCall = branchCall;
    }

    public String getStatusAgentSeen() {
        return statusAgentSeen;
    }

    public void setStatusAgentSeen(String statusAgentSeen) {
        this.statusAgentSeen = statusAgentSeen;
    }

    public int getAgentSeenId() {
        return agentSeenId;
    }

    public void setAgentSeenId(int agentSeenId) {
        this.agentSeenId = agentSeenId;
    }

    public String getAgent_seen_name() {
        return agentSeenName;
    }

    public void setAgent_seen_name(String agent_seen_name) {
        this.agentSeenName = agent_seen_name;
    }

    public String getAgent_seen_time() {
        return agentSeenTime;
    }

    public void setAgent_seen_time(String agent_seen_time) {
        this.agentSeenTime = agent_seen_time;
    }

    public String getAgentNote() {
        return agentNote;
    }

    public void setAgentNote(String agentNote) {
        this.agentNote = agentNote;
    }

    public String getPathFileRecord() {
        return pathFileRecord;
    }

    public void setPathFileRecord(String pathFileRecord) {
        this.pathFileRecord = pathFileRecord;
    }
}