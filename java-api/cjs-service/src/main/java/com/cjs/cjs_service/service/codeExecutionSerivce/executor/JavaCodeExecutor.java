package com.cjs.cjs_service.service.codeExecutionSerivce.executor;

import com.cjs.cjs_service.dto.CodeExecutionResult;
import com.cjs.cjs_service.dto.TestCaseResultDto;
import com.cjs.cjs_service.model.SubmissionStatus;
import com.cjs.cjs_service.service.codeExecutionSerivce.CodeExecutionRequest;
import com.cjs.cjs_service.service.codeExecutionSerivce.CodeExecutorBase;
import com.cjs.cjs_service.service.codeExecutionSerivce.infrastructure.DockerClientFactory;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.*;

import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class JavaCodeExecutor extends CodeExecutorBase {

    private static final long TIME_LIMIT_SECONDS = 3L; // Java needs a bit more time to boot the JVM
    private static final int MAX_OUTPUT_BYTES = 128 * 1024; // 128KB Limit

    @Override
    public String getLanguage() {
        return "java";
    }

    @Override
    protected CodeExecutionResult executeInternal(CodeExecutionRequest request) throws Exception {
        DockerClient docker = DockerClientFactory.create();

        String sourceB64 = Base64.getEncoder().encodeToString(
                request.getSourceCode().getBytes(StandardCharsets.UTF_8));

        String containerId = docker.createContainerCmd("eclipse-temurin:17-jdk-alpine")
                .withCmd("sh", "-c", "sleep infinity")
                .withEnv("SOURCE_B64=" + sourceB64)
                .withWorkingDir("/workspace")
                .withHostConfig(HostConfig.newHostConfig()
                        .withNetworkMode("none")
                        .withReadonlyRootfs(true)
                        .withMemory(256L * 1024 * 1024) // RAM limit
                        .withNanoCPUs(1_000_000_000L)
                        .withPidsLimit(128L) // Java needs more threads than C++
                        .withCapDrop(Capability.ALL)
                        .withTmpFs(Map.of("/workspace", "rw,exec,size=64m"))
                        .withAutoRemove(true))
                .exec().getId();

        docker.startContainerCmd(containerId).exec();

        try {
            // STEP 1: Write Main.java
            ExecResult write = exec(docker, containerId, 5, "sh", "-c", 
                "echo \"$SOURCE_B64\" | base64 -d > /workspace/Main.java");
            if (write.exitCode != 0) return fail(write);

            // STEP 2: Compile (longer timeout for javac)
            ExecResult compile = exec(docker, containerId, 15, "javac", "/workspace/Main.java");
            if (compile.exitCode != 0) {
                CodeExecutionResult r = fail(compile);
                r.setSubmissionStatus(SubmissionStatus.COMPILATION_ERROR);
                return r;
            }

            // STEP 3: Run Tests
            List<TestCaseResultDto> results = new ArrayList<>();
            for (int i = 0; i < request.getTestCases().size(); i++) {
                var test = request.getTestCases().get(i);
                String inputB64 = Base64.getEncoder().encodeToString(
                        test.getInput().getBytes(StandardCharsets.UTF_8));

                ExecResult run = exec(docker, containerId, TIME_LIMIT_SECONDS, "sh", "-c",
                        "echo \"" + inputB64 + "\" | base64 -d | java -cp /workspace Main");

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

            CodeExecutionResult finalResult = new CodeExecutionResult();
            long passedCount = results.stream().filter(TestCaseResultDto::isPassed).count();
            finalResult.setExitCode(0);
            finalResult.setTestCaseResults(results);
            finalResult.setSubmissionStatus(passedCount == results.size() ? 
                SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER);

            return finalResult;

        } finally {
            docker.stopContainerCmd(containerId).exec();
        }
    }

    // Reuse the exec and fail helpers from the improved C++ logic
    private static CodeExecutionResult fail(ExecResult r) {
        CodeExecutionResult res = new CodeExecutionResult();
        res.setExitCode(r.exitCode);
        res.setOutput(r.output);
        return res;
    }

    private static ExecResult exec(DockerClient docker, String containerId, long timeout, String... cmd) throws Exception {
        ExecCreateCmdResponse exec = docker.execCreateCmd(containerId)
                .withCmd(cmd).withAttachStdout(true).withAttachStderr(true).exec();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        boolean completed = docker.execStartCmd(exec.getId())
                .exec(new ResultCallback.Adapter<Frame>() {
                    @Override
                    public void onNext(Frame frame) {
                        if (out.size() < MAX_OUTPUT_BYTES) out.writeBytes(frame.getPayload());
                    }
                }).awaitCompletion(timeout, java.util.concurrent.TimeUnit.SECONDS);

        if (!completed) return new ExecResult(-1, "Timeout", true);

        Long exitCodeLong = docker.inspectExecCmd(exec.getId()).exec().getExitCodeLong();
        return new ExecResult(exitCodeLong == null ? -1 : exitCodeLong.intValue(), 
                              out.toString(StandardCharsets.UTF_8), false);
    }

    private record ExecResult(int exitCode, String output, boolean isTimeout) {}
}