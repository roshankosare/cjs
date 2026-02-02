import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header/header";
import SignInPage from "./pages/signin";
import SignUpPage from "./pages/singup";
import HomePage from "./pages/home";
import { AuthProvider } from "./auth/AuthProvider";
import SolutionPage from "./pages/solution-page";
import ProblemListPage from "./pages/problem-list-page";
import CreateProblem from "./pages/create-problem";
import AdminProblemListPage from "./pages/admin-problem-list";
import EditProblem from "./pages/edit-problem";
import AdminDashboard from "./components/admin/admin-dashboard";
import AdminGuard from "./components/auth/admin-guard";
import UserProfilePage from "./pages/user-profile-page";
import AdminMcqPage from "./pages/admin-mcq-page";
import CreateMcqPage from "./pages/create-mcq-page";
import EditMcqPage from "./pages/edit-mcq-page";
import UserGuard from "./components/auth/user-guard";
import McqPage from "./pages/mcq-page";
import QuizHistoryPage from "./pages/quiz-history-page";
import QuizResults from "./components/mcq/quiz-results";


function App() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <div className="px-2 py-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/problems" element={<ProblemListPage />}></Route>
              <Route
                path={`/problems/:slug/solution`}
                element={<SolutionPage />}
              />

              <Route
                path="/mcq"
                element={
                  <UserGuard>
                    <McqPage />
                  </UserGuard>
                }
              />

              <Route
                path="/mcq/history"
                element={
                  <UserGuard>
                    <QuizHistoryPage />
                  </UserGuard>
                }
              />

              <Route
                 path="/mcq/quiz/:sessionId/result"
                 element={
                   <UserGuard>
                     <div className="container mx-auto px-4 py-8">
                        <QuizResults 
                          sessionId={0} // This will be handled by the component using useParams 
                          onStartNewQuiz={() => window.location.href = '/mcq'} 
                        />
                     </div>
                   </UserGuard>
                 }
              />

              {/* User routes */}

              <Route path="/profile" element={
                
                <UserGuard>
                  <UserProfilePage />
                </UserGuard>}></Route>

              {/*Admin Routes */}

              <Route
                path="/admin/create-problem"
                element={
                  <AdminGuard>
                    <CreateProblem />
                  </AdminGuard>
                }
              ></Route>

              <Route
                path="/admin/problems/:slug/edit"
                element={
                  <AdminGuard>
                    <EditProblem />
                  </AdminGuard>
                }
              ></Route>

              <Route
                path="/admin/problems"
                element={
                  <AdminGuard>
                    <AdminProblemListPage />
                  </AdminGuard>
                }
              ></Route>

              <Route
                path="/admin/dashboard"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              ></Route>

              <Route
                path="/admin/mcq"
                element={
                  <AdminGuard>
                    <AdminMcqPage />
                  </AdminGuard>
                }
              ></Route>

              <Route
                path="/admin/mcq/create"
                element={
                  <AdminGuard>
                    <CreateMcqPage />
                  </AdminGuard>
                }
              ></Route>

              <Route
                path="/admin/mcq/:id/edit"
                element={
                  <AdminGuard>
                    <EditMcqPage />
                  </AdminGuard>
                }
              ></Route>
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
