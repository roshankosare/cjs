import type { Problem } from "@/types/problem";
import { Link } from "react-router-dom";
import { Pencil, Trash2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type Props = {
  problems: Pick<Problem, "title" | "difficulty" | "id" | "slug">[];
  admin?: boolean;
};

export default function ProblemList({ problems, admin = false }: Props) {
  return (
    <div className="rounded-md border w-full max-w-5xl bg-card text-card-foreground shadow-sm">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm text-left">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">
                Status
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                Title
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                Difficulty
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {problems.map((problem) => (
              <tr
                key={problem.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle">
                  {/* Placeholder for status icon (can be added later) */}
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                </td>
                <td className="p-4 align-middle font-medium">
                  <Link
                    to={`/problems/${problem.slug}/solution`}
                    className="hover:underline hover:text-primary transition-colors text-base"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="p-4 align-middle">
                  <Badge
                    variant={
                      problem.difficulty === "HARD"
                        ? "destructive"
                        : problem.difficulty === "EASY"
                        ? "secondary" // Use a custom class or variant if 'success' isn't available
                        : "default"
                    }
                    className={`
                      ${
                        problem.difficulty === "EASY"
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border-transparent"
                          : problem.difficulty === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-transparent"
                          : "bg-red-100 text-red-700 hover:bg-red-200 border-transparent"
                      }
                    `}
                  >
                    {problem.difficulty}
                  </Badge>
                </td>
                <td className="p-4 align-middle text-right">
                  {admin ? (
                    <div className="flex items-center justify-end gap-2">
                       <Button size="icon" variant="ghost" asChild>
                        <Link to={`/admin/problems/${problem.slug}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => console.log("Delete", problem.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/problems/${problem.slug}/solution`}>
                        Solve <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                 <td colSpan={4} className="h-24 text-center text-muted-foreground">
                    No problems found.
                 </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
