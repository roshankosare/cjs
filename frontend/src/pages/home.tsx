import Responsive from "@/components/responsive";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiCode, FiBookOpen, FiZap } from "react-icons/fi";

const HomePage = () => {
  return (
    <Responsive>
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center gap-6 py-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          <span className="text-blue-600">Master DSA.</span>{" "}
          <span className="text-gray-900">Compete & Improve</span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl">
          Learn and improve your programming skills.
        </p>

        <p className="text-gray-500 max-w-2xl">
          CodeQuest lets you practice coding problems, compete with others, and
          track your progress — all at your own pace.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-6 rounded-full"
          >
            Get Started
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="text-lg px-10 py-6 rounded-full shadow-md"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Practice DSA */}
          <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <FiCode size={26} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Practice DSA
              </h3>
              <p className="text-gray-500">
                Solve curated data structures and algorithms problems with
                real-world difficulty levels.
              </p>
            </CardContent>
          </Card>

          {/* Learn Programming Languages */}
          <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <FiBookOpen size={26} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Learn Programming
              </h3>
              <p className="text-gray-500">
                Master popular programming languages with structured lessons
                and hands-on coding practice.
              </p>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <FiZap size={26} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                AI Code Suggestions
              </h3>
              <p className="text-gray-500">
                Get instant AI-powered feedback to improve code quality,
                performance, and readability.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Responsive>
  );
};

export default HomePage;
