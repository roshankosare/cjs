
using System.Threading.Tasks;
using CjsApi.Dto.RequestDto;
using CjsApi.Services.CodeExecution.Base;
using CjsApi.Services.CodeExecution.Dto;
using CjsApi.Services.CodeExecution.Factory;
using CjsApi.Services.CodeExecution.Store;
using CjsApi.Services.CodeExecution.Worker;

namespace CjsApi.Services
{

    public class CodeExecutionService
    {
        private readonly ExecutionJobStore _jobStore;
        private readonly CodeExecutionWorker _worker;

        public CodeExecutionService(
            ExecutionJobStore jobStore,
            CodeExecutionWorker worker)
        {
            _jobStore = jobStore;
            _worker = worker;
        }

        public string Submit(CodeRunRequestDto dto)
        {
            var job = _jobStore.CreateJob();

            Console.WriteLine($"📥 Submit called. JobId = {job.JobId}");

            List<TestCaseDto> list = new List<TestCaseDto>();

            list.Add(new TestCaseDto("roshan", "hello roshan"));
            list.Add(new TestCaseDto("rk", "hello rk"));
            var request = new CodeExecutionRequest
            {
                Language = dto.Language,
                SourceCode = dto.SourceCode,
                TestCases = list
            };

            _worker.Enqueue(job, request);

            return job.JobId;
        }

        public ExecutionJob? GetStatus(string jobId)
            => _jobStore.GetJob(jobId);
    }
}