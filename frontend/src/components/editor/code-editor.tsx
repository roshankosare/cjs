import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { BOILERPLATE } from "./constant";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

type Language = "node" | "java" | "cpp";

type ExecutionResult = {
  jobId: string;
  result: {
    exitCode: number;
    output: string;
    testCaseResults: { index: number; passed: boolean }[];
  };
};

type Props = {
  isAuthenticated: boolean;
};

const CodeEditor: React.FC<Props> = ({ isAuthenticated }) => {
  const [language, setLanguage] = useState<Language>("node");
  const [code, setCode] = useState(BOILERPLATE.node);
  const [actionDisable, setActionDisable] = useState(false);
  const [showRunSpinner, setShowRunSpinner] = useState(false);
  // const [showSubmitSpinner, setShowSubmitSpinner] = useState(false);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const pollingRef = useRef<number | null>(null);
  console.log(executionResult);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleRun = async () => {
    try {
      setActionDisable(true);
      setShowRunSpinner(true);
      setShowResult(false);

      const res = await axios.post(
        "http://localhost:5046/api/code/run",
        { language, sourceCode: code },
        { withCredentials: true }
      );

      const jobId = res.data.data;

      pollingRef.current = setInterval(async () => {
        try {
          const res = await axios.get(
            `http://localhost:5046/api/code/status/${jobId}`,
            { withCredentials: true }
          );

          const status = res.data.data.status;

          if (status === "Completed" || status === "Failed") {
            clearInterval(pollingRef.current!);
            setExecutionResult(res.data.data);
            console.log(res.data.data);
            setShowResult(true);

            setIsMaximized(true);
            setActionDisable(false);
            setShowRunSpinner(false);
          }
        } catch {
          clearInterval(pollingRef.current!);
        }
      }, 1500);
    } catch (error) {
      setActionDisable(false);
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
    }
  };

  const handleSubmit = () => {
    console.log("Submit code:", { language, code });
  };

  return (
    <div className="w-full h-full min-h-full max-h-full flex flex-col border rounded-lg bg-background p-2 gap-y-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-1">
        <div className="w-48">
          <Select
            value={language}
            onValueChange={(lang) => {
              setLanguage(lang as Language);
              setCode(BOILERPLATE[lang]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="node">Node.js</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>

      {/* Actions */}
      {isAuthenticated && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRun}
            disabled={actionDisable}
            className="bg-blue-600 text-white w-20 text-xs h-7"
          >
            {showRunSpinner && <Spinner />}
            Run
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 text-white w-20 text-xs h-7"
          >
            Submit
          </Button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-gray-200 px-2 py-2 rounded">
          <p className="text-xs text-gray-700 font-semibold">
            You need to{" "}
            <Link className="text-blue-600" to="/signin">
              Log in
            </Link>{" "}
            to Run or Submit code
          </p>
        </div>
      )}

      {/* Result Panel */}
      <div
        className={`border rounded transition-all duration-300 overflow-hidden ${
          isMaximized ? "h-[50%]" : "h-12"
        }`}
      >
        <div className="flex items-center justify-between px-2 py-1 border-b">
          <p className="font-bold text-sm">Test Result</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMaximized((v) => !v)}
          >
            {isMaximized ? (
              <MinimizeIcon size={16} />
            ) : (
              <MaximizeIcon size={16} />
            )}
          </Button>
        </div>

        <div className="p-2 overflow-y-auto h-full text-xs">
          {/* Runtime / Compilation Error */}
          {executionResult &&
            executionResult.result.exitCode !== 0 &&
            showResult && (
              <p className="text-red-400 whitespace-pre-wrap">
                {executionResult.result.output}
              </p>
            )}

          {/* Test Case Results */}
          {executionResult &&
            executionResult.result.exitCode === 0 &&
            executionResult.result.testCaseResults.length > 0 &&
            showResult && (
              <div className="flex flex-wrap gap-2">
                {executionResult.result.testCaseResults.map((tc) => (
                  <span
                    key={tc.index}
                    className={`px-2 py-2 rounded text-white ${
                      tc.passed ? "bg-green-600" : "bg-red-500"
                    }`}
                  >
                    Test Case {`${tc.index}`}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
