package com.ssdc.ipcc.entities;

import org.springframework.data.repository.CrudRepository;

public interface SurveyRepository extends CrudRepository<Survey, Long> {
//    public List<Survey> findByCustomer_id(String customer_id);
}