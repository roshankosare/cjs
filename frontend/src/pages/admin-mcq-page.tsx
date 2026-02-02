import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Edit, Trash2, Plus, Search, Filter, Layers, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { McqQuestionWithAnswer } from '../types/mcq';
import { mcqService } from '../service/mcqService';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

const AdminMcqPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<McqQuestionWithAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQuestions();
    loadCategories();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const categoriesData = await mcqService.getCategories();
      setCategories(['All', ...categoriesData]);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const category = selectedCategory === 'All' ? undefined : selectedCategory;
      const questionsData = await mcqService.getAllQuestions(category);
      setQuestions(questionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await mcqService.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };



  // Client-side filtering for search
  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black">
      <div className="container max-w-7xl mx-auto px-4 py-10 space-y-10">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
             <Button 
              onClick={() => navigate('/admin')} 
              variant="ghost" 
              className="px-0 text-muted-foreground hover:text-foreground hover:bg-transparent -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Brain className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-black tracking-tight">MCQ Repository</h1>
              </div>
              <p className="text-muted-foreground font-medium pl-14">Maintain a high-standard bank of technical interview questions.</p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="h-14 px-8 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 flex gap-3"
            onClick={() => navigate('/admin/mcq/create')}
          >
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            New Challenge
          </Button>
        </div>

        {/* Filter Bar - Modernized */}
        <div className="flex flex-col md:flex-row gap-0 items-stretch bg-white dark:bg-zinc-900 rounded-[2rem] border shadow-sm overflow-hidden p-1">
           <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search the question bank..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-14 border-none shadow-none focus-visible:ring-0 bg-transparent text-lg font-medium" 
              />
           </div>
           <div className="w-px bg-zinc-100 dark:bg-zinc-800 my-3 hidden md:block" />
           <div className="flex items-center w-full md:w-auto px-4 bg-muted/20 md:bg-transparent">
              <Filter className="w-4 h-4 text-muted-foreground mr-2" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[220px] border-none shadow-none bg-transparent focus:ring-0 font-bold">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="rounded-lg">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
           <Badge variant="secondary" className="px-4 py-2 rounded-xl border bg-white dark:bg-zinc-800 text-sm font-bold flex gap-2 shrink-0">
             <span className="text-primary">{questions.length}</span> Total Assets
           </Badge>
           {loading ? <Badge variant="outline" className="animate-pulse">Analyzing Repository...</Badge> : null}
        </div>

        {/* Main Display Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 rounded-3xl bg-white dark:bg-zinc-900 border animate-pulse shadow-sm" />
             ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-20 bg-destructive/5 rounded-[3rem] border border-dashed border-destructive/20 text-destructive text-center">
             <AlertCircle className="w-12 h-12 mb-4" />
             <h3 className="text-xl font-black">Sync Failure</h3>
             <p className="font-medium">{error}</p>
             <Button variant="outline" className="mt-6 rounded-xl border-destructive/50 text-destructive hover:bg-destructive hover:text-white" onClick={loadQuestions}>Retry Sync</Button>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 rounded-[3rem] border-4 border-dashed bg-white dark:bg-transparent">
             <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Layers className="w-8 h-8 text-muted-foreground opacity-50" />
             </div>
             <h3 className="text-2xl font-black">No matches found</h3>
             <p className="text-muted-foreground font-medium">Your current filters returned 0 results.</p>
             <Button variant="link" className="mt-4" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuestions.map((q) => (
              <QuestionCard 
                key={q.id} 
                question={q} 
                onEdit={() => navigate(`/admin/mcq/${q.id}/edit`)}
                onDelete={() => handleDeleteQuestion(q.id)}
              />
            ))}
          </div>
        )}

          </div>
    </div>
  );
};

/* ---------------- Sub-components ---------------- */

function QuestionCard({ question, onEdit, onDelete }: { 
  question: McqQuestionWithAnswer, 
  onEdit: () => void, 
  onDelete: () => void 
}) {
  const diffConfigs = {
    Easy: { color: "text-green-600 bg-green-500/10 border-green-200/50", dot: "bg-green-600" },
    Medium: { color: "text-amber-600 bg-amber-500/10 border-amber-200/50", dot: "bg-amber-600" },
    Hard: { color: "text-rose-600 bg-rose-500/10 border-rose-200/50", dot: "bg-rose-600" },
  };
  
  const config = diffConfigs[question.difficulty as keyof typeof diffConfigs] || { color: "bg-muted text-muted", dot: "bg-muted" };

  return (
    <Card className="group relative flex flex-col rounded-[2rem] border-2 bg-white dark:bg-zinc-900 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
       <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-4">
             <Badge className={cn("rounded-full px-3 font-black text-[10px] uppercase border shadow-sm", config.color)}>
               <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", config.dot)} />
               {question.difficulty}
             </Badge>
             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                <Button size="icon" variant="ghost" className="h-9 w-9 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-primary hover:bg-zinc-100" onClick={onEdit}>
                   <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-rose-500 hover:bg-rose-50" onClick={onDelete}>
                   <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          </div>
          <CardTitle className="text-xl font-bold leading-tight line-clamp-2 min-h-[3.5rem] text-zinc-800 dark:text-zinc-100 italic">
             "{question.question}"
          </CardTitle>
          <CardDescription className="text-xs font-black uppercase tracking-widest text-primary/60 pt-2 flex items-center gap-1">
             <Layers className="w-3 h-3" /> {question.category}
          </CardDescription>
       </CardHeader>
       
       <CardContent className="flex-1 pb-6 mt-2">
          <div className="space-y-3 bg-zinc-50/50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-dashed">
             {['A', 'B'].map(opt => (
                <div key={opt} className="flex gap-2 items-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                   <div className={cn(
                     "w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm",
                     question.correctOption === opt ? "bg-primary text-white" : "bg-white border text-zinc-400"
                   )}>
                     {opt}
                   </div>
                   <span className="truncate">{question[`option${opt}` as keyof McqQuestionWithAnswer]}</span>
                </div>
             ))}
             <div className="text-[10px] font-black text-center text-zinc-300 uppercase tracking-tighter pt-1">
                Expand to view all options
             </div>
          </div>
       </CardContent>

       <div className="p-6 pt-0 mt-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group-hover:px-2 group-hover:bg-green-500/5 rounded-lg py-1 transition-all">
             <CheckCircleIcon className="w-5 h-5 text-green-500" />
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase opacity-40">Correct Answer</span>
                <span className="text-sm font-black text-green-600">OPTION {question.correctOption}</span>
             </div>
          </div>
          <div className="text-[10px] items-center text-zinc-400 font-bold hidden group-hover:flex">
            CREATED RECENTLY
          </div>
       </div>
    </Card>
  )
}

function CheckCircleIcon({className}: {className?: string}) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
   )
}

export default AdminMcqPage;