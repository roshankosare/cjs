import Loading from "@/components/loading";
import ProblemList from "@/components/problem/problem-list";
import Responsive from "@/components/responsive";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Problem } from "@/types/problem";
import axios, { AxiosError } from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

const ProblemListPage = () => {
  const [problems, setProblems] = useState<
    Pick<Problem, "id" | "title" | "difficulty" | "slug">[]
  >([]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("ALL");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);

        const params: any = {
          page,
          pageSize: PAGE_SIZE,
        };

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (difficulty && difficulty !== "ALL") {
          params.difficulty = difficulty;
        }

        const res = await axios.get("http://localhost:5046/api/problems", {
          params,
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
  }, [page, debouncedSearch, difficulty]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Responsive className="flex flex-col gap-y-8 w-full items-center pb-10">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-4 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Problems
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Sharpen your coding skills with our collection of algorithm challenges.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-5xl items-center justify-between">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-[180px]">
          <Select
            value={difficulty}
            onValueChange={(val) => {
                setDifficulty(val);
                setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Problem List */}
      <div className="w-full flex justify-center">
         {loading ? (
            <Loading /> 
         ) : (
            <ProblemList problems={problems} />
         )}
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex items-center gap-4 mt-4">
            <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            Previous
            </button>

            <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
            </span>

            <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            Next
            </button>
        </div>
      )}
    </Responsive>
  );
};

export default ProblemListPage;
