package com.cjs.cjs_service.service.codeExecutionSerivce.worker;

import com.cjs.cjs_service.dto.CodeExecutionResult;
import com.cjs.cjs_service.dto.ExecutionJob;
import com.cjs.cjs_service.dto.ExecutionStatus;
import com.cjs.cjs_service.service.SubmissionService;
import com.cjs.cjs_service.service.codeExecutionSerivce.CodeExecutionRequest;
import com.cjs.cjs_service.service.codeExecutionSerivce.CodeExecutorFactory;

import jakarta.annotation.PostConstruct;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Component
public class CodeExecutionWorker {

    private final BlockingQueue<JobRequest> queue = new LinkedBlockingQueue<>();

    private final CodeExecutorFactory executorFactory;
    private final SubmissionService submissionService;

    public CodeExecutionWorker(
            CodeExecutorFactory executorFactory,
            SubmissionService submissionService) {
        this.executorFactory = executorFactory;
        this.submissionService = submissionService;
    }

    public void enqueue(ExecutionJob job, CodeExecutionRequest request) {
        queue.offer(new JobRequest(job, request));
    }

    @EventListener(ApplicationReadyEvent.class)
    public void startWorker() {
        Thread.ofVirtual().start(this::workerLoop);
    }

    private void workerLoop() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                JobRequest jr = queue.take();
                ExecutionJob job = jr.job();
                CodeExecutionRequest request = jr.request();

                job.setStatus(ExecutionStatus.RUNNING);

                var executor = executorFactory.getExecutor(request.getLanguage());
                CodeExecutionResult result = executor.execute(request);

                job.setResult(result);

                if (job.getSubmissionId() != -1) {
                    submissionService.updateResult(
                            job.getSubmissionId(),
                            result.getSubmissionStatus(),
                            0,
                            0);
                }

                job.setStatus(ExecutionStatus.COMPLETED);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // graceful shutdown
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private record JobRequest(ExecutionJob job, CodeExecutionRequest request) {
    }
}
