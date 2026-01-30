package com.cjs.auth_service.dto.response;

// or keep same package name in both services

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProblemSubmissionDetails {

    private String title;
    private String status;   // 🔑 STRING, NOT ENUM
    private String language;

}
