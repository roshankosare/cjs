package com.cjs.auth_service.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cjs.auth_service.client.CjsServiceClient;
import com.cjs.auth_service.dto.response.ProblemSubmissionDetails;
import com.cjs.auth_service.dto.response.UserProfileDto;
import com.cjs.auth_service.model.User;
import com.cjs.auth_service.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CjsServiceClient cjsServiceClient;

    public UserService(UserRepository userRepository, CjsServiceClient cjsServiceClient) {
        this.userRepository = userRepository;
        this.cjsServiceClient = cjsServiceClient;
    }

    public UserProfileDto getUserProfile(int userId) {
        // Implementation to fetch user profile and latest submissions

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        var response = cjsServiceClient.getUserSubmissions(userId, "USER");

        List<ProblemSubmissionDetails> submissions = response != null && response.isSuccess()
                ? response.getData()
                : List.of();
        
        // Calculate stats
        // Assuming "ACCEPTED" is the status string. Adjust if necessary (e.g. from enum)
        var solvedProblems = submissions.stream()
            .filter(s -> "ACCEPTED".equalsIgnoreCase(s.getStatus()))
            .filter(s -> s.getTitle() != null) // Ensure title is present for distinct key
            // Distinct by Title (or ProblemId if available, but Title is what we have in DTO)
            .collect(Collectors.toMap(
                ProblemSubmissionDetails::getTitle, 
                p -> p, 
                (p1, p2) -> p1 // Keep existing if duplicate
            ))
            .values();

        UserProfileDto profile = new UserProfileDto();
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setAbout(user.getAbout() != null ? user.getAbout() : "Coding enthusiast");
        
        profile.setSolvedCount(solvedProblems.size());
        profile.setEasyCount((int) solvedProblems.stream().filter(s -> "EASY".equalsIgnoreCase(s.getDifficulty())).count());
        profile.setMediumCount((int) solvedProblems.stream().filter(s -> "MEDIUM".equalsIgnoreCase(s.getDifficulty())).count());
        profile.setHardCount((int) solvedProblems.stream().filter(s -> "HARD".equalsIgnoreCase(s.getDifficulty())).count());
        
        profile.setLatestSubmissions(submissions); 
        return profile;

    }

    public List<ProblemSubmissionDetails> getProblemSubmissions(int userId, int problemId) {

        var response = cjsServiceClient.getProblemSubmissionsByUser(userId, "USER", problemId);

        if (response == null || !response.isSuccess())
            throw new RuntimeException("Failed to fetch submissions");

        return response.getData();
    }
}
