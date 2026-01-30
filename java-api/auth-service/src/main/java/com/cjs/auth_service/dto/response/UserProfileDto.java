package com.cjs.auth_service.dto.response;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter

@Setter
public class UserProfileDto {

    private String username;
    private String email;
    private String about;

    private List<ProblemSubmissionDetails> latestSubmissions = new ArrayList<>();

    public UserProfileDto() {
    }

    public UserProfileDto(
            String username,
            String email,
            String about,
            List<ProblemSubmissionDetails> latestSubmissions) {
        this.username = username;
        this.email = email;
        this.about = about;
        this.latestSubmissions = latestSubmissions;
    }

}
