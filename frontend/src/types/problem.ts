export type Problem = {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  sampleTestCases: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints?: string[];
  hints?: string[];
};



export type AdminProblem = {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  testCases: {
    input: string;
    output: string;
    sample:boolean;
  }[];
  constraints?: string[];
  hints?: string[];
};

export type ProblemSubmission = {
  title: string;
  status: string;
  language:string;
};
