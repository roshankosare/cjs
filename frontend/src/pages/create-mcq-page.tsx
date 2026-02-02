import { useNavigate } from "react-router-dom";
import McqForm from "@/components/mcq/mcq-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateMcqPage = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-black tracking-tight">Create New Challenge</h1>
          <p className="text-muted-foreground">
             Design a high-quality multiple choice question for the platform.
          </p>
        </div>

        <div className="mt-8">
           <McqForm onSuccess={() => navigate("/admin/mcq")} />
        </div>
      </div>
    </div>
  );
};

export default CreateMcqPage;
