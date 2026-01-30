package com.cjs.cjs_service.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AiRequestDto {

    private int problemId = 1;
    private String code = "";
    private String language = "";

    

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
