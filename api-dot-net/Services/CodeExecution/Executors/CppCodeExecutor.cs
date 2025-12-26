using Docker.DotNet;
using Docker.DotNet.Models;
using CjsApi.Services.CodeExecution.Base;
using CjsApi.Services.CodeExecution.Dto;
using CjsApi.Infrastructure.Docker;
using System.Text;

namespace CjsApi.Services.CodeExecution.Executors;

/// <summary>
/// Executes C++ source code inside a secure Docker sandbox
/// and evaluates it against multiple test cases.
/// </summary>
public sealed class CppCodeExecutor : CodeExecutorBase
{
    public override string Language => "cpp";

    /// <summary>
    /// Execution pipeline:
    /// 1. Create secure Docker container
    /// 2. Write source code
    /// 3. Compile ONCE
    /// 4. Run binary for EACH test case
    /// 5. Collect per-test results
    /// </summary>
    protected override async Task<CodeExecutionResult> ExecuteInDockerAsync(
        string _,
        CodeExecutionRequest request,
        CancellationToken cancellationToken)
    {
        using var docker = DockerClientFactory.Create();

        // Encode source code safely
        var sourceB64 = Convert.ToBase64String(
            Encoding.UTF8.GetBytes(request.SourceCode)
        );

        /* -------------------------------------------------
         * Create secure sandbox container
         * ------------------------------------------------- */
        var container = await docker.Containers.CreateContainerAsync(
            new CreateContainerParameters
            {
                Image = "frolvlad/alpine-gxx",
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

                    // RAM-only writable + executable workspace
                    Tmpfs = new Dictionary<string, string>
                    {
                        ["/workspace"] = "rw,exec,size=64m"
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
             * STEP 1: Write source code
             * ------------------------------------------------- */
            var write = await Exec(
                docker,
                container.ID,
                new[]
                {
                    "sh",
                    "-c",
                    "echo \"$SOURCE_B64\" | base64 -d > /workspace/main.cpp"
                },
                cancellationToken
            );

            if (write.ExitCode != 0)
                return Fail(write);

            /* -------------------------------------------------
             * STEP 2: Compile ONCE
             * ------------------------------------------------- */
            var compile = await Exec(
                docker,
                container.ID,
                new[]
                {
                    "g++",
                    "/workspace/main.cpp",
                    "-O2",
                    "-std=c++17",
                    "-o",
                    "/workspace/main"
                },
                cancellationToken
            );

            if (compile.ExitCode != 0)
                return Fail(compile);

            /* -------------------------------------------------
             * STEP 3: Run for EACH test case
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
                        $"echo \"{inputB64}\" | base64 -d | /workspace/main"
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

                // Optional: stop on first failure (like Codeforces)
                // if (output != expected) break;
            }
        

            return new CodeExecutionResult
            {
                ExitCode = 0,
                Output = $"{testResults.Count(t => t.Passed)} / {testResults.Count} test cases passed",
                TestCaseResults = testResults
            };
        }
        finally
        {
            await docker.Containers.StopContainerAsync(
                container.ID,
                new ContainerStopParameters(),
                cancellationToken
            );
        }
    }

    /// <summary>
    /// Helper for returning execution failures
    /// </summary>
    private static CodeExecutionResult Fail((int ExitCode, string Output) r) =>
        new() { ExitCode = r.ExitCode, Output = r.Output };

    /// <summary>
    /// Executes a command inside the container and captures output
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
            (int)inspect.ExitCode ,
            Encoding.UTF8.GetString(stdout.ToArray()) +
            Encoding.UTF8.GetString(stderr.ToArray())
        );
    }
}
