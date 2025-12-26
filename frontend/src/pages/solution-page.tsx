import { useAuth } from "@/auth/useAuth";
import CodeEditor from "@/components/editor/code-editor";
import ProblemInfo from "@/components/problem/problem-info";
import { problems } from "@/mock/problems";

const SolutionPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  return (
    <div className="flex flex-col sm:flex-row w-full px-2 py-2 gap-x-2 gap-y-2 ">
      <div className="w-full sm:w-2/4 sm:h-[520px] lg:h-[620px] xl:[740px]">
        <ProblemInfo problem={problems[0]} />
      </div>
      <div className="w-full sm:w-2/4 sm:h-[520px] lg:h-[620px] xl:[740px]">
        <CodeEditor isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
};

export default SolutionPage;
