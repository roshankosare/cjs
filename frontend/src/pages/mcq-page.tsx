import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import McqQuiz from "@/components/mcq/mcq-quiz";
import QuizResults from "@/components/mcq/quiz-results";
import type { StartQuizDto, QuizSession } from "../types/mcq";
import { mcqService } from "../service/mcqService";

type ViewState = "start" | "quiz" | "results";

const McqPage = () => {
  const [viewState, setViewState] = useState<ViewState>("start");
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    mcqService.getCategories().then(setAvailableCategories).catch(console.error);
  }, []);

  const [quizConfig, setQuizConfig] = useState<StartQuizDto>({
    questionCount: 10,
    category: "",
    difficulty: "",
  });

  const handleStartQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const session = await mcqService.startQuiz(quizConfig);
      setCurrentSession(session);
      setViewState("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (sessionId: number) => {
    console.log(sessionId);
    setViewState("results");
  };

  const handleStartNewQuiz = () => {
    setViewState("start");
    setCurrentSession(null);
    setError("");
  };

  if (viewState === "quiz" && currentSession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <McqQuiz
          sessionId={currentSession.id}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  if (viewState === "results" && currentSession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <QuizResults
          sessionId={currentSession.id}
          onStartNewQuiz={handleStartNewQuiz}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            MCQ Practice
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge with our interactive quiz system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start New Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="5"
                max="50"
                value={quizConfig.questionCount}
                onChange={(e) =>
                  setQuizConfig((prev) => ({
                    ...prev,
                    questionCount: parseInt(e.target.value) || 10,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select
                value={quizConfig.category ?? "all"}
                onValueChange={(value) =>
                  setQuizConfig((prev) => ({
                    ...prev,
                    category: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty (Optional)</Label>
              <Select
                value={quizConfig.difficulty ?? "all"}
                onValueChange={(value) =>
                  setQuizConfig((prev) => ({
                    ...prev,
                    difficulty: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleStartQuiz}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Starting Quiz..." : "Start Quiz"}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => (window.location.href = "/mcq/history")}
              >
                View Quiz History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default McqPage;
