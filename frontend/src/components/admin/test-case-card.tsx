import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import type { ProblemFormInput } from "./problem-schema";

type TestCaseCardProps = {
  index: number;
  control: Control<ProblemFormInput>;
  register: UseFormRegister<ProblemFormInput>;
  remove: (index: number) => void;
};

export function TestCaseCard({
  index,
  control,
  register,
  remove,
}: TestCaseCardProps) {

  return (
    <Card className="border shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b">
        <span className="font-medium text-sm text-muted-foreground">
            Test Case #{index + 1}
        </span>
        <div className="flex items-center gap-2">
            <Controller
                control={control}
                name={`testCases.${index}.sample`}
                render={({ field }) => (
                    <div className="flex items-center space-x-2">
                    <Checkbox 
                        id={`sample-${index}`} 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                    />
                    <label
                        htmlFor={`sample-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Mark as Sample
                    </label>
                    </div>
                )}
            />
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                onClick={() => remove(index)}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Input</label>
                <Textarea
                    className="font-mono text-sm min-h-[120px] bg-muted/20 resize-none focus:bg-background transition-colors"
                    placeholder="Enter input data..."
                    {...register(`testCases.${index}.input`)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expected Output</label>
                <Textarea
                    className="font-mono text-sm min-h-[120px] bg-muted/20 resize-none focus:bg-background transition-colors"
                    placeholder="Enter expected output..."
                    {...register(`testCases.${index}.output`)}
                />
            </div>
        </div>
      </div>
    </Card>
  );
}
