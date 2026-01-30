package com.cjs.cjs_service.dto.response;


import com.cjs.cjs_service.dto.TestCaseDto;
import com.cjs.cjs_service.model.Difficulty;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AdminGetProblemDto {

    private String title = "";

    private int id = 1;

    private String description = "";

    private List<TestCaseDto> testCases = new ArrayList<>();

    private Difficulty difficulty = Difficulty.EASY;

    private List<String> tags = new ArrayList<>();

    // getters and setters
}
