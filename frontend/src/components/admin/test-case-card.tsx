import { useState } from "react";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
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
  const [open, setOpen] = useState(true);

  return (
    <Card className="border">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span className="font-medium">Test Case #{index + 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name={`testCases.${index}.sample`}
            render={({ field }) => (
             
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
               
                  <span className="text-xs font-medium">Sample</span>
                
              </div>
            )}
          />

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              remove(index);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Input</label>
            <Textarea
              className="font-mono"
              {...register(`testCases.${index}.input`)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Output</label>
            <Textarea
              className="font-mono"
              {...register(`testCases.${index}.output`)}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
