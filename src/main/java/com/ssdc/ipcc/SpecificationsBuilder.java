package com.ssdc.ipcc;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import java.util.ArrayList;
import java.util.List;

public class SpecificationsBuilder {

    private final List<SearchCriteria> params;

    public SpecificationsBuilder() {
        params = new ArrayList<SearchCriteria>();
    }

    public SpecificationsBuilder with(String key, String operation, Object value) {
        params.add(new SearchCriteria(key, operation, value));
        return this;
    }

    public Specification<VoiceMail> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification<VoiceMail>> specs = new ArrayList<Specification<VoiceMail>>();
        for (SearchCriteria param : params) {
            specs.add(new EntitySpecification(param));
        }

        Specification<VoiceMail> result = specs.get(0);
        for (int i = 1; i < specs.size(); i++) {
            result = Specifications.where(result).and(specs.get(i));
        }
        return result;
    }
}
