import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Existing imports
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Existing Questionnaire component (assuming it's in src/components/Questionnaire.tsx)
import Questionnaire from "./components/Questionnaire";

// NEW: Import the ResultsPage component (assuming it's in src/ResultsPage.tsx)
import ResultsPage from "../src/pages/ResultsPage";
import StartAssessment from "./pages/StartAssessment";
import SkillRoadmap from "./pages/SkillRoadmap";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      
          <Route path="/start-assessment" element={<StartAssessment />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          {/* NEW: Route for the results page */}
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/roadmap" element={<SkillRoadmap />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;