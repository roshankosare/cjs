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
import { FaCircleCheck, FaCircleUp, FaPlay } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Language = "node" | "java" | "cpp";

type ExecutionResult = {
  jobId: string;
  status: string;
  result: {
    exitCode: number;
    output: string;
    testCaseResults: { index: number; passed: boolean }[];
  };
};

type Props = {
  isAuthenticated: boolean;
  problemId: number;
};

const CodeEditor: React.FC<Props> = ({ isAuthenticated, problemId }) => {
  const [language, setLanguage] = useState<Language>("node");
  const [code, setCode] = useState(BOILERPLATE.node);

  const [actionDisable, setActionDisable] = useState(false);
  const [showRunSpinner, setShowRunSpinner] = useState(false);
  const [showSubmitSpinner, setShowSubmitSpinner] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<"test" | "ai">("test");

  const [canGetAiFeedback, setCanGetAiFeedback] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  /* ---------------- RUN ---------------- */
  const handleRun = async () => {
    try {
      setActionDisable(true);
      setShowRunSpinner(true);
      setShowProcessing(true);
      setShowResult(false);
      setCanGetAiFeedback(false);
      setAiFeedback(null);
      setActiveTab("test");

      const res = await axios.post(
        "http://localhost:5046/api/code/run",
        { language, sourceCode: code, problemId },
        { withCredentials: true },
      );

      pollStatus(res.data.data, false);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
      resetAction();
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      setActionDisable(true);
      setShowSubmitSpinner(true);
      setShowProcessing(true);
      setShowResult(false);
      setAiFeedback(null);
      setActiveTab("test");

      const res = await axios.post(
        "http://localhost:5046/api/code/submit",
        { language, sourceCode: code, problemId },
        { withCredentials: true },
      );

      pollStatus(res.data.data, true);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
      resetAction();
    }
  };

  /* ---------------- POLLING ---------------- */
  const pollStatus = (jobId: string, isSubmit: boolean) => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5046/api/code/status/${jobId}`,
          { withCredentials: true },
        );

        const status = res.data.data.status?.toUpperCase();

        if (status === "COMPLETED" || status === "FAILED") {
          clearInterval(pollingRef.current!);

          setExecutionResult(res.data.data);
          setShowResult(true);
          setIsMaximized(true);

          if (isSubmit) setCanGetAiFeedback(true);

          resetAction();
        }
      } catch {
        clearInterval(pollingRef.current!);
        resetAction();
      }
    }, 1500);
  };

  const resetAction = () => {
    setActionDisable(false);
    setShowRunSpinner(false);
    setShowSubmitSpinner(false);
    setShowProcessing(false);
  };

  /* ---------------- AI FEEDBACK ---------------- */
  const handleAiFeedback = async () => {
    if (!executionResult) return;

    try {
      setIsAiLoading(true);
      setActiveTab("ai");
      setIsMaximized(true);

      const res = await axios.post(
        "http://localhost:5046/api/ai/code-review",
        {
          problemId,
          language,
          code,
          result: executionResult.result,
        },
        { withCredentials: true },
      );

      setAiFeedback(res.data.feedback);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }

      setAiFeedback("Failed to fetch AI feedback");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col border rounded-lg bg-background p-2 gap-y-2">
      {/* Header */}
      <Select
        value={language}
        onValueChange={(lang) => {
          setLanguage(lang as Language);
          setCode(BOILERPLATE[lang]);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="node">Node.js</SelectItem>
          <SelectItem value="cpp">C++</SelectItem>
          <SelectItem value="java">Java</SelectItem>
        </SelectContent>
      </Select>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language === "node" ? "javascript" : language}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            wordWrap: "on",
          }}
        />
      </div>

      {/* Actions */}
      {isAuthenticated ? (
        <div className="flex gap-2">
          <Button
            className="text-xs"
            disabled={actionDisable}
            onClick={handleRun}
            variant={"outline"}
          >
            {showRunSpinner ? (
              <Spinner />
            ) : (
              <FaPlay className="!w-[12px] !h-[12px]" />
            )}{" "}
            Run
          </Button>

          <Button
            className="text-xs"
            disabled={actionDisable}
            onClick={handleSubmit}
            variant={"outline"}
          >
            {showSubmitSpinner ? (
              <Spinner />
            ) : (
              <FaCircleUp className="!w-[12px] !h-[12px]" />
            )}{" "}
            Submit
          </Button>

          <Button
            className="text-xs"
            disabled={!canGetAiFeedback || isAiLoading}
            onClick={handleAiFeedback}
          >
            {isAiLoading && <Spinner />} AI Feedback
          </Button>

          {showProcessing && (
            <p className="text-xs text-yellow-600">
              Execution is in process...
            </p>
          )}
        </div>
      ) : (
        <div className="text-xs px-2 py-2 bg-gray-200 flex gap-x-1">
          You need to
          <Link to="/signin" className="text-blue-600">
            Login
          </Link>{" "}
          to run or submit
        </div>
      )}

      {/* Result Panel */}
      {/* Result Panel */}
      <div
        className={`border rounded transition-all flex flex-col ${
          isMaximized ? "h-[50%]" : "h-12"
        }`}
      >
        {/* Tabs */}
        <div className="flex justify-between border-b px-2 py-1 shrink-0">
          <div className="flex gap-4">
            <button
              className={`${
                activeTab === "test" ? "font-bold" : "text-gray-400"
              } text-xs`}
              onClick={() => setActiveTab("test")}
            >
              Test Result
            </button>

            <button
              className={`${
                activeTab === "ai" ? "font-bold" : "text-gray-400"
              } text-xs`}
              disabled={!aiFeedback}
              onClick={() => setActiveTab("ai")}
            >
              AI Feedback
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMaximized((v) => !v)}
          >
            {isMaximized ? <MinimizeIcon /> : <MaximizeIcon />}
          </Button>
        </div>

        {/* Content */}
        {isMaximized && (
          <div className="flex-1 overflow-hidden p-2 text-sm">
            {/* SINGLE SCROLL CONTAINER */}
            <div className="h-full overflow-y-auto overflow-x-hidden break-words">
              {activeTab === "test" &&
                showResult &&
                executionResult?.result && (
                  <>
                    {executionResult.result.exitCode !== 0 ? (
                      <p className="text-red-500 whitespace-pre-wrap">
                        {executionResult.result.output}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {executionResult.result.testCaseResults.map((tc) => (
                          <div
                            key={tc.index}
                            className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded"
                          >
                            {tc.passed ? (
                              <FaCircleCheck className="text-green-600" />
                            ) : (
                              <MdCancel className="text-red-600" />
                            )}
                            Test Case {tc.index}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

              {activeTab === "ai" && (
                <>
                  {isAiLoading && (
                    <p className="text-yellow-600">
                      AI is analyzing your solution...
                    </p>
                  )}

                  {!isAiLoading && aiFeedback && (
                    <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {aiFeedback}
                      </ReactMarkdown>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
