using CjsApi.Services.CodeExecution.Base;

namespace CjsApi.Services.CodeExecution.Factory
{


    public interface ICodeExecutorFactory
    {
        CodeExecutorBase GetExecutor(string language);
    }

}