import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { McqQuestion, QuizSession, McqAttemptResult } from '../../types/mcq';
import { mcqService } from '../../service/mcqService';

interface McqQuizProps {
  sessionId: number;
  onComplete: (sessionId: number) => void;
}

const McqQuiz = ({ sessionId, onComplete }: McqQuizProps) => {
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<McqAttemptResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [sessionId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await mcqService.getQuizQuestions(sessionId);
      setQuestions(questionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption) return;

    setSubmitting(true);
    try {
      const result = await mcqService.submitAnswer({
        questionId: questions[currentQuestionIndex].id,
        selectedOption,
        quizSessionId: sessionId,
      });

      setLastResult(result);
      setSession(result.quizSession);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedOption('');
    setLastResult(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (session?.isCompleted) {
      onComplete(sessionId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-muted-foreground">No questions available for this quiz.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Counter */}
      <div className="text-center text-sm text-gray-600">
        Question {currentQuestionIndex + 1} of {questions.length}
        {session && (
          <span className="ml-4">
            Score: {session.correctAnswers}/{session.correctAnswers + session.incorrectAnswers} 
            ({session.scorePercentage.toFixed(1)}%)
          </span>
        )}
      </div>

      {!showResult ? (
        /* Question Card */
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">{currentQuestion.category}</span>
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">{currentQuestion.difficulty}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {['A', 'B', 'C', 'D'].map((option) => (
              <div
                key={option}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-input'
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    selectedOption === option
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground'
                  }`}>
                    {option}
                  </div>
                  <div className="flex-1">
                    {currentQuestion[`option${option}` as keyof McqQuestion]}
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption || submitting}
              className="w-full mt-6"
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Result Card */
        <Card>
          <CardHeader>
            <CardTitle className={`text-lg ${lastResult?.isCorrect ? 'text-green-600' : 'text-destructive'}`}>
              {lastResult?.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-medium mb-2">Correct Answer: {lastResult?.correctOption}</div>
              <div className="text-muted-foreground">{lastResult?.explanation}</div>
            </div>

            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default McqQuiz;