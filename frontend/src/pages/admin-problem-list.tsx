import Loading from "@/components/loading";
import ProblemList from "@/components/problem/problem-list";
import Responsive from "@/components/responsive";
import type { Problem } from "@/types/problem";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

const AdminProblemListPage = () => {
  const [problems, setProblems] = useState<
    Pick<Problem, "id" | "title" | "difficulty" | "slug">[]
  >([]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:5046/api/problems", {
          params: { page, pageSize: PAGE_SIZE },
        });

        setProblems(res.data.data.problems);
        setTotal(res.data.data.total);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading) return <Loading />;

  return (
    <Responsive className="flex flex-col gap-y-4 w-full items-center">
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {[
          "Array",
          "String",
          "Stack",
          "Queue",
          "Linked List",
          "Tree",
          "Graph",
          "Dynamic programming",
        ].map((tag, i) => (
          <div
            className="bg-secondary text-secondary-foreground px-2 py-1 text-center rounded-sm "
            key={i}
          >
            {tag}
          </div>
        ))}
        <ProblemList problems={problems} admin={true} />
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Responsive>
  );
};

export default AdminProblemListPage;
