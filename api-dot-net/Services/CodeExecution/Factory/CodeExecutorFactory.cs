using CjsApi.Services.CodeExecution.Base;

namespace CjsApi.Services.CodeExecution.Factory
{

    public class CodeExecutorFactory : ICodeExecutorFactory
    {
        private readonly IEnumerable<CodeExecutorBase> _executors;

        public CodeExecutorFactory(IEnumerable<CodeExecutorBase> executors)
        {
            _executors = executors;
        }

        public CodeExecutorBase GetExecutor(string language)
        {
            var executor = _executors.FirstOrDefault(
                e => e.Language.Equals(language, StringComparison.OrdinalIgnoreCase));

            if (executor == null)
                throw new NotSupportedException($"Language {language} not supported");

            return executor;
        }
    }


}