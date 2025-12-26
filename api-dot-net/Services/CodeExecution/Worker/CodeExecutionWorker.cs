
namespace CjsApi.Services.CodeExecution.Worker
{

    using System.Threading.Channels;
    using CjsApi.Services.CodeExecution.Dto;
    using CjsApi.Services.CodeExecution.Factory;

    public class CodeExecutionWorker : BackgroundService
    {
        private readonly Channel<(ExecutionJob Job, CodeExecutionRequest Request)> _queue =
            Channel.CreateUnbounded<(ExecutionJob, CodeExecutionRequest)>();

        private readonly ICodeExecutorFactory _executorFactory;

        public CodeExecutionWorker(ICodeExecutorFactory executorFactory)
        {
            _executorFactory = executorFactory;
        }

        public void Enqueue(ExecutionJob job, CodeExecutionRequest request)
        {
            _queue.Writer.TryWrite((job, request));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await foreach (var (job, request) in _queue.Reader.ReadAllAsync(stoppingToken))
            {
                try
                {
                    job.Status = ExecutionStatus.Running;

                    var executor = _executorFactory.GetExecutor(request.Language);
                    job.Result = await executor.ExecuteAsync(request, stoppingToken);

                    job.Status = ExecutionStatus.Completed;
                }
                catch (Exception ex)
                {
                    job.Status = ExecutionStatus.Failed;
                    job.Error = ex.Message;
                }
            }
        }
    }

}