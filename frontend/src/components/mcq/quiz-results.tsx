import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Trophy, AlertCircle, CheckCircle2, XCircle, 
  ChevronLeft, Brain, RotateCcw, ListOrdered,
  FileText, Lightbulb, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { QuizResult, McqAttemptDetail } from '../../types/mcq';
import { mcqService } from '../../service/mcqService';

interface QuizResultsProps {
  sessionId?: number;
  onStartNewQuiz?: () => void;
}

const QuizResults = ({ sessionId: propSessionId, onStartNewQuiz }: QuizResultsProps) => {
  const { sessionId: paramSessionId } = useParams();
  const navigate = useNavigate();
  const sessionId = propSessionId || (paramSessionId ? parseInt(paramSessionId) : 0);
  
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId) {
      loadResults();
    }
  }, [sessionId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const resultData = await mcqService.getQuizResult(sessionId);
      setResult(resultData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNew = () => {
    if (onStartNewQuiz) {
      onStartNewQuiz();
    } else {
      navigate('/mcq');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Analyzing your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-xl mx-auto border-destructive/20 bg-destructive/5 overflow-hidden rounded-[2rem]">
         <CardContent className="p-10 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h3 className="text-xl font-bold">Sync Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={loadResults} variant="outline" className="rounded-xl border-destructive/50">Retry</Button>
         </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const { session, attempts } = result;
  const isPassed = session.scorePercentage >= 60;

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Summary Header Card */}
      <div className="relative overflow-hidden group rounded-[3rem] border shadow-2xl">
         <div className={cn(
           "absolute inset-0 bg-gradient-to-br transition-all duration-500",
           isPassed ? "from-green-500/10 to-blue-500/10" : "from-rose-500/10 to-amber-500/10"
         )} />
         
         <div className="relative p-10 flex flex-col items-center text-center">
            <div className={cn(
               "w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transition-transform group-hover:scale-110",
               isPassed ? "bg-green-500 text-white" : "bg-zinc-800 text-zinc-100"
            )}>
               {isPassed ? <Trophy className="w-12 h-12" /> : <Brain className="w-12 h-12" />}
            </div>
            
            <h1 className="text-4xl font-black mb-2 tracking-tight">
               {isPassed ? "Outstanding Performance!" : "Valuable Practice Session"}
            </h1>
            <p className="text-muted-foreground font-medium mb-8 max-w-lg">
               {isPassed ? "You've demonstrated great mastery over the material. Keep up the momentum!" : "Every challenge is a learning opportunity. Review the rationales below to grow."}
            </p>

            <div className="grid grid-cols-3 gap-8 w-full max-w-2xl px-8 border-t border-dashed border-border/20 pt-8">
               <div className="space-y-1">
                  <div className="text-3xl font-black">{Math.round(session.scorePercentage)}%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Accuracy Score</div>
               </div>
               <div className="space-y-1 border-x border-border/10 px-4">
                  <div className="text-3xl font-black text-green-500">{session.correctAnswers}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Correct Hits</div>
               </div>
               <div className="space-y-1">
                  <div className="text-3xl font-black text-rose-500">{session.incorrectAnswers}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Flaws Identified</div>
               </div>
            </div>
         </div>
      </div>

      {/* Navigation Bars */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[2rem] border shadow-sm">
         <Button variant="ghost" className="rounded-xl font-bold" onClick={() => navigate('/mcq/history')}>
            <ChevronLeft className="w-4 h-4 mr-2" /> All History
         </Button>
         <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-2 font-bold" onClick={() => navigate('/mcq')}>
               <RotateCcw className="w-4 h-4 mr-2" /> Start New
            </Button>
            <Button className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20" onClick={() => window.print()}>
               <FileText className="w-4 h-4 mr-2" /> Print Results
            </Button>
         </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="space-y-6">
         <div className="flex items-center gap-3 font-black text-2xl px-2">
            <div className="w-2 h-8 bg-primary rounded-full" />
            Review Analysis
         </div>
         
         <div className="grid gap-6">
            {attempts.map((attempt: McqAttemptDetail, index: number) => (
              <div key={attempt.questionId} className="group">
                <Card className={cn(
                  "overflow-hidden rounded-[2.5rem] border-2 transition-all hover:shadow-xl",
                  attempt.isCorrect ? "border-green-500/10 hover:border-green-500/30" : "border-rose-500/10 hover:border-rose-500/30"
                )}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className={cn(
                        "w-full md:w-20 p-6 flex items-center justify-center font-black text-2xl border-b md:border-b-0 md:border-r border-dashed shrink-0",
                        attempt.isCorrect ? "bg-green-500/5 text-green-600" : "bg-rose-500/5 text-rose-600"
                      )}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 p-8 space-y-6">
                        <div className="text-xl font-bold leading-relaxed">
                          {attempt.question}
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                           <div className={cn(
                             "px-5 py-2.5 rounded-xl text-sm font-black border flex items-center gap-2 shadow-sm",
                             attempt.isCorrect ? "bg-green-500 text-white border-green-600" : "bg-rose-500 text-white border-rose-600"
                           )}>
                              {attempt.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              Yours: {attempt.selectedOption}
                           </div>
                           
                           {!attempt.isCorrect && (
                             <div className="px-5 py-2.5 rounded-xl text-sm font-black border-2 border-green-500 text-green-600 flex items-center gap-2 bg-green-50/50 shadow-sm">
                                <CheckCircle2 className="w-4 h-4" /> Correct: {attempt.correctOption}
                             </div>
                           )}
                        </div>

                        <div className="bg-muted/30 p-8 rounded-[2rem] border border-dashed relative">
                           <Lightbulb className="absolute -top-3 -right-3 w-10 h-10 text-yellow-500 bg-background rounded-2xl p-2 border shadow-sm" />
                           <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 opacity-60">Success Logic / Rationale</div>
                           <p className="text-base font-medium leading-relaxed italic text-zinc-600">
                              {attempt.explanation}
                           </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
         </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-10 flex justify-center">
         <Button size="lg" className="h-16 px-12 rounded-[2rem] font-black text-lg gap-3 shadow-2xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95" onClick={handleStartNew}>
            Take Next Challenge <RotateCcw className="w-6 h-6" />
         </Button>
      </div>

    </div>
  );
};

export default QuizResults;