using CjsApi.Services.CodeExecution.Base;
using CjsApi.Services.CodeExecution.Dto;

namespace CjsApi.Services.CodeExecution.Executors
{


    public sealed class JavaCodeExecutor : CodeExecutorBase
    {
        public override string Language => "java";

        protected override async Task<CodeExecutionResult> ExecuteInDockerAsync(
            string workDir,
            CodeExecutionRequest request,
            CancellationToken cancellationToken)
        {
            // docker run openjdk:21
            // javac Main.java
            // java Main
            return new CodeExecutionResult
            {
                Output = "Hello from Java",
                ExitCode = 0
            };
        }
    }

}