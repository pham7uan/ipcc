package com.ssdc.ipcc.entities;

import com.ssdc.ipcc.entities.VoiceMail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VoiceMailRepository
        extends JpaRepository<VoiceMail, Long>, JpaSpecificationExecutor<VoiceMail> {}