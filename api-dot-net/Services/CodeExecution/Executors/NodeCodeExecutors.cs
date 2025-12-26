using CjsApi.Services.CodeExecution.Base;
using CjsApi.Services.CodeExecution.Dto;

namespace CjsApi.Services.CodeExecution.Executors
{

    public sealed class NodeCodeExecutor : CodeExecutorBase
    {
        public override string Language => "node";

        protected override async Task<CodeExecutionResult> ExecuteInDockerAsync(
            string workDir,
            CodeExecutionRequest request,
            CancellationToken cancellationToken)
        {
            // docker run node:20
            // node main.js
            return new CodeExecutionResult
            {
                Output = "Hello from Node",
                ExitCode = 0
            };
        }
    }
}