import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import Loading from "@/components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


type Submission = {
  title: string;
  status: string;
  language: string;
};

type UserProfile = {
  username: string;
  email: string;
  about: string;
  solvedCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  latestSubmissions: Submission[];
};

const UserProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5046/api/users/profile", {
          withCredentials: true,
        });
        setProfile(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT SIDEBAR: PROFILE INFO */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3 space-y-6">
          <Card className="overflow-hidden border-border/50 shadow-md">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900"></div>
            <CardContent className="pt-0 relative px-6 pb-6">
              <div className="absolute -top-12 left-6">
                <div className="w-24 h-24 rounded-2xl bg-card border-4 border-card flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-xl bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                    {profile.username[0].toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="mt-14 space-y-1">
                <h2 className="text-2xl font-bold text-foreground">{profile.username}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                 <p className="text-sm text-muted-foreground italic">
                    "{profile.about || "Coding enthusiast on a journey to mastery."}"
                 </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Languages</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1 text-xs">C++</Badge>
                <Badge variant="secondary" className="px-3 py-1 text-xs">Java</Badge>
                <Badge variant="secondary" className="px-3 py-1 text-xs">Python</Badge>
                <Badge variant="secondary" className="px-3 py-1 text-xs">JavaScript</Badge>
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT: STATS & SUBMISSIONS */}
        <div className="col-span-1 md:col-span-8 lg:col-span-9 space-y-6">
            
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard 
                label="Total Solved" 
                value={profile.solvedCount} 
                className="bg-primary/5 border-primary/20 text-primary" 
                icon={<FaCheckCircle className="w-4 h-4" />}
            />
            <StatCard 
                label="Easy" 
                value={profile.easyCount} 
                className="bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
            />
            <StatCard 
                label="Medium" 
                value={profile.mediumCount} 
                className="bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400" 
            />
            <StatCard 
                label="Hard" 
                value={profile.hardCount} 
                className="bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400" 
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* PROGRESS GRAPH PLACEHOLDER (Future Feature) */}
            {/* <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Activity</CardTitle>
                </CardHeader>
                <CardContent className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                    heatmap coming soon...
                </CardContent>
            </Card> */}

            {/* RECENT SUBMISSIONS */}
            <Card className="border-border/50 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FaClock className="w-4 h-4 text-muted-foreground" />
                    Recent Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.latestSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No submissions yet. Start solving problems!
                  </div>
                ) : (
                  <div className="space-y-1">
                    {profile.latestSubmissions.map((s, idx) => (
                      <Link
                        key={idx}
                        to={`/problems/${encodeURIComponent(s.title)}`}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors group border border-transparent hover:border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          {s.status === "ACCEPTED" ? (
                            <FaCheckCircle className="text-emerald-500 w-4 h-4" />
                          ) : (
                            <FaTimesCircle className="text-destructive w-4 h-4" />
                          )}
                          <span className="font-medium text-sm group-hover:text-primary transition-colors">
                            {s.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                {s.language}
                            </Badge>
                            <span className="text-xs text-muted-foreground tabular-nums min-w-[60px] text-right">
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

/* ------------------ HELPERS ------------------ */

const StatCard = ({ label, value, className, icon }: { label: string; value: number; className?: string; icon?: React.ReactNode }) => (
  <Card className={`border shadow-sm flex flex-col items-center justify-center p-4 ${className}`}>
    <div className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
        {icon} {value}
    </div>
    <div className="text-xs font-medium uppercase tracking-wider opacity-80">{label}</div>
  </Card>
);
