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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
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

    @CrossOrigin
    @GetMapping(path = "/update") // Map ONLY GET Requests
    public @ResponseBody
    String updateVoidMail(@RequestParam int id, @RequestParam String isSeen, @RequestParam String note) {
        SpecificationsBuilder builder = new SpecificationsBuilder();
        builder.with("id", ":", id);
        Specification<VoiceMail> spec = builder.build();
        VoiceMail voiceMail = voiceMailRepository.findOne(spec);
        if (isSeen.equals("1")) {
            voiceMail.setStatus_agent_seen("1");
            voiceMail.setAgent_seen_time(Util.getCurrentDateTime());
        }
        if (!note.isEmpty() && !note.equals("")) {
            voiceMail.setAgent_note(note);
        }

        voiceMailRepository.save(voiceMail);
        return "Updated";
    }

    @CrossOrigin
    @PostMapping(path = "/export") // Map ONLY POST Requests
    public ModelAndView getMyData(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException, JSONException {
        String data = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
//        JSONObject result = new JSONObject(data);
        data = data.replace("[", "").replace("]", "").replace("{", "");
        String[] results = data.split("},");

        for (int i = 0; i < results.length; i++) {
            JSONObject result = new JSONObject("{" + results[i] + "}");
            voiceMailData.put(i, result);
        }
        response.setContentType("application/ms-excel");
        response.setHeader("status", "200");
        response.setHeader("Content-disposition", "attachment; filename=voicemail.xls");
        return null;
    }

    @CrossOrigin
    @GetMapping(path = "/result") // Map ONLY GET Requests
    public @ResponseBody
    ModelAndView getResult(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("application/ms-excel");
        response.setHeader("Content-disposition", "attachment; filename=voicemail.xls");
        return new ModelAndView(new VoiceMailExcelView(), "voiceMailData", voiceMailData);
    }

    @CrossOrigin
    @GetMapping(path = "/all")
    @ResponseBody
    public List<VoiceMail> search(@RequestParam(value = "search") String search) {
//        System.out.println(search);
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
        return voiceMailRepository.findAll(spec);
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
