import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '0504081981@s') {
            onLogin();
        } else {
            setError('Invalid password');
            setPassword('');
        }
    };

    return (
        <div className="login-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="glass-card login-card" style={{
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div className="icon-wrapper" style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    marginBottom: '1.5rem'
                }}>
                    <Lock size={32} />
                </div>

                <h2 style={{ marginBottom: '1.5rem' }}>Admin Access</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter Password"
                            className="glass-input"
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(0, 0, 0, 0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                            autoFocus
                        />
                    </div>

                    {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        Login <ArrowRight size={16} />
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem' }}>
                    <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
