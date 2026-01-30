import { useAuth } from "@/auth/useAuth";
import CodeEditor from "@/components/editor/code-editor";
import ProblemInfo from "@/components/problem/problem-info";

import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { type ProblemSubmission, type Problem } from "@/types/problem";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
import SubmissionList from "@/components/problem/submission-list";

type Tab = "description" | "submissions";

const SolutionPage = () => {
  const { slug } = useParams();
  const { isAuthenticated, isLoading } = useAuth();

  const [isProblemLoading, setIsProblemLoading] = useState(true);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const [submission, setSubmissions] = useState<ProblemSubmission[]>([]);

  useEffect(() => {
    if (!problem || !isAuthenticated || activeTab !== "submissions") return;

    console.log("Fetching submissions for problem id:", problem.id);
    const fetchSubmissions = async (id: number) => {
      try {
        if (!id ) return;
        const res = await axios.get(
          `http://localhost:5046/api/users/submissions/${id}`,
          {
            withCredentials: true,
          },
        );
        console.log(res.data.data);
        setSubmissions(res.data.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message);
        }
      } finally {
        setIsProblemLoading(false);
      }
    };
    if (problem && isAuthenticated) {
      fetchSubmissions(problem.id);
    }
  }, [problem, isAuthenticated, activeTab]);

  const fetchProblem = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5046/api/problems/${slug}`);
      setProblem(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
      }
    } finally {
      setIsProblemLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setIsProblemLoading(false);
      return;
    }
    fetchProblem();
  }, [fetchProblem, slug]);

  if (isLoading || isProblemLoading) return <Loading />;
  if (!problem) return <NotFound />;

  return (
    <div className="h-[calc(100vh-90px)] flex flex-col sm:flex-row px-2 py-2 gap-2">
      {/* ================= Problem Panel ================= */}
      <div className="flex-1 min-h-0 flex flex-col border rounded-md bg-white">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "description"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "submissions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Submissions
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-3">
          {activeTab === "description" && <ProblemInfo problem={problem} />}

          {activeTab === "submissions" && (
            <>
              {!isAuthenticated ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-600">
                  <p>
                    Please{" "}
                    <Link to={"/signin"} className="text-blue-500">
                      {" " + "sign in"}
                    </Link>{" "}
                    to view your submissions.
                  </p>
                </div>
              ) : (
                <SubmissionList submissions={submission} />
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= Editor Panel ================= */}
      <div className="flex-1 min-h-0 border rounded-md bg-white">
        <CodeEditor isAuthenticated={isAuthenticated} problemId={problem.id} />
      </div>
    </div>
  );
};

export default SolutionPage;
