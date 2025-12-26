import type { Problem } from "@/types/problem";
import { Card } from "../ui/card";

type Props = {
  problem: Problem;
};

const ProblemInfo: React.FC<Props> = ({ problem }) => {
  return (
    <Card className="w-full min-h-full max-h-ufll flex flex-col gap-y-4 px-4 sm:px-8 py-4">
      <p className="font-bold text-xl sm:text-3xl">{problem.title}</p>

      <div className="flex flex-wrap gap-4">
        {problem.tags.map((t, i) => (
          <div
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
            key={i}
          >
            {t}
          </div>
        ))}
      </div>

      <p className="text-gray-600">{problem.description}</p>

      <p className="font-bold text-lg"> Sample Test Cases</p>
      <div className="flex flex-col gap-y-2">
        {problem.sampleTestCases.map((s, i) => (
          <div
            className="bg-gray-200 text-gray-700 px-3 py-2 flex flex-col gap-y-2 rounded-md"
            key={i}
          >
            <p>{`Input: ${s.input}`}</p>
            <p>{`Output: ${s.output}`}</p>
            {s.explanation && <p>{`Explanation: ${s.explanation}`}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProblemInfo;
