import { z } from "zod";

const testCaseSchema = z.object({
  input: z.string().min(1, "Input required"),
  output: z.string().min(1, "Output required"),
  sample: z.boolean().default(false), // 🔥 REQUIRED (not default)
});

export const problemSchema = z.object({
  title: z.string().min(5),
  // slug: z.string().regex(/^[a-z0-9-]+$/),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  description: z.string().min(20),
  //constraints: z.string().optional(),
  tags: z.string().min(1),
  //explanation: z.string().optional(),

  testCases: z.array(testCaseSchema).min(1),
});

export type ProblemFormInput = z.input<typeof problemSchema>;
export type ProblemFormData = z.output<typeof problemSchema>;
