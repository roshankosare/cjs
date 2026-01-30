package com.cjs.cjs_service.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeRunRequestDto {

    private String sourceCode;
    private String language;
    private Integer problemId;
}
