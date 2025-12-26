
using System.Collections.Concurrent;
using CjsApi.Services.CodeExecution.Dto;
namespace CjsApi.Services.CodeExecution.Store
{


    public class ExecutionJobStore
    {
        private readonly ConcurrentDictionary<string, ExecutionJob> _jobs = new();

        public ExecutionJob CreateJob()
        {
            var job = new ExecutionJob();
            _jobs[job.JobId] = job;
            return job;
        }

        public ExecutionJob? GetJob(string jobId)
            => _jobs.TryGetValue(jobId, out var job) ? job : null;
    }

}