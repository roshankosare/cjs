import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  List, 
  LayoutDashboard, 
  HelpCircle, 
  Users, 
  FileCode, 
  Activity 
} from "lucide-react";
import axios from "axios";

// Constants for API URLs - ideally these come from env vars
const API_BASE = "http://localhost:5046/api"; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    problems: 0,
    submissions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Content Stats (Problems, Submissions, and Users if .NET)
        const contentRes = await axios.get(`${API_BASE}/admin/stats/overview`, { withCredentials: true });
        
        // Fetch User Stats (Separately for Java Auth Service consistency, though .NET sends it in overview)
        // We'll try to use data from overview first, if missing, we could fetch separate users endpoint 
        // But for now, since .NET sends all, and Java Auth is separate service, 
        // we might need a separate call if 'totalUsers' is missing.
        
        const data = contentRes.data.data;
        
        let userCount = data.totalUsers;

        if (userCount === undefined) {
           try {
             const userRes = await axios.get(`${API_BASE}/admin/stats/users`, { withCredentials: true });
             userCount = userRes.data.data; 
           } catch (userErr) {
             console.error("Failed to fetch separate user stats", userErr);
             userCount = 0;
           }
        }

        setStats({
          users: userCount || 0,
          problems: data.totalProblems || 0,
          submissions: data.totalSubmissions || 0
        });

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your coding platform, track performance, and curate content.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Users" 
          value={loading ? "..." : stats.users.toLocaleString()} 
          change="Registered"
          icon={<Users className="w-5 h-5 text-muted-foreground" />} 
        />
        <StatsCard 
          title="Active Problems" 
          value={loading ? "..." : stats.problems.toLocaleString()} 
          change="Published"
          icon={<FileCode className="w-5 h-5 text-muted-foreground" />} 
        />
         <StatsCard 
          title="Submissions" 
          value={loading ? "..." : stats.submissions.toLocaleString()} 
          change="Total attempts"
          icon={<Activity className="w-5 h-5 text-muted-foreground" />} 
        />
      </div>

      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-6 text-foreground">Quick Actions</h2>
        
        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Problem */}
          <ActionCard
            title="Create Problem"
            description="Draft and publish a new coding challenge with test cases."
            icon={<PlusCircle className="w-8 h-8 text-green-500" />}
            to="/admin/create-problem"
            actionLabel="Create Now"
            gradient="hover:bg-green-50/50 dark:hover:bg-green-900/10"
          />

          {/* Problem List */}
          <ActionCard
            title="Manage Problems"
            description="View, edit, or delete existing problems in the library."
            icon={<List className="w-8 h-8 text-blue-500" />}
            to="/admin/problems"
            actionLabel="View All"
            gradient="hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
          />

           {/* MCQ Management */}
           <ActionCard
            title="MCQ Repository"
            description="Manage multiple choice questions for quizzes."
            icon={<HelpCircle className="w-8 h-8 text-purple-500" />}
            to="/admin/mcq"
            actionLabel="Manage MCQs"
            gradient="hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

function StatsCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {change}
        </p>
      </CardContent>
    </Card>
  )
}

function ActionCard({
  title,
  description,
  icon,
  to,
  actionLabel,
  gradient
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  actionLabel: string;
  gradient: string;
}) {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${gradient}`}>
      <div className="p-6 space-y-4">
        <div className="p-3 bg-background rounded-xl w-fit shadow-sm border group-hover:scale-110 transition-transform duration-300">
           {icon}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-2">
          <Link to={to}>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {actionLabel}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
