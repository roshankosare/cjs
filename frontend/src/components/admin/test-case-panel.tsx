import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TestCaseCard } from "./test-case-card";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFieldArrayRemove,
} from "react-hook-form";
import type { ProblemFormData, ProblemFormInput } from "./problem-schema";

type TestCasesPanelProps = {
  fields: { id: string }[];
  append: (value: ProblemFormData["testCases"][number]) => void;
  remove: UseFieldArrayRemove;
  control: Control<ProblemFormInput>;
  register: UseFormRegister<ProblemFormInput>;
  errors: FieldErrors<ProblemFormInput>;
};

export function TestCasesPanel({
  fields,
  append,
  remove,
  control,
  register,
  errors,
}: TestCasesPanelProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <Card className="p-4 space-y-4">
      {/* Test Case Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b">
        {fields.map((_, index) => (
          <Button
            key={index}
            type="button"
            variant={activeIndex === index ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveIndex(index)}
            className="flex-shrink-0"
          >
            Case {index + 1}
          </Button>
        ))}
         <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={() => {
            append({ input: "", output: "", sample: false });
            setActiveIndex(fields.length);
          }}
          className="flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Case
        </Button>
      </div>

      {/* Expanded Test Case */}
      {fields[activeIndex] && (
        <TestCaseCard
          key={fields[activeIndex].id}
          index={activeIndex}
          control={control}
          register={register}
          remove={remove}
        />
      )}

      {errors.testCases && (
        <p className="text-sm text-red-500">
          {errors.testCases.message}
        </p>
      )}
    </Card>
  );
}
