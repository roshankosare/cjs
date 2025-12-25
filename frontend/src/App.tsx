import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header/header";
import SignInPage from "./pages/signin";
import SignUpPage from "./pages/singup";
import HomePage from "./pages/home";
import { AuthProvider } from "./auth/AuthProvider";
import SolutionPage from "./pages/solution-page";

function App() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-linear-to-b from-white to-blue-200">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <div className="px-2 py-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path={`/problems/:id/solution`}
                element={<SolutionPage />}
              />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
