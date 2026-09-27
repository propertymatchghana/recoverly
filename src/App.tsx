import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AppLayout } from '@/components/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UploadPage } from '@/pages/UploadPage';
import { ColumnMappingPage } from '@/pages/ColumnMappingPage';
import { AnalysisResultsPage } from '@/pages/AnalysisResultsPage';
import { ActionDetailsPage } from '@/pages/ActionDetailsPage';
import { MessageGeneratorPage } from '@/pages/MessageGeneratorPage';
import { MoneyPage } from '@/pages/MoneyPage';
import { SalesPage } from '@/pages/SalesPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { ActionsPage } from '@/pages/ActionsPage';
import { SettingsPage } from '@/pages/SettingsPage';

type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'upload'
  | 'mapping'
  | 'analysis'
  | 'action'
  | 'message'
  | 'money'
  | 'sales'
  | 'customers'
  | 'actions'
  | 'settings';

function AppContent() {
  const { state, loadDemoData } = useApp();
  const [page, setPage] = useState<Page>('landing');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (state.isAuth && page === 'landing') {
      setPage('dashboard');
    }
  }, [state.isAuth, page]);

  const handleNavigate = (p: string) => {
    setPage(p as Page);
  };

  const handleViewDetails = (id: string) => {
    setActionId(id);
    setPage('action');
  };

  const handleGenerateMessage = (id: string) => {
    setActionId(id);
    setPage('message');
  };

  const handleDemo = () => {
    loadDemoData();
    setPage('dashboard');
  };

  const handleParsed = () => setPage('mapping');
  const handleMappingComplete = () => setPage('analysis');
  const handleAnalysisComplete = () => setPage('dashboard');

  if (page === 'landing') {
    return (
      <LandingPage
        onTry={() => setPage('signup')}
        onLogin={() => setPage('login')}
      />
    );
  }

  if (page === 'login') {
    return (
      <AuthPage
        mode="login"
        onAuth={() => setPage('dashboard')}
        onSwitch={() => setPage('signup')}
      />
    );
  }

  if (page === 'signup') {
    return (
      <AuthPage
        mode="signup"
        onAuth={() => setPage('dashboard')}
        onSwitch={() => setPage('login')}
      />
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <DashboardPage
            onViewDetails={handleViewDetails}
            onGenerateMessage={handleGenerateMessage}
            onLoadDemo={handleDemo}
            onUpload={() => setPage('upload')}
          />
        );

      case 'upload':
        return <UploadPage onParsed={handleParsed} onDemo={handleDemo} />;

      case 'mapping':
        return <ColumnMappingPage onComplete={handleMappingComplete} />;

      case 'analysis':
        return (
          <AnalysisResultsPage onContinue={handleAnalysisComplete} />
        );

      case 'action':
        return actionId ? (
          <ActionDetailsPage
            recordId={actionId}
            onBack={() => setPage('dashboard')}
            onGenerateMessage={() => setPage('message')}
          />
        ) : (
          <DashboardPage
            onViewDetails={handleViewDetails}
            onGenerateMessage={handleGenerateMessage}
            onLoadDemo={handleDemo}
            onUpload={() => setPage('upload')}
          />
        );

      case 'message':
        return actionId ? (
          <MessageGeneratorPage
            recordId={actionId}
            onBack={() => setPage('dashboard')}
          />
        ) : (
          <DashboardPage
            onViewDetails={handleViewDetails}
            onGenerateMessage={handleGenerateMessage}
            onLoadDemo={handleDemo}
            onUpload={() => setPage('upload')}
          />
        );

      case 'money':
        return (
          <MoneyPage
            onViewDetails={handleViewDetails}
            onGenerateMessage={handleGenerateMessage}
          />
        );

      case 'sales':
        return (
          <SalesPage
            onViewDetails={handleViewDetails}
            onGenerateMessage={handleGenerateMessage}
          />
        );

      case 'customers':
        return (
          <CustomersPage
            onViewDetails={handleViewDetails}
            onGenerateMessage={handleGenerateMessage}
          />
        );

      case 'actions':
        return (
          <ActionsPage
            onViewDetails={handleViewDetails}
            onGenerateMessage={handleGenerateMessage}
          />
        );

      case 'settings':
        return <SettingsPage />;

      default:
        return (
          <DashboardPage
            onViewDetails={handleViewDetails}
            onGenerateMessage={handleGenerateMessage}
            onLoadDemo={handleDemo}
            onUpload={() => setPage('upload')}
          />
        );
    }
  };

  return (
    <AppLayout
      currentPage={page}
      onNavigate={handleNavigate}
    >
      {renderPage()}
    </AppLayout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
