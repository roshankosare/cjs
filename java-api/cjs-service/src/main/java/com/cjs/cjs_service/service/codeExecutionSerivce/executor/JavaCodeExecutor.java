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

        @Override
        public String getLanguage() {
                return "java";
        }

        @Override
        protected CodeExecutionResult executeInternal(
                        CodeExecutionRequest request) throws Exception {

                DockerClient docker = DockerClientFactory.create();

                // Encode Java source safely (same as C#)
                String sourceB64 = Base64.getEncoder()
                                .encodeToString(request.getSourceCode()
                                                .getBytes(StandardCharsets.UTF_8));

                String containerId = docker.createContainerCmd("eclipse-temurin:17-jdk-alpine")
                                .withCmd("sh", "-c", "sleep infinity")
                                .withEnv("SOURCE_B64=" + sourceB64)
                                .withWorkingDir("/workspace")
                                .withHostConfig(
                                                HostConfig.newHostConfig()
                                                                .withNetworkMode("none")
                                                                .withReadonlyRootfs(true)
                                                                .withMemory(256L * 1024 * 1024)
                                                                .withNanoCPUs(1_000_000_000L)
                                                                .withPidsLimit(64L)
                                                                .withCapDrop(Capability.ALL)
                                                                .withTmpFs(
                                                                                Map.of("/workspace",
                                                                                                "rw,exec,size=64m"))
                                                                .withAutoRemove(true))
                                .exec()
                                .getId();

                docker.startContainerCmd(containerId).exec();

                try {
                        /*
                         * -------------------------------------------------
                         * STEP 1: Write Main.java
                         * -------------------------------------------------
                         */
                        ExecResult write = exec(
                                        docker, containerId,
                                        "sh", "-c",
                                        "echo \"$SOURCE_B64\" | base64 -d > /workspace/Main.java");

                        if (write.exitCode != 0)
                                return fail(write);

                        /*
                         * -------------------------------------------------
                         * STEP 2: Compile ONCE
                         * -------------------------------------------------
                         */
                        ExecResult compile = exec(
                                        docker, containerId,
                                        "javac", "/workspace/Main.java");

                        if (compile.exitCode != 0) {
                                CodeExecutionResult r = fail(compile);
                                r.setSubmissionStatus(SubmissionStatus.COMPILATION_ERROR);
                                return r;
                        }

                        /*
                         * -------------------------------------------------
                         * STEP 3: Run for EACH test case
                         * -------------------------------------------------
                         */
                        List<TestCaseResultDto> results = new ArrayList<>();

                        for (int i = 0; i < request.getTestCases().size(); i++) {
                                var test = request.getTestCases().get(i);

                                String inputB64 = Base64.getEncoder()
                                                .encodeToString(test.getInput()
                                                                .getBytes(StandardCharsets.UTF_8));

                                ExecResult run = exec(
                                                docker, containerId,
                                                "sh", "-c",
                                                "echo \"" + inputB64 + "\" | base64 -d | java -cp /workspace Main");

                                String output = run.output.trim();
                                String expected = test.getOutput().trim();

                                TestCaseResultDto dto = new TestCaseResultDto();
                                dto.setIndex(i + 1);
                                dto.setInput(test.getInput());
                                dto.setOutput(output);
                                dto.setExpected(expected);
                                dto.setPassed(output.equals(expected));

                                results.add(dto);
                        }

                        /*
                         * -------------------------------------------------
                         * FINAL RESULT
                         * -------------------------------------------------
                         */
                        CodeExecutionResult result = new CodeExecutionResult();
                        result.setExitCode(0);

                        long passedCount = results.stream()
                                        .filter(TestCaseResultDto::isPassed)
                                        .count();

                        int totalCount = results.size();

                        result.setOutput(passedCount + " / " + totalCount + " test cases passed");
                        result.setTestCaseResults(results);

                        if (passedCount == totalCount) {
                                result.setSubmissionStatus(SubmissionStatus.ACCEPTED);
                        } else if (passedCount > 0) {
                                result.setSubmissionStatus(SubmissionStatus.WRONG_ANSWER);
                        } else {
                                result.setSubmissionStatus(SubmissionStatus.WRONG_ANSWER);
                        }

                        return result;

                } finally {
                        docker.stopContainerCmd(containerId).exec();
                }
        }

        // ===============================
        // Helpers (same as C++)
        // ===============================

        private static CodeExecutionResult fail(ExecResult r) {
                CodeExecutionResult res = new CodeExecutionResult();
                res.setExitCode(r.exitCode);
                res.setOutput(r.output);
                return res;
        }

        private static ExecResult exec(
                        DockerClient docker,
                        String containerId,
                        String... cmd) throws Exception {

                ExecCreateCmdResponse exec = docker.execCreateCmd(containerId)
                                .withCmd(cmd)
                                .withAttachStdout(true)
                                .withAttachStderr(true)
                                .exec();

                ByteArrayOutputStream out = new ByteArrayOutputStream();

                docker.execStartCmd(exec.getId())
                                .exec(new ResultCallback.Adapter<Frame>() {
                                        @Override
                                        public void onNext(Frame frame) {
                                                out.writeBytes(frame.getPayload());
                                        }
                                })
                                .awaitCompletion();

                Long exitCodeLong = docker.inspectExecCmd(exec.getId())
                                .exec()
                                .getExitCodeLong();

                int exitCode = exitCodeLong == null ? -1 : exitCodeLong.intValue();

                return new ExecResult(
                                exitCode,
                                out.toString(StandardCharsets.UTF_8));
        }

        private record ExecResult(int exitCode, String output) {
        }
}
