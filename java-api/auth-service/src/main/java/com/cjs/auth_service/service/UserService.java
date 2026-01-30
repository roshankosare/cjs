package com.cjs.auth_service.service;

import java.util.List;

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
        UserProfileDto profile = new UserProfileDto();
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setAbout(null);
        profile.setLatestSubmissions(submissions); // Placeholder for latest submissions
        return profile;

    }

    public List<ProblemSubmissionDetails> getProblemSubmissions(int userId, int problemId) {

        var response = cjsServiceClient.getProblemSubmissionsByUser(userId, "USER", problemId);

        if (response == null || !response.isSuccess())
            throw new RuntimeException("Failed to fetch submissions");

        return response.getData();
    }
}
