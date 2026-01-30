import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

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


type Props = {
  problem?: AdminProblem;
};

const API_BASE = "http://localhost:5046/api/problems";

const CreateProblemForm: React.FC<Props> = ({ problem }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  // console.log("Edit problem:", problem);

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
      tags: problem.tags.join(", "),
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
    // console.log("Form data:", data);
    setSuccess(null);
    setApiError(null);

    const payload = {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      isPublished: true,
      tags: data.tags.split(",").map((t) => t.trim()),
      testCases: data.testCases,
    };

    try {
      if (problem) {
        const res = await axios.put(`${API_BASE}/${problem.id}`, payload, {
          withCredentials: true,
        });

        console.log(data);
        console.log("Update response:", res.data);
        setSuccess(true);
      } else {
        const res = await axios.post(API_BASE, payload, {
          withCredentials: true,
        });

        console.log("Create response:", res.data);
        setSuccess(true);
        reset();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
        const message =
          err.response?.data?.message ||
          err.response?.data?.title ||
          "Something went wrong. Please try again.";

        setApiError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <Card className="p-6 max-w-7xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("FORM ERRORS:", errors);
        })}
        className="space-y-6"
      >
        {/* Backend error banner */}
        {apiError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {success === true && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {problem
              ? "Problem updated successfully!"
              : "Problem created successfully!"}
          </div>
        )}

        <h1 className="text-2xl font-semibold">
          {problem ? "Edit Problem" : "Create Problem"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="font-medium">Title</label>
              <Input {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="font-medium">Difficulty</label>
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

            {/* Description */}
            <div>
              <label className="font-medium">Description</label>
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

            {/* Tags */}
            <div>
              <label className="font-medium">Tags</label>
              <Input placeholder="array, dp, math" {...register("tags")} />
              {errors.tags && (
                <p className="text-sm text-red-500">{errors.tags.message}</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
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

        {/* Submit */}
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting && <Spinner />}
          {problem ? "Update Problem" : "Create Problem"}
        </Button>
      </form>
    </Card>
  );
};

export default CreateProblemForm;
