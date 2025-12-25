import CodeEditor from "@/components/editor/code-editor";
import ProblemInfo from "@/components/problem/problem-info";
import { problems } from "@/mock/problems";

const SolutionPage = () => {
  return (
    <div className="flex flex-col sm:flex-row w-full px-4 py-4 gap-x-4 gap-y-4 ">
      <div className="w-2/4">
        <ProblemInfo problem={problems[0]} />
      </div>
      <div className="w-2/4">
        <CodeEditor />
      </div>
    </div>
  );
};

export default SolutionPage;
