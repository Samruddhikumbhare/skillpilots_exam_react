// start on 11 March 2025 by medha

import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Level from "./pages/Level/Level";
import Instruction from "./pages/Instruction/Instruction";
import Exam from "./pages/Exam/Exam";
import LoginPage from "./pages/Login/Login";
import tokenHandler from "./hooks/tokenHandler";
import { QuestionProvider } from "./context/QuestionProvider";
import Certificate from "./pages/Certificate/Certificate";

// set all routes
function App() {
  const token = tokenHandler();
  
  return (
    <Box>
      <QuestionProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={token !== "" ? <Dashboard /> : <LoginPage />}
            />
            <Route path="/exam/:lan" element={<Level />} />
            <Route
              path="/instruction/:testName/:lan/:level"
              element={<Instruction />}
            />
            <Route path="/startexam/:testId/:level" element={<Exam />} />
            <Route path="/certificate/:id" element={<Certificate />} />

            {/* Catch-all route for unknown URLs */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QuestionProvider>
    </Box>
  );
}

export default App;
