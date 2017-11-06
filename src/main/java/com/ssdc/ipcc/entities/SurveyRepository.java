package com.ssdc.ipcc.entities;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface SurveyRepository extends CrudRepository<Survey, Long> {
    @Query("SELECT coalesce(max(ch.chainid), 0) FROM Survey ch")
    Integer getMaxChaniId();
    @Query("SELECT coalesce(max(ch.id), 0) FROM Survey ch")
    Integer getMaxRecordId();
}