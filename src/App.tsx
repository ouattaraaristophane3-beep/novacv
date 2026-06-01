import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CVProvider, useCV } from './context/CVContext';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { CVEditor } from './components/cv-editor/CVEditor';
import { Loader2 } from 'lucide-react';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function DashboardWrapper() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createCV } = useCV();

  const handleCreateCV = async () => {
    if (!user) return;
    const id = await createCV(user.id);
    if (id) {
      navigate(`/cv/${id}`);
    }
  };

  const handleEditCV = (id: string) => {
    navigate(`/cv/${id}`);
  };

  return <Dashboard onCreateCV={handleCreateCV} onEditCV={handleEditCV} />;
}

function CVEditorWrapper() {
  const navigate = useNavigate();
  const { cvId } = useParams<{ cvId: string }>();

  if (!cvId) {
    navigate('/dashboard');
    return null;
  }

  return <CVEditor cvId={cvId} />;
}

function AuthPageWrapper() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthPage onSuccess={() => navigate('/dashboard')} />;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPageWrapper />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/cv/:cvId"
        element={
          <PrivateRoute>
            <CVEditorWrapper />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CVProvider>
          <AppContent />
        </CVProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
