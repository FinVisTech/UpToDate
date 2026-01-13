import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TrackingEnv from './components/TrackingEnv';
import Login from './components/Login';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <Layout currentView={currentView} onNavigate={setCurrentView}>
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'tracing' && <TrackingEnv />}
            {currentView === 'settings' && <div style={{ padding: '2rem' }}><h1>Settings</h1><p>Configuration placeholders...</p></div>}
        </Layout>
    )
}

export default App;
