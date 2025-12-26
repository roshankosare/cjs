using System.Text.Json.Serialization;

namespace CjsApi.Services.CodeExecution.Dto
{


    public enum ExecutionStatus
    {
        Pending,
        Running,
        Completed,
        Failed
    }

    public class ExecutionJob
    {
        public string JobId { get; init; } = Guid.NewGuid().ToString();

         [JsonConverter(typeof(JsonStringEnumConverter))]
        public ExecutionStatus Status { get; set; } = ExecutionStatus.Pending;

       
        public CodeExecutionResult? Result { get; set; }
        public string? Error { get; set; }
    }

}