import type {
  CreateMcqDto,
  McqQuestion,
  McqQuestionWithAnswer,
  QuizSession,
  McqAttemptResult,
  QuizResult,
  StartQuizDto,
  SubmitMcqAnswerDto,
} from "../types/mcq";

const API_BASE_URL = "http://localhost:5046/api";

class McqService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error("Something went wrong. Please try again later.");
      }

      const error = await response
        .json()
        
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  // Admin endpoints
  async createQuestion(dto: CreateMcqDto): Promise<McqQuestionWithAnswer> {
    const response = await this.fetchWithAuth("/mcq", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  
    return response.data;
  }

  async getAllQuestions(category?: string): Promise<McqQuestionWithAnswer[]> {
    const url = category
      ? `/mcq?category=${encodeURIComponent(category)}`
      : "/mcq";
    const response = await this.fetchWithAuth(url);
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await this.fetchWithAuth("/mcq/categories");
    return response.data;
  }

  async getQuestion(id: number): Promise<McqQuestionWithAnswer> {
    const response = await this.fetchWithAuth(`/mcq/${id}`);
    return response.data;
  }

  async updateQuestion(
    id: number,
    dto: CreateMcqDto
  ): Promise<McqQuestionWithAnswer> {
    const response = await this.fetchWithAuth(`/mcq/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
    return response.data;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    const response = await this.fetchWithAuth(`/mcq/${id}`, {
      method: "DELETE",
    });
    return response.data;
  }

  // User endpoints
  async startQuiz(dto: StartQuizDto): Promise<QuizSession> {
    const response = await this.fetchWithAuth("/mcq/quiz/start", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    console.log("Start Quiz Response:", response);
    return response.data;
  }

  async getQuizQuestions(sessionId: number): Promise<McqQuestion[]> {
    const response = await this.fetchWithAuth(
      `/mcq/quiz/${sessionId}/questions`
    );
    return response.data;
  }

  async submitAnswer(dto: SubmitMcqAnswerDto): Promise<McqAttemptResult> {
    const response = await this.fetchWithAuth("/mcq/quiz/submit", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return response.data;
  }

  async getQuizResult(sessionId: number): Promise<QuizResult> {
    const response = await this.fetchWithAuth(`/mcq/quiz/${sessionId}/result`);
    return response.data;
  }

  async getQuizHistory(): Promise<QuizSession[]> {
    const response = await this.fetchWithAuth("/mcq/quiz/history");
    return response.data;
  }
}

export const mcqService = new McqService();
