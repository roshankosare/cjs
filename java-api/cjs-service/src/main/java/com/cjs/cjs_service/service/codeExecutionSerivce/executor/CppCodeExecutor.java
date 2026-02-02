package com.cjs.cjs_service.service.codeExecutionSerivce.executor;

import com.cjs.cjs_service.dto.CodeExecutionResult;
import com.cjs.cjs_service.dto.TestCaseResultDto;
import com.cjs.cjs_service.model.SubmissionStatus;
import com.cjs.cjs_service.service.codeExecutionSerivce.CodeExecutionRequest;
import com.cjs.cjs_service.service.codeExecutionSerivce.CodeExecutorBase;
import com.cjs.cjs_service.service.codeExecutionSerivce.infrastructure.DockerClientFactory;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.api.async.ResultCallback;

import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class CppCodeExecutor extends CodeExecutorBase {

    // Constants for safety limits
    private static final long TIME_LIMIT_SECONDS = 2L;
    private static final int MAX_OUTPUT_BYTES = 100 * 1024; // 100KB limit per test case

    @Override
    public String getLanguage() {
        return "cpp";
    }

    @Override
    protected CodeExecutionResult executeInternal(CodeExecutionRequest request) throws Exception {
        DockerClient docker = DockerClientFactory.create();

        // Encode source to prevent shell escaping issues
        String sourceB64 = Base64.getEncoder().encodeToString(
                request.getSourceCode().getBytes(StandardCharsets.UTF_8));

        String containerId = docker.createContainerCmd("frolvlad/alpine-gxx")
                .withCmd("sh", "-c", "sleep infinity")
                .withEnv("SOURCE_B64=" + sourceB64)
                .withWorkingDir("/workspace")
                .withHostConfig(HostConfig.newHostConfig()
                        .withNetworkMode("none")
                        .withReadonlyRootfs(true)
                        .withMemory(256L * 1024 * 1024)
                        .withNanoCPUs(1_000_000_000L)
                        .withPidsLimit(64L)
                        .withCapDrop(Capability.ALL)
                        .withTmpFs(Map.of("/workspace", "rw,exec,size=64m"))
                        .withAutoRemove(true))
                .exec().getId();

        docker.startContainerCmd(containerId).exec();

        try {
            // STEP 1: Write source
            ExecResult write = exec(docker, containerId, 5, "sh", "-c", 
                "echo \"$SOURCE_B64\" | base64 -d > /workspace/main.cpp");

            if (write.exitCode != 0) return fail(write);

            // STEP 2: Compile (using a slightly longer timeout for g++)
            ExecResult compile = exec(docker, containerId, 10, "g++", "/workspace/main.cpp",
                    "-O2", "-std=c++17", "-o", "/workspace/main");

            if (compile.exitCode != 0) {
                CodeExecutionResult r = fail(compile);
                r.setSubmissionStatus(SubmissionStatus.COMPILATION_ERROR);
                return r;
            }

            // STEP 3: Run tests
            List<TestCaseResultDto> results = new ArrayList<>();
            for (int i = 0; i < request.getTestCases().size(); i++) {
                var test = request.getTestCases().get(i);
                String inputB64 = Base64.getEncoder().encodeToString(
                        test.getInput().getBytes(StandardCharsets.UTF_8));

                // Execute with Time Limit
                ExecResult run = exec(docker, containerId, TIME_LIMIT_SECONDS, "sh", "-c",
                        "echo \"" + inputB64 + "\" | base64 -d | /workspace/main");

                TestCaseResultDto dto = new TestCaseResultDto();
                dto.setIndex(i + 1);
                dto.setInput(test.getInput());
                dto.setExpected(test.getOutput().trim());

                if (run.isTimeout) {
                    dto.setOutput("Time Limit Exceeded");
                    dto.setPassed(false);
                } else {
                    String actualOutput = run.output.trim();
                    dto.setOutput(actualOutput);
                    dto.setPassed(actualOutput.equals(dto.getExpected()));
                }
                results.add(dto);
            }

            // Aggregate Results
            CodeExecutionResult result = new CodeExecutionResult();
            long passedCount = results.stream().filter(TestCaseResultDto::isPassed).count();
            int totalCount = results.size();

            result.setExitCode(0);
            result.setOutput(passedCount + " / " + totalCount + " test cases passed");
            result.setTestCaseResults(results);
            
            // Simplified status logic
            result.setSubmissionStatus(passedCount == totalCount ? 
                SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER);

            return result;

        } finally {
            // Ensure container is always killed
            try {
                docker.stopContainerCmd(containerId).exec();
            } catch (Exception e) {
                // Log cleanup failure but don't crash the worker
            }
        }
    }

    private static CodeExecutionResult fail(ExecResult r) {
        CodeExecutionResult res = new CodeExecutionResult();
        res.setExitCode(r.exitCode);
        res.setOutput(r.isTimeout ? "Timeout during compilation" : r.output);
        return res;
    }

    private static ExecResult exec(DockerClient docker, String containerId, long timeoutSeconds, String... cmd) throws Exception {
        ExecCreateCmdResponse exec = docker.execCreateCmd(containerId)
                .withCmd(cmd)
                .withAttachStdout(true)
                .withAttachStderr(true)
                .exec();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        // Use a flag to track timeout
        boolean completed = docker.execStartCmd(exec.getId())
                .exec(new ResultCallback.Adapter<Frame>() {
                    @Override
                    public void onNext(Frame frame) {
                        // Protect against "Output Flooding"
                        if (out.size() < MAX_OUTPUT_BYTES) {
                            out.writeBytes(frame.getPayload());
                        }
                    }
                })
                .awaitCompletion(timeoutSeconds, java.util.concurrent.TimeUnit.SECONDS);

        if (!completed) {
            return new ExecResult(-1, "TLE", true);
        }

        Long exitCodeLong = docker.inspectExecCmd(exec.getId()).exec().getExitCodeLong();
        int exitCode = exitCodeLong == null ? -1 : exitCodeLong.intValue();

        return new ExecResult(exitCode, out.toString(StandardCharsets.UTF_8), false);
    }

    private record ExecResult(int exitCode, String output, boolean isTimeout) {}

}
