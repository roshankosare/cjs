import Responsive from "@/components/responsive";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code2,
  BrainCircuit,
  Trophy,
  Users,
  ArrowRight,
  Terminal,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Responsive>
        {/* HERO SECTION */}
        <section className="relative py-20 sm:py-32 lg:pb-32 xl:pb-36">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">


            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Master Coding. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Conquer Challenges.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              CodeArena is the ultimate platform to practice algorithms, compete
              in contests, and crack your dream tech interview. Join thousands
              of developers leveling up their skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
              <Button asChild size="lg" className="rounded-full text-lg px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link to="/signup">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full text-lg px-8 h-12 border-primary/20 hover:bg-primary/5">
                <Link to="/problems">Explore Problems</Link>
              </Button>
            </div>

            {/* Stats Overlay */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 text-center w-full max-w-3xl border-t border-border mt-12">
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-foreground">500+</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Problems</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-foreground">10k+</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Users</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-foreground">50+</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Languages</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-foreground">24/7</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Uptime</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 border-t border-border/50">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything you need to grow
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools designed to help you master Data Structures and Algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Link to="/problems" className="block h-full">
              <Card className="h-full rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group cursor-pointer">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Problem Solving</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Access a vast library of problems categorized by difficulty and topic. From arrays to dynamic programming.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 2 */}
            <Link to="/mcq" className="block h-full">
              <Card className="h-full rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 group cursor-pointer">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Concept Drills</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Reinforce your knowledge with MCQ quizzes designed to test your understanding of core concepts.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 3 */}
            <Link to="/problems" className="block h-full">
              <Card className="h-full rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 group cursor-pointer">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Compete & Win</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Join contests, climb the leaderboard, and showcase your coding prowess to the world.
                  </p>
                </CardContent>
              </Card>
            </Link>

             {/* Feature 4 */}
             <Link to="/problems" className="block h-full">
              <Card className="h-full rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/5 group cursor-pointer">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Powerful Editor</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Write, test, and debug code in our advanced in-browser IDE with syntax highlighting and autocomplete.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 5 */}
            <Card className="h-full rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5 group">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Fast Execution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Experience lightning-fast code execution on our high-performance cloud infrastructure.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Link to="/signup" className="block h-full">
              <Card className="h-full rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 group cursor-pointer">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Community</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with other developers, discuss solutions, and learn from the community.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20">
          <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-20 text-center sm:px-12 lg:px-20 mx-auto max-w-5xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to start your coding journey?
              </h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Join CodeArena today and take your programming skills to the next level. It's free to get started.
              </p>
              <Button asChild size="lg" variant="secondary" className="rounded-full text-lg px-8 h-12 shadow-lg">
                <Link to="/signup">
                  Join Now Free
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Responsive>

      {/* FOOTER */}
      <footer className="border-t border-border mt-auto bg-card">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-foreground">CodeArena</span>
                    <span className="text-muted-foreground text-sm">© 2024</span>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <Link to="#" className="hover:text-foreground transition">Privacy Policy</Link>
                    <Link to="#" className="hover:text-foreground transition">Terms of Service</Link>
                    <Link to="#" className="hover:text-foreground transition">Contact</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
