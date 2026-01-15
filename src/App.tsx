import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TrackingEnv from './components/TrackingEnv';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AuthenticatedApp() {
    const { user, loading } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');

    if (loading) return <div style={{ height: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'gray' }}>Loading...</div>;

    if (!user) {
        return <Login />;
    }

    return (
        <Layout currentView={currentView} onNavigate={setCurrentView}>
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'tracing' && <TrackingEnv />}
            {currentView === 'settings' && <div style={{ padding: '2rem' }}><h1>Settings</h1><p>Configuration placeholders...</p></div>}
        </Layout>
    );
}

function App() {
    return (
        <AuthProvider>
            <AuthenticatedApp />
        </AuthProvider>
    );
}

export default App;
