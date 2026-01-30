package com.cjs.mcq_service.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=true)
public class McqQuestionWithAnswerDto extends McqQuestionDto {
    private String correctOption;
    private String correctExplanation;
    private String incorrectExplanationA;
    private String incorrectExplanationB;
    private String incorrectExplanationC;
    private String incorrectExplanationD;
}