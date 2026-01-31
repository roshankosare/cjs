using Docker.DotNet;
using Docker.DotNet.Models;
using CjsApi.Services.CodeExecution.Base;
using CjsApi.Services.CodeExecution.Dto;
using CjsApi.Infrastructure.Docker;
using System.Text;

namespace CjsApi.Services.CodeExecution.Executors
{

    public sealed class NodeCodeExecutor : CodeExecutorBase
    {
        public override string Language => "node";

        /// <summary>
        /// Execution pipeline:
        /// 1. Create secure Docker container
        /// 2. Write JavaScript source code
        /// 3. Run script for EACH test case
        /// 4. Collect per-test results
        /// </summary>
        protected override async Task<CodeExecutionResult> ExecuteInDockerAsync(
            string _,
            CodeExecutionRequest request,
            CancellationToken cancellationToken)
        {
            using var docker = DockerClientFactory.Create();

            // Base64 encode source code for safe transport
            var sourceB64 = Convert.ToBase64String(
                Encoding.UTF8.GetBytes(request.SourceCode)
            );

            /* -------------------------------------------------
             * Create secure sandbox container
             * ------------------------------------------------- */
            var container = await docker.Containers.CreateContainerAsync(
                new CreateContainerParameters
                {
                    // Minimal Node.js image
                    Image = "node:20-alpine",

                    // Keep container alive for exec calls
                    Cmd = new[] { "sh", "-c", "sleep infinity" },

                    WorkingDir = "/workspace",

                    Env = new[]
                    {
                    $"SOURCE_B64={sourceB64}"
                    },

                    HostConfig = new HostConfig
                    {
                        AutoRemove = true,
                        NetworkMode = "none",
                        ReadonlyRootfs = true,

                        // RAM-only writable workspace
                        Tmpfs = new Dictionary<string, string>
                        {
                            ["/workspace"] = "rw,size=64m"
                        },

                        CapDrop = new[] { "ALL" },
                        PidsLimit = 64,
                        Memory = 256 * 1024 * 1024,
                        NanoCPUs = 1_000_000_000
                    }
                },
                cancellationToken
            );

            await docker.Containers.StartContainerAsync(
                container.ID,
                new ContainerStartParameters(),
                cancellationToken
            );

            try
            {
                /* -------------------------------------------------
                 * STEP 1: Write JavaScript source file
                 * ------------------------------------------------- */
                var write = await Exec(
                    docker,
                    container.ID,
                    new[]
                    {
                    "sh",
                    "-c",
                    "echo \"$SOURCE_B64\" | base64 -d > /workspace/main.js"
                    },
                    cancellationToken
                );

                if (write.ExitCode != 0)
                    return Fail(write);

                /* -------------------------------------------------
                 * STEP 2: Run for EACH test case
                 * ------------------------------------------------- */
                var testResults = new List<TestCaseResultDto>();

                for (int i = 0; i < request.TestCases.Count; i++)
                {
                    var test = request.TestCases[i];

                    var inputB64 = Convert.ToBase64String(
                        Encoding.UTF8.GetBytes(test.Input)
                    );

                    var run = await Exec(
                        docker,
                        container.ID,
                        new[]
                        {
                        "sh",
                        "-c",
                        $"echo \"{inputB64}\" | base64 -d | node /workspace/main.js"
                        },
                        cancellationToken
                    );

                    var output = run.Output.Trim();
                    var expected = test.ExpectedOutput.Trim();

                    testResults.Add(new TestCaseResultDto
                    {
                        Index = i + 1,
                        Input = test.Input,
                        Output = output,
                        Expected = expected,
                        Passed = output == expected
                    });
                }

                bool allPassed = testResults.All(t => t.Passed);

                return new CodeExecutionResult
                {
                    ExitCode = 0,
                    Output = $"{testResults.Count(t => t.Passed)} / {testResults.Count} test cases passed",
                    TestCaseResults = testResults,
                    SubmissionStatus = allPassed
                        ? Models.SubmissionStatus.ACCEPTED
                        : Models.SubmissionStatus.WRONG_ANSWER
                };
            }
            finally
            {
                // Container removed automatically (AutoRemove=true)
                await docker.Containers.StopContainerAsync(
                    container.ID,
                    new ContainerStopParameters(),
                    cancellationToken
                );
            }
        }

        private static CodeExecutionResult Fail((int ExitCode, string Output) r) =>
            new() { ExitCode = r.ExitCode, Output = r.Output };

        /// <summary>
        /// Executes a command inside the container and captures stdout & stderr
        /// </summary>
        private static async Task<(int ExitCode, string Output)> Exec(
            DockerClient docker,
            string containerId,
            string[] cmd,
            CancellationToken ct)
        {
            var exec = await docker.Exec.ExecCreateContainerAsync(
                containerId,
                new ContainerExecCreateParameters
                {
                    Cmd = cmd,
                    AttachStdout = true,
                    AttachStderr = true
                },
                ct
            );

            using var stream = await docker.Exec.StartAndAttachContainerExecAsync(
                exec.ID,
                false,
                ct
            );

            using var stdout = new MemoryStream();
            using var stderr = new MemoryStream();

            await stream.CopyOutputToAsync(Stream.Null, stdout, stderr, ct);

            var inspect = await docker.Exec.InspectContainerExecAsync(exec.ID, ct);

            return (
                (int)inspect.ExitCode,
                Encoding.UTF8.GetString(stdout.ToArray()) +
                Encoding.UTF8.GetString(stderr.ToArray())
            );
        }
    }
}