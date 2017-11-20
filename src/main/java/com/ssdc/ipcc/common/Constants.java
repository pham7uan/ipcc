package com.ssdc.ipcc.common;

import java.util.HashMap;
import java.util.Map;

public final class  Constants {
    public static Map<Integer,String> call_result;
    static
    {
        call_result = new HashMap<Integer, String>();
        call_result.put(21, "Abandoned");
        call_result.put(47, "Agent CallBack Error");
        call_result.put(10, "All Trunks Busy");
        call_result.put(33, "Answer");
        call_result.put(9, "Answering Machine Detected");
        call_result.put(31, "Bridged");
        call_result.put(6, "Busy");
        call_result.put(42, "Call Drop Error");
        call_result.put(52, "Cancel Record");
        call_result.put(19, "Cleared");
        call_result.put(2, "Conferenced");
        call_result.put(24, "Consult");
        call_result.put(30, "Converse-On");
        call_result.put(29, "Covered");
        call_result.put(49, "Deafened");
        call_result.put(41, "Dial Error");
        call_result.put(51, "Do Not Call");
        call_result.put(26, "Dropped ");
        call_result.put(27, "Dropped on No Answer");
        call_result.put(17, "Fax Detected");
        call_result.put(23, "Forwarded");
        call_result.put(3, "General Error");
        call_result.put(48, "Group CallBack Error ");
        call_result.put(50, "Held");
        call_result.put(7, "No Answer");
        call_result.put(35, "No Dial Tone");
        call_result.put(38, "No Established Detected");
        call_result.put(44, "No Port Available");
        call_result.put(36, "No Progress");
        call_result.put(27, "No RingBack Tone");
        call_result.put(34, "NU Tone");
        call_result.put(0, "OK");
        call_result.put(20, "Overflowed");
        call_result.put(39, "Pager Detected");
        call_result.put(25, "Pickedup");
        call_result.put(18, "Queue Full");
        call_result.put(22, "Redirected");
        call_result.put(5, "RemoteRelease");
        call_result.put(32, "Silence");
        call_result.put(8, "SIT Detected");
        call_result.put(13, "SIT IC (Intercept)");
        call_result.put(11, "SIT Invalid Num");
        call_result.put(15, "SIT NC (No Circuit)");
        call_result.put(16, "SIT RO (Reorder)");
        call_result.put(14, "SIT Unknown Call State");
        call_result.put(12, "SIT VC (Vacant Code)");
        call_result.put(46, "Stale");
        call_result.put(43, "Switch Error");
        call_result.put(4, "System Error");
        call_result.put(45, "Transfer Error");
        call_result.put(1, "Transferred");
        call_result.put(28, "Unknown Call Result");
        call_result.put(53, "Wrong Number");
        call_result.put(40, "Wrong Party");
    }
}
