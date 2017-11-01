package com.ssdc.ipcc.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CampaignSurveyRepository extends CrudRepository<CampaignSurvey, Long> {
//    public List<CampaignSurvey> findByCustomer_id(String customer_id);

}