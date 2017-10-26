package com.ssdc.ipcc;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import java.sql.Timestamp;
import java.util.List;

public interface VoiceMailRepository
        extends JpaRepository<VoiceMail, Long>, JpaSpecificationExecutor<VoiceMail> {}