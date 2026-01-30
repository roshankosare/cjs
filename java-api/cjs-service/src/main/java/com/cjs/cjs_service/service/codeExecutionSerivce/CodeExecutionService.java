package com.cjs.cjs_service.service.codeExecutionSerivce;

import com.cjs.cjs_service.dto.ExecutionJob;
import com.cjs.cjs_service.dto.TestCaseDto;
import com.cjs.cjs_service.dto.request.CodeRunRequestDto;
import com.cjs.cjs_service.service.ProblemService;
import com.cjs.cjs_service.service.codeExecutionSerivce.store.ExecutionJobStore;
import com.cjs.cjs_service.service.codeExecutionSerivce.worker.CodeExecutionWorker;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodeExecutionService {

    private final ExecutionJobStore jobStore;
    private final CodeExecutionWorker worker;
    private final ProblemService problemService;

    public CodeExecutionService(
            ExecutionJobStore jobStore,
            CodeExecutionWorker worker,
            ProblemService problemService) {
        this.jobStore = jobStore;
        this.worker = worker;
        this.problemService = problemService;
    }

    public String run(CodeRunRequestDto dto) {
        ExecutionJob job = jobStore.createJob();

        var problem = problemService.getProblemById(dto.getProblemId());
        if (problem == null) {
            throw new RuntimeException("Problem not found");
        }

        List<TestCaseDto> testCases = problem.getTestCases().stream()
                .filter(tc -> tc.isSample())
                .map(tc -> {
                    TestCaseDto tcd = new TestCaseDto();
                    tcd.setInput(tc.getInput());
                    tcd.setOutput(tc.getExpectedOutput());
                    tcd.setSample(tc.isSample());
                    return tcd;

                })
                .collect(Collectors.toList());

        CodeExecutionRequest request = new CodeExecutionRequest(dto.getLanguage(), dto.getSourceCode(), testCases);

        System.out.println("Enqueuing job: " + job.getJobId());
        worker.enqueue(job, request);
        System.out.println("Job enqueued: " + job.getJobId());
        return job.getJobId();
    }

    public String submit(CodeRunRequestDto dto, int submissionId) {
        ExecutionJob job = jobStore.createJob(submissionId);

        var problem = problemService.getProblemById(dto.getProblemId());
        if (problem == null) {
            throw new RuntimeException("Problem not found");
        }

        var testCases = problem.getTestCases().stream()
                .map(tc -> {
                    TestCaseDto tcd = new TestCaseDto();
                    tcd.setInput(tc.getInput());
                    tcd.setOutput(tc.getExpectedOutput());
                    tcd.setSample(tc.isSample());
                    return tcd;

                })
                .collect(Collectors.toList());

        CodeExecutionRequest request = new CodeExecutionRequest(
                dto.getLanguage(),
                dto.getSourceCode(),
                testCases);

        worker.enqueue(job, request);
        return job.getJobId();
    }

    public ExecutionJob getStatus(String jobId) {
        return jobStore.getJob(jobId);
    }
}