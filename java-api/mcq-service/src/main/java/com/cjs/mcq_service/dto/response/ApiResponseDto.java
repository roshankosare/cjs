package com.cjs.mcq_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiResponseDto<T> {

    private String message;
    private T data;
    private boolean success;

    // 🔑 REQUIRED for Feign / Jackson
    public ApiResponseDto() {
    }

    // ✅ Keeps ALL existing usage intact
    public ApiResponseDto(String message, T data, boolean success) {
        this.message = message;
        this.data = data;
        this.success = success;
    }
}