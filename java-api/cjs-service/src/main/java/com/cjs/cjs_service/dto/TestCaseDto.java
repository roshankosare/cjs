package com.cjs.cjs_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class TestCaseDto {

    @NotBlank
    private String input = "";

    @NotBlank
    private String output = "";

    private boolean sample = false;

    // public TestCaseDto(String input, String output) {
    //     this.input = input;
    //     this.output = output;
    // }

    // getters and setters
}
