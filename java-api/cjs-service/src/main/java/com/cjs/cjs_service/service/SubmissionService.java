package com.cjs.cjs_service.service;



import org.springframework.stereotype.Service;

import com.cjs.cjs_service.dto.ProblemSubmissionDetails;
import com.cjs.cjs_service.model.Problem;
import com.cjs.cjs_service.model.Submission;
import com.cjs.cjs_service.model.SubmissionStatus;
import com.cjs.cjs_service.repository.SubmissionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    private final SubmissionRepository repository;
    private final ProblemService problemService;

    public SubmissionService(SubmissionRepository repository, ProblemService problemService) {
        this.repository = repository;
        this.problemService = problemService;
    }

    // ===============================
    // Create Submission
    // ===============================
    public Submission createSubmission(
            int userId,
            int problemId,
            String code,
            String language) {

        Problem problem = problemService.getProblemById(problemId);
    
        Submission submission = new Submission();
        submission.setUserId(userId);
        submission.setProblem(problem);
        submission.setCode(code);
        submission.setLanguage(language);
        submission.setStatus(SubmissionStatus.PENDING);

        return repository.save(submission);
    }

    // ===============================
    // Update Result
    // ===============================
    public void updateResult(
            int submissionId,
            SubmissionStatus status,
            int timeMs,
            int memoryKb) {

        Submission submission = repository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid submission ID"));

        submission.setStatus(status);
        // submission.setTimeMs(timeMs);
        // submission.setMemoryKb(memoryKb);

        repository.save(submission);
        // extend later for time & memory
    }

    // ===============================
    // Get Submissions for Problem
    // ===============================
    public List<ProblemSubmissionDetails> getProblemSubmissions(
            int userId,
            int problemId) {

        return repository
                .findByUserIdAndProblemId(userId, problemId)
                .stream()
                .sorted((a, b) ->
                        b.getSubmittedAt().compareTo(a.getSubmittedAt()))
                .map(s -> {
                    ProblemSubmissionDetails dto =
                            new ProblemSubmissionDetails();
                    dto.setTitle(s.getProblem().getTitle());
                    dto.setStatus(s.getStatus().toString());
                    dto.setLanguage(s.getLanguage());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<ProblemSubmissionDetails> getUserSubmissions(int userId) {
      
        return repository
                .findByUserId(userId)
                
                .stream()
                .sorted((a, b) ->
                        b.getSubmittedAt().compareTo(a.getSubmittedAt()))
                .map(s -> {
                    ProblemSubmissionDetails dto =
                            new ProblemSubmissionDetails();
                    dto.setTitle(s.getProblem().getTitle());
                    dto.setStatus(s.getStatus().toString());
                    dto.setLanguage(s.getLanguage());
                    return dto;
                })
                .collect(Collectors.toList());
    }


}

