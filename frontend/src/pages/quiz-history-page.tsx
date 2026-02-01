import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mcqService } from '@/service/mcqService';
import type { QuizSession } from '@/types/mcq';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, Calendar, Award, CheckCircle2, 
  XCircle, Clock, ChevronRight,
  Brain, Loader2, Sparkles, Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const QuizHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await mcqService.getQuizHistory();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-black tracking-tight animate-pulse uppercase text-xs">Compiling Performance Data...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-dashed pb-10">
        <div className="space-y-6">
          <Button 
            onClick={() => navigate('/mcq')} 
            variant="ghost" 
            className="group px-4 rounded-xl text-muted-foreground hover:text-primary transition-colors border bg-background/50"
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Quiz Center
          </Button>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <History className="w-8 h-8 relative z-10" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter italic">Quiz History</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Your intellectual trajectory and mastery metrics.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Global Stats</div>
          <Badge variant="outline" className="px-6 py-3 rounded-2xl border-2 bg-white shadow-sm font-black text-base flex gap-3">
             <Trophy className="w-5 h-5 text-yellow-500" /> {history.length} Attempts
          </Badge>
        </div>
      </div>

      {error ? (
        <Card className="border-4 border-dashed border-destructive/20 bg-destructive/5 rounded-[3rem]">
          <CardContent className="p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto border shadow-xl">
               <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Sync Disruption</h3>
              <p className="text-muted-foreground font-medium max-w-md mx-auto">{error}</p>
            </div>
            <Button size="lg" className="rounded-2xl font-black" onClick={() => window.location.reload()}>Retry Handshake</Button>
          </CardContent>
        </Card>
      ) : history.length === 0 ? (
        <Card className="border-4 border-dashed rounded-[4rem] bg-zinc-50/50">
          <CardContent className="p-32 text-center space-y-8">
            <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border-2 border-primary/10">
               <Brain className="w-12 h-12 text-primary/40 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black tracking-tight">Zero Sessions Recorded</h3>
              <p className="text-muted-foreground font-medium max-w-md mx-auto">The archives are empty. Dive into the repository and leave your mark of excellence.</p>
            </div>
            <Button size="lg" onClick={() => navigate('/mcq')} className="rounded-3xl font-black px-12 h-16 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              Initiate Quiz Protocol
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {history.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- Sub-component: SessionCard ---------------- */

function SessionCard({ session }: { session: QuizSession }) {
  const navigate = useNavigate();
  
  const isExcellent = session.scorePercentage >= 80;
  const isGood = session.scorePercentage >= 50;

  return (
    <Card 
      className="group relative overflow-hidden rounded-[3rem] border-2 bg-white hover:border-primary transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer" 
      onClick={() => navigate(`/mcq/quiz/${session.id}/result`)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Progress Indicator (Vertical or Left) */}
          <div className={cn(
            "w-full lg:w-40 flex flex-col items-center justify-center p-10 lg:border-r border-dashed transition-colors shrink-0",
            session.isCompleted ? (isExcellent ? "bg-green-500/5" : isGood ? "bg-amber-500/5" : "bg-rose-500/5") : "bg-zinc-50"
          )}>
            <div className={cn(
               "text-4xl font-black italic tracking-tighter",
               isExcellent ? "text-green-600" : isGood ? "text-amber-600" : "text-rose-600"
            )}>
               {Math.round(session.scorePercentage)}%
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Accuracy</span>
          </div>

          {/* Core Metrics */}
          <div className="flex-1 p-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
               <div className="flex items-center gap-3 text-sm font-black text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border">
                  <Calendar className="w-4 h-4 text-primary" />
                  {format(new Date(session.startedAt), 'MMM dd, yyyy · hh:mm a')}
               </div>
               
               <div className="flex gap-2">
                  {session.isCompleted ? (
                    <Badge className="bg-green-500 text-white border-none rounded-full py-1.5 px-5 font-black text-[10px] uppercase shadow-lg shadow-green-500/20">
                      Validated
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-600 border-none rounded-full py-1.5 px-5 font-black text-[10px] uppercase">
                      Incomplete
                    </Badge>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-widest opacity-40">Questions</span>
                <div className="text-xl font-black">{session.totalQuestions}</div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-widest opacity-40">Correct hits</span>
                <div className="text-xl font-black text-green-500">+{session.correctAnswers}</div>
              </div>
              <div className="space-y-1.5 border-l border-dashed pl-8 hidden md:block">
                <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-widest opacity-40">Missed</span>
                <div className="text-xl font-black text-rose-500">-{session.incorrectAnswers}</div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-widest opacity-40">Completion</span>
                <div className="text-xl font-black">
                  {Math.round(( (session.correctAnswers + session.incorrectAnswers) / session.totalQuestions) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="p-10 hidden lg:flex border-l border-dashed bg-zinc-50/30 group-hover:bg-primary transition-colors duration-500">
             <div className="w-14 h-14 rounded-2xl bg-white border flex items-center justify-center group-hover:bg-primary group-hover:border-white transition-all shadow-xl group-hover:rotate-12">
                <ChevronRight className="w-7 h-7 group-hover:text-white transition-colors" />
             </div>
          </div>
        </div>
      </CardContent>

      {/* Modern Progress Line */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-muted w-full overflow-hidden">
         <div 
           className={cn(
             "h-full transition-all duration-1000 ease-out",
             isExcellent ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : 
             isGood ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : 
             "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
           )}
           style={{ width: `${session.scorePercentage}%` }} 
         />
      </div>
    </Card>
  );
}

export default QuizHistoryPage;