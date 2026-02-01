import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { mcqSchema, type McqFormValues } from '@/schemas/mcq-schema';
import { mcqService } from '@/service/mcqService';
import { 
  AlertCircle, Save, BrainCircuit, Type, FileText, 
  CheckCircle2, ArrowRight, ArrowLeft, Settings2, Sparkles, BookOpenCheck
} from 'lucide-react';
import type { CreateMcqDto } from '@/types/mcq';
import { cn } from '@/lib/utils';

interface McqFormProps {
  onSuccess?: () => void;
  initialData?: CreateMcqDto;
  isEditing?: boolean;
  questionId?: number;
}

const categories = [
  "Fixed", "Arrays", "Strings", "Trees", "Graphs", 
  "Dynamic Programming", "Sorting", "Searching", 
  "Linked Lists", "Stacks and Queues", "Hash Tables", "Recursion"
];

type FormTab = 'details' | 'options' | 'solution';

const McqForm = ({ onSuccess, initialData, isEditing = false, questionId }: McqFormProps) => {
  const [activeTab, setActiveTab] = useState<FormTab>('details');
  const [submissionError, setSubmissionError] = useState('');
  
  const defaultValues: McqFormValues = initialData ? {
    question: initialData.question,
    optionA: initialData.optionA,
    optionB: initialData.optionB,
    optionC: initialData.optionC,
    optionD: initialData.optionD,
    correctOption: initialData.correctOption as "A" | "B" | "C" | "D",
    correctExplanation: initialData.correctExplanation || "",
    incorrectExplanationA: initialData.incorrectExplanationA || "",
    incorrectExplanationB: initialData.incorrectExplanationB || "",
    incorrectExplanationC: initialData.incorrectExplanationC || "",
    incorrectExplanationD: initialData.incorrectExplanationD || "",
    category: initialData.category,
    difficulty: initialData.difficulty as "Easy" | "Medium" | "Hard",
  } : {
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: undefined as any,
    correctExplanation: '',
    category: 'Fixed',
    difficulty: 'Medium',
    incorrectExplanationA: '',
    incorrectExplanationB: '',
    incorrectExplanationC: '',
    incorrectExplanationD: '',
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<McqFormValues>({
    resolver: zodResolver(mcqSchema),
    defaultValues,
  });

  const formData = watch();

  const onSubmit = async (data: McqFormValues) => {
    setSubmissionError('');
    try {
      if (isEditing && questionId) {
        await mcqService.updateQuestion(questionId, data);
      } else {
        await mcqService.createQuestion(data);
      }
      
      if (onSuccess) onSuccess();
      if (!isEditing) {
        reset();
      }
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : 'Failed to save question');
    }
  };

  const nextTab = async (current: FormTab) => {
    let fieldsToValidate: (keyof McqFormValues)[] = [];
    if (current === 'details') fieldsToValidate = ['question', 'category', 'difficulty'];
    if (current === 'options') fieldsToValidate = ['optionA', 'optionB', 'optionC', 'optionD', 'correctOption'];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (current === 'details') setActiveTab('options');
      if (current === 'options') setActiveTab('solution');
    }
  };

  const prevTab = () => {
    if (activeTab === 'options') setActiveTab('details');
    if (activeTab === 'solution') setActiveTab('options');
  };

  return (
    <div className="flex flex-col bg-background h-full max-h-[95vh] overflow-hidden rounded-xl border shadow-2xl">
      {/* Header with Progress */}
      <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Challenge' : 'MCQ Builder'}</h2>
            <p className="text-xs text-muted-foreground">Drafting high-quality software engineering questions</p>
          </div>
        </div>

        {/* Tab Indicator */}
        <div className="flex gap-1">
          {(['details', 'options', 'solution'] as FormTab[]).map((tab, idx) => (
            <div 
              key={tab} 
              className={cn(
                "w-8 h-1 rounded-full transition-all duration-300",
                activeTab === tab ? "bg-primary w-12" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b bg-card">
        <button 
          onClick={() => setActiveTab('details')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
            activeTab === 'details' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">1</div>
          Basic Info
        </button>
        <button 
          onClick={() => nextTab('details')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
            activeTab === 'options' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">2</div>
          Options
        </button>
        <button 
          onClick={() => nextTab('options')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
            activeTab === 'solution' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">3</div>
          Solution
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
        {submissionError && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 mb-6 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4" />
            {submissionError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid md:grid-cols-[1fr,250px] gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-base">
                    <FileText className="w-4 h-4 text-primary" />
                    Question Text *
                  </div>
                  <Textarea 
                    {...register('question')}
                    placeholder="Enter the main question here..."
                    className="min-h-[220px] text-lg p-6 bg-muted/20 border-2 focus-visible:border-primary resize-none rounded-xl"
                  />
                  {errors.question && <p className="text-sm text-destructive font-medium">{errors.question.message}</p>}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 font-bold text-base mb-2">
                    <Settings2 className="w-4 h-4 text-primary" />
                    Metadata
                  </div>
                  <div className="space-y-4 bg-muted/30 p-5 rounded-xl border border-dashed text-sm">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Topic</Label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-background border-muted">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Complexity</Label>
                      <Controller
                        name="difficulty"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-background border-muted">
                              <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy" className="text-green-600">Easy</SelectItem>
                              <SelectItem value="Medium" className="text-yellow-600">Medium</SelectItem>
                              <SelectItem value="Hard" className="text-red-600">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Options */}
          {activeTab === 'options' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    Define Options & Identify the Answer
                  </div>
                  <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
                    <span className="text-xs font-bold text-primary uppercase tracking-tighter">Correct Is:</span>
                    <Controller
                      name="correctOption"
                      control={control}
                      render={({ field }) => (
                        <div className="flex gap-1">
                          {['A', 'B', 'C', 'D'].map(opt => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => field.onChange(opt)}
                              className={cn(
                                "w-7 h-7 rounded-sm text-xs font-black transition-all",
                                field.value === opt ? "bg-primary text-white scale-110 shadow-md" : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {['A', 'B', 'C', 'D'].map(opt => (
                   <div key={opt} className={cn(
                     "relative p-6 rounded-2xl border-2 transition-all group",
                     formData.correctOption === opt ? "border-primary bg-primary/[0.02] shadow-sm" : "border-muted hover:border-primary/20"
                   )}>
                     <div className="absolute -top-3 left-6 px-2 bg-background border rounded text-xs font-black text-muted-foreground group-hover:text-primary transition-colors">
                       OPTION {opt}
                     </div>
                     <div className="flex gap-4 items-start">
                        <div className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black transition-colors",
                          formData.correctOption === opt ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {opt}
                        </div>
                        <Input 
                          {...register(`option${opt}` as any)}
                          placeholder={`Enter label for option ${opt}...`}
                          className="border-none shadow-none text-base p-0 h-auto focus-visible:ring-0 bg-transparent"
                        />
                     </div>
                     
                     <div className="mt-4 pt-4 border-t border-dashed border-muted flex items-center gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground opacity-50 shrink-0">Flaw Logic (Optional):</Label>
                        <Input 
                          {...register(`incorrectExplanation${opt}` as any)}
                          placeholder={`Explain why ${opt} is wrong...`}
                          className="h-8 text-[11px] bg-muted/30 border-none shadow-none focus-visible:ring-0 px-2 rounded-md"
                        />
                     </div>
                   </div>
                 ))}
               </div>
               {errors.correctOption && <p className="text-center text-sm font-bold text-destructive animate-pulse">{errors.correctOption.message}</p>}
            </div>
          )}

          {/* STEP 3: Solution */}
          {activeTab === 'solution' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 border-dashed">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-3 bg-primary rounded-xl text-white">
                        <BookOpenCheck className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black">Success Analysis</h3>
                        <p className="text-sm text-muted-foreground italic">What makes the correct answer the optimal choice? *</p>
                     </div>
                  </div>
                  
                  <Textarea 
                    {...register('correctExplanation')}
                    placeholder="Provide a logical walkthrough that helps students learn. Use examples or complexity analysis if possible."
                    className="min-h-[250px] text-lg bg-background p-6 border-2 focus-visible:border-primary shadow-inner rounded-2xl"
                  />
                  {errors.correctExplanation && <p className="mt-3 text-sm font-bold text-destructive">{errors.correctExplanation.message}</p>}
               </div>
            </div>
          )}
        </form>
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t bg-muted/10 flex items-center justify-between">
         <Button 
            variant="ghost" 
            onClick={activeTab === 'details' ? (onSuccess || (() => {})) : prevTab}
            disabled={isSubmitting}
            className="font-bold text-muted-foreground"
          >
            {activeTab === 'details' ? 'Cancel' : (
              <><ArrowLeft className="w-4 h-4 mr-2" /> Previous Step</>
            )}
         </Button>

         <div className="flex gap-4">
            {activeTab !== 'solution' ? (
              <Button 
                onClick={() => nextTab(activeTab)} 
                size="lg"
                className="font-black px-8 shadow-xl shadow-primary/20 group"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit(onSubmit)} 
                disabled={isSubmitting} 
                size="lg"
                className="font-black px-10 shadow-xl shadow-primary/30"
              >
                {isSubmitting ? 'Finalizing...' : (
                  <><Save className="w-4 h-4 mr-2" /> {isEditing ? 'Save Changes' : 'Build Challenge'}</>
                )}
              </Button>
            )}
         </div>
      </div>
    </div>
  );
};

export default McqForm;