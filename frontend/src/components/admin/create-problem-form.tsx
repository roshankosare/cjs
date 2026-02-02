import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { getApiErrorMessage } from "@/lib/api-utils";

import { problemSchema, type ProblemFormInput } from "./problem-schema";
import type { AdminProblem } from "@/types/problem";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { TestCasesPanel } from "./test-case-panel";
import { MarkdownEditor } from "../mark-down-editor";
import { TagInput } from "../ui/tag-input";


type Props = {
  problem?: AdminProblem;
};

const API_BASE = "http://localhost:5046/api/problems";

const CreateProblemForm: React.FC<Props> = ({ problem }) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProblemFormInput>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: "EASY",
      testCases: [{ input: "", output: "", sample: false }],
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "testCases",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  /* -------------------- Populate form in edit mode -------------------- */
  useEffect(() => {
    if (!problem) return;

    reset({
      title: problem.title,
      difficulty: problem.difficulty,
      description: problem.description,
      tags: problem.tags, // ✅ Directly assign array
      testCases: problem.testCases.map((tc) => ({
        input: tc.input,
        output: tc.output,
        sample: tc.sample || false,
      })),
    });
  }, [problem, reset]);

  /* -------------------- Submit -------------------- */
  const onSubmit = async (data: ProblemFormInput) => {
    setIsSubmitting(true);
    setSuccess(null);
    setApiError(null);

    const payload = {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      timeLimitMs: 1000, // Hardcoded for now
      memoryLimitMb: 256,
      isPublished: true,
      tags: data.tags, // ✅ Already array
      testCases: data.testCases,
    };

    try {
      if (problem) {
        await axios.put(`${API_BASE}/${problem.id}`, payload, {
           withCredentials: true,
        });
        setSuccess(true);
      } else {
        await axios.post(API_BASE, payload, {
           withCredentials: true,
        });
        setSuccess(true);
        reset({
            title: "",
            description: "",
            difficulty: "EASY",
            tags: [],
            testCases: [{ input: "", output: "", sample: false }]
        });
      }
    } catch (err) {
      console.error("Create problem error:", err);
      setApiError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <Card className="p-8 max-w-6xl mx-auto shadow-md">
       <div className="mb-8 border-b pb-4 pt-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground border-l-4 border-primary pl-4">
            {problem ? "Edit Problem" : "Create New Problem"}
          </h1>
          <p className="text-muted-foreground mt-2 pl-5">
            {problem ? "Update the problem details below." : "Fill in the details to create a new coding challenge."}
          </p>
       </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Backend error banner */}
        {apiError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
            Error: {apiError}
          </div>
        )}

        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700 font-medium">
            {problem ? "Problem updated successfully!" : "Problem created successfully!"}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Difficulty Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Problem Title</label>
                    <Input {...register("title")} placeholder="e.g. Two Sum" />
                    {errors.title && (
                        <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Difficulty</label>
                    <Controller
                        name="difficulty"
                        control={control}
                        render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EASY">Easy</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HARD">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
            </div>

             {/* Tags (New Component) */}
             <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tags</label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="Type tag and press Enter" 
                   />
                )}
              />
               {errors.tags && (
                <p className="text-sm text-red-500 mt-1">{errors.tags.message}</p>
              )}
               <p className="text-xs text-muted-foreground mt-1">
                Press Enter or Comma to add a tag.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description (Markdown)</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MarkdownEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.description?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* RIGHT COLUMN (Test Cases) */}
          <div className="lg:col-span-5">
             <div className="sticky top-6">
                <TestCasesPanel
                fields={fields}
                append={append}
                remove={remove}
                control={control}
                register={register}
                errors={errors}
                />
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t flex justify-end">
             <Button disabled={isSubmitting} type="submit" size="lg" className="min-w-[150px]">
                {isSubmitting && <Spinner className="mr-2" />}
                {problem ? "Save Changes" : "Create Problem"}
            </Button>
        </div>
        
      </form>
    </Card>
  );
};

export default CreateProblemForm;
