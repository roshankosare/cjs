import { useNavigate, useParams } from "react-router-dom";
import McqForm from "@/components/mcq/mcq-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { mcqService } from "@/service/mcqService";
import type { McqQuestionWithAnswer } from "@/types/mcq";

const EditMcqPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState<McqQuestionWithAnswer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchQuestion = async () => {
      try {
        const data = await mcqService.getQuestion(parseInt(id));
        setQuestion(data);
      } catch (error) {
        console.error("Failed to fetch question", error);
        navigate("/admin/mcq");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id, navigate]);

  if (loading) return (
     <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
     </div>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/mcq")}
          className="text-muted-foreground hover:text-foreground pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to MCQ Repository
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Edit Challenge</h1>
          <p className="text-muted-foreground">
             Update the details and options for this question.
          </p>
        </div>

        <div className="mt-8">
           {question && (
             <McqForm 
                initialData={question} 
                isEditing={true} 
                questionId={question.id}
                onSuccess={() => navigate("/admin/mcq")} 
             />
           )}
        </div>
      </div>
    </div>
  );
};

export default EditMcqPage;
