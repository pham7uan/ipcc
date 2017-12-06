package com.ssdc.ipcc.entities;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface BirthdayRepository extends CrudRepository<Birthday, Long> {
    @Query("SELECT coalesce(max(ch.chainid), 0) FROM Birthday ch")
    Integer getMaxChaniId();

    @Query("SELECT coalesce(max(ch.id), 0) FROM Birthday ch")
    Integer getMaxRecordId();

    @Query("SELECT DISTINCT ch.dateCampaign, ch.contactCampaign FROM Birthday ch ORDER BY ch.dateCampaign DESC ")
    List<Object> findImportHistory();

    @Query("SELECT ch.id FROM Birthday ch WHERE ch.dateCampaign = :date AND ch.contactCampaign = :filename")
    List<Long> findByHisory(@Param("filename") String filename,@Param("date") String date);

    @Modifying
    @Transactional
    public void deleteByIdIn(List<Long> id);
}
