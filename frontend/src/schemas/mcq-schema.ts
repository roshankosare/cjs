import { z } from "zod";

export const mcqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters long"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  optionD: z.string().min(1, "Option D is required"),
  correctOption: z.enum(["A", "B", "C", "D"]),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  correctExplanation: z.string().min(10, "Explanation must be at least 10 characters"),
  incorrectExplanationA: z.string().optional(),
  incorrectExplanationB: z.string().optional(),
  incorrectExplanationC: z.string().optional(),
  incorrectExplanationD: z.string().optional(),
});

export type McqFormValues = z.infer<typeof mcqSchema>;
