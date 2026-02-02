import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mcqSchema, type McqFormValues } from '@/schemas/mcq-schema';
import { mcqService } from '@/service/mcqService';
import { getApiErrorMessage } from '@/lib/api-utils';
import { 
  AlertCircle, Save, BrainCircuit, FileText, 
  Settings2, BookOpenCheck, Sparkles
} from 'lucide-react';
import type { CreateMcqDto } from '@/types/mcq';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

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

const McqForm = ({ onSuccess, initialData, isEditing = false, questionId }: McqFormProps) => {
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
      console.error("MCQ Form error:", err);
      setSubmissionError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col bg-background h-full max-h-[95vh] overflow-hidden rounded-xl border shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Challenge' : 'MCQ Builder'}</h2>
            <p className="text-xs text-muted-foreground">Drafting high-quality software engineering questions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#f8fafc] dark:bg-zinc-950/50">
        {submissionError && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 mb-6 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4" />
            {submissionError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
          
          {/* SECTION 1: QUESTION DETAILS */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 font-bold text-lg border-b pb-2 mb-4">
                 <FileText className="w-5 h-5 text-primary" />
                 Question & Metadata
              </div>

              <div className="grid md:grid-cols-[1fr,300px] gap-8">
                {/* Question Text */}
                <div className="space-y-3">
                  <Label className="font-semibold text-base">Question Text *</Label>
                  <Textarea 
                    {...register('question')}
                    placeholder="Enter the main question here..."
                    className="min-h-[180px] text-lg p-4 bg-muted/20 border-2 focus-visible:border-primary resize-none rounded-xl"
                  />
                  {errors.question && <p className="text-sm text-destructive font-medium">{errors.question.message}</p>}
                </div>

                {/* Metadata Sidebar */}
                <div className="space-y-4 bg-muted/30 p-5 rounded-xl border border-dashed h-fit">
                    <div className="flex items-center gap-2 font-bold text-sm mb-2 text-muted-foreground">
                       <Settings2 className="w-4 h-4" /> Properties
                    </div>
                    
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
            </CardContent>
          </Card>

          {/* SECTION 2: OPTIONS */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    Options Configuration
                  </div>
                  
                  {/* Correct Option Selector */}
                  <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
                    <span className="text-xs font-bold text-primary uppercase tracking-tighter">Correct Answer:</span>
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

               {errors.correctOption && <p className="text-center text-sm font-bold text-destructive animate-pulse bg-destructive/10 py-2 rounded">Selection Required: {errors.correctOption.message}</p>}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {['A', 'B', 'C', 'D'].map(opt => (
                   <div key={opt} className={cn(
                     "relative p-6 rounded-2xl border-2 transition-all group bg-background",
                     formData.correctOption === opt ? "border-primary bg-primary/[0.02] shadow-sm" : "border-muted/60 hover:border-primary/20"
                   )}>
                     <div className="flex gap-4 items-start">
                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black transition-colors text-sm",
                          formData.correctOption === opt ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {opt}
                        </div>
                        <div className="flex-1 space-y-3">
                           <Input 
                             {...register(`option${opt}` as any)}
                             placeholder={`Option ${opt} Label`}
                             className="font-medium text-base h-10 border-muted focus-visible:ring-1"
                           />
                           
                           {/* Flaw logic inline */}
                           <div className="relative">
                              <Input 
                                {...register(`incorrectExplanation${opt}` as any)}
                                placeholder={`Why is this wrong? (Optional)`}
                                className="h-8 text-xs bg-muted/30 border-none shadow-none focus-visible:ring-0 px-2 rounded-md"
                              />
                           </div>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>

          {/* SECTION 3: SOLUTION */}
          <Card className="border-0 shadow-md bg-primary/5 border-primary/10 border-dashed">
             <CardContent className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 font-bold text-lg mb-2">
                   <div className="p-2 bg-primary rounded-lg text-white">
                      <BookOpenCheck className="w-5 h-5" />
                   </div>
                   Success Analysis & Explanation
                </div>
                
                <div className="bg-background rounded-2xl p-1 shadow-sm border">
                    <Textarea 
                      {...register('correctExplanation')}
                      placeholder="Provide a comprehensive explanation of the solution..."
                      className="min-h-[150px] text-base p-4 border-0 focus-visible:ring-0 resize-y rounded-xl"
                    />
                </div>
                {errors.correctExplanation && <p className="text-sm font-bold text-destructive">{errors.correctExplanation.message}</p>}
             </CardContent>
          </Card>

        </form>
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t bg-background flex items-center justify-end gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
         <Button 
            variant="ghost" 
            onClick={onSuccess}
            type="button"
            disabled={isSubmitting}
            className="font-bold text-muted-foreground hover:bg-muted"
          >
            Cancel
         </Button>

         <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting} 
            size="lg"
            className="font-black px-10 shadow-xl shadow-primary/20 text-base h-12 rounded-xl"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <><Save className="w-5 h-5 mr-2" /> {isEditing ? 'Save Changes' : 'Create Challenge'}</>
            )}
         </Button>
      </div>
    </div>
  );
};

export default McqForm;