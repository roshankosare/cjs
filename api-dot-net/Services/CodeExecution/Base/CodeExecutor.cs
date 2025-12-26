using CjsApi.Services.CodeExecution.Dto;

namespace CjsApi.Services.CodeExecution.Base
{

    public abstract class CodeExecutorBase
    {

        public abstract string Language { get; }

        public async Task<CodeExecutionResult> ExecuteAsync(
        CodeExecutionRequest request,
        CancellationToken cancellationToken = default)
        {
            ValidateRequest(request);

            var workDir = await PrepareWorkspaceAsync(request, cancellationToken);

            try
            {
                return await ExecuteInDockerAsync(workDir, request, cancellationToken);
            }
            finally
            {
                await CleanupAsync(workDir);
            }
        }

        protected abstract Task<CodeExecutionResult> ExecuteInDockerAsync(
            string workDir,
            CodeExecutionRequest request,
            CancellationToken cancellationToken);

        protected virtual void ValidateRequest(CodeExecutionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.SourceCode))
                throw new ArgumentException("Source code is empty");
        }

        protected virtual Task<string> PrepareWorkspaceAsync(
            CodeExecutionRequest request,
            CancellationToken cancellationToken)
        {
            // create temp directory, write source file
            return Task.FromResult("temp-path");
        }

        protected virtual Task CleanupAsync(string workDir)
        {
            // delete temp files
            return Task.CompletedTask;
        }
    }
}