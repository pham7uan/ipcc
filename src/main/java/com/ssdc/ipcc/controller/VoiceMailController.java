package com.ssdc.ipcc.controller;

import com.ssdc.ipcc.common.SpecificationsBuilder;
import com.ssdc.ipcc.common.Util;
import com.ssdc.ipcc.entities.VoiceMail;
import com.ssdc.ipcc.entities.VoiceMailRepository;
import com.ssdc.ipcc.view.VoiceMailExcelView;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller    // This means that this class is a Controller
@RequestMapping(path = "/api/voicemail") // This means URL's start with /demo (after Application path)
public class VoiceMailController {
    @Value("${voice_mail_host}")
    private String host;
    @Value("${server.port}")
    private String port;
    @Autowired // This means to get the bean called userRepository
    // Which is auto-generated by Spring, we will use it to handle the data
    private VoiceMailRepository voiceMailRepository;
    private Map<Integer, JSONObject> voiceMailData = new HashMap<Integer, JSONObject>();
    private List<VoiceMail> voiceMails = new LinkedList<>();
    @CrossOrigin
    @GetMapping(path = "/update") // Map ONLY GET Requests
    public @ResponseBody
    String updateVoidMail(@RequestParam int id, @RequestParam String isSeen, @RequestParam String note) {
        SpecificationsBuilder builder = new SpecificationsBuilder();
        builder.with("id", ":", id);
        Specification<VoiceMail> spec = builder.build();
        VoiceMail voiceMail = voiceMailRepository.findOne(spec);
        if (!isSeen.isEmpty() && isSeen !=null){
            if (isSeen.equals("1")) {
                voiceMail.setStatusAgentSeen("1");
                voiceMail.setAgent_seen_time(Util.getCurrentDateTime("yyyy-MM-dd HH:mm:ss"));
            } else if(isSeen.equals("0")){
                voiceMail.setStatusAgentSeen("0");
                voiceMail.setAgent_seen_time(null);
            }
        }

        if (!note.isEmpty() && !note.equals("")) {
            voiceMail.setAgentNote(note);
        }

        voiceMailRepository.save(voiceMail);
        return "Updated";
    }

    @CrossOrigin
    @PostMapping(path = "/export") // Map ONLY POST Requests
    public ModelAndView getMyData(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException, JSONException {
        response.setContentType("application/ms-excel");
        response.setHeader("status", "200");
        response.setHeader("Content-disposition", "attachment; filename=voicemail.xls");
        return null;
    }

    @CrossOrigin
    @GetMapping(path = "/result") // Map ONLY GET Requests
    public @ResponseBody
    ModelAndView getResult(HttpServletRequest request, HttpServletResponse response) {
        Map<Integer,VoiceMail> voiceMailData = new HashMap<Integer,VoiceMail>();
        int stt =0;
        for (VoiceMail b:voiceMails){
            voiceMailData.put(stt,b);
            stt++;
        }
        response.setContentType("application/ms-excel");
        response.setHeader("Content-disposition", "attachment; filename=voicemail.xls");
        return new ModelAndView(new VoiceMailExcelView(), "voiceMailData", voiceMailData);
    }

    @CrossOrigin
    @GetMapping(path = "/all")
    @ResponseBody
    public List<VoiceMail> search(@RequestParam(value = "page") int page,
                                  @RequestParam(value = "sortcolumn") String sortcolumn,
                                  @RequestParam(value = "directive") String directive,
                                  @RequestParam(value = "search") String search) {
//        System.out.println(search);
        voiceMails.clear();
        SpecificationsBuilder builder = new SpecificationsBuilder();
//        Pattern pattern = Pattern.compile(" (\\w+?)(:|<|>)(a-zA-Z0-9\\-)*,");
//        Matcher matcher = pattern.matcher(search + ",");
        if (search.length() > 0) {
            search = search + ",";
            String[] params = search.split(",");
            for (int i = 0; i < params.length; i++) {
                System.out.println(params[i]);
                if (params[i].contains(">")) {
                    String[] parts = params[i].split(">");
                    builder.with(parts[0], ">", parts[1]);
                } else if (params[i].contains("<")) {
                    String[] parts = params[i].split("<");
                    builder.with(parts[0], "<", parts[1]);
                } else if (params[i].contains(":")) {
                    String[] parts = params[i].split(":");
                    builder.with(parts[0], ":", parts[1]);
                }
            }

        }
        Specification<VoiceMail> spec = builder.build();
//        return voiceMailRepository.findAll(spec);
        if (!sortcolumn.isEmpty() && sortcolumn !=null){
            if (directive.equals("DESC")){
                Sort s = new Sort(Sort.Direction.DESC,sortcolumn);
                voiceMails = voiceMailRepository.findAll(spec,s);
                return Util.PaginationList(voiceMails,page);
            } else if(directive.equals("ASC")){
                Sort s = new Sort(Sort.Direction.ASC,sortcolumn);
                voiceMails = voiceMailRepository.findAll(spec,s);
                return Util.PaginationList(voiceMails,page);
            }
        }

        voiceMails = voiceMailRepository.findAll(spec);
        return Util.PaginationList(voiceMails,page);
    }

    @CrossOrigin
    @GetMapping(path = "/gethost") // Map ONLY GET Requests
    public @ResponseBody
    String getHost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        return host;
    }

    @CrossOrigin
    @GetMapping(path = "/getport") // Map ONLY GET Requests
    public @ResponseBody
    String getPort(HttpServletRequest request, HttpServletResponse response) throws IOException {
        return port;
    }
}
