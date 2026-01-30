import CreateProblemForm from "@/components/admin/create-problem-form";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
import type { AdminProblem } from "@/types/problem";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditProblem = () => {
  const { slug } = useParams();

  const [problem, setProblem] = useState<AdminProblem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5046/api/problems/admin/${slug}`,
          { withCredentials: true }
        );

        console.log("Fetched problem:", res.data.data);

        setProblem(res.data.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data);
        }
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    };

    fetchProblem();
  }, [slug]);

  if (loading) return <Loading />;
  if (!loading && !problem) return <NotFound></NotFound>;
  return <CreateProblemForm problem={problem!} />;
};

export default EditProblem;
