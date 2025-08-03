import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import StudentLogin from './pages/student-login';
import AskQuestion from './pages/ask-question';
import StudentDashboard from './pages/student-dashboard';
import UserRegistration from './pages/user-registration';
import BrowseQuestions from './pages/browse-questions';
import UserProfile from './pages/user-profile';
import QuestionDetails from './pages/question-details';
import AnswerQuestion from './pages/answer-question';
import Leaderboard from './pages/leaderboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<UserRegistration />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/ask-question" element={<AskQuestion />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/user-registration" element={<UserRegistration />} />
          <Route path="/browse-questions" element={<BrowseQuestions />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/question-details/:id" element={<QuestionDetails />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/answer-question" element={<AnswerQuestion />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
