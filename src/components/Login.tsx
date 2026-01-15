import { supabase } from '../lib/supabase';
import { Chrome, User as UserIcon } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert("Account created! If you disabled 'Confirm Email', you can log in now. Otherwise, check your email.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
        } catch (err: any) {
            setError(err.message + " (Ensure 'Anonymous' provider is enabled in Supabase)");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            background: 'var(--bg-primary)'
        }}>
            <div style={{
                width: '400px',
                padding: '40px',
                background: 'var(--bg-glass)',
                borderRadius: '24px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>War Room</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isSignUp ? 'Create a new account' : 'Sign in to your founder dashboard'}
                    </p>
                </div>

                {error && (
                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
                            placeholder="founder@startup.com"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{
                        marginTop: '0.5rem',
                        padding: '12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: loading ? 'gray' : 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}>
                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                    OR
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                </div>

                {/* Alternative Logins */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-subtle)',
                            background: 'white',
                            color: '#18181b',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <Chrome size={18} />
                        Sign in with Google
                    </button>

                    <button
                        onClick={handleGuestLogin}
                        disabled={loading}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-subtle)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'white',
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <UserIcon size={18} />
                        Continue as Guest
                    </button>
                    <p style={{ margin: 0, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        Guest accounts are temporary and limited to this session.
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <span
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </span>
                </div>

                <DebugAuth />
            </div>
        </div>
    );
};

export default Login;
