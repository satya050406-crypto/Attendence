import React, { useState } from 'react';
import { User, LogIn, LogOut, CheckCircle2, History, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function StaffPanel({ records, onCheckIn }) {
    const [name, setName] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastCheckIn, setLastCheckIn] = useState(null);

    const handleAction = (e, type) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newRecord = {
            id: Date.now(),
            name: name.trim(),
            type: type, // 'check-in' or 'check-out'
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString()
        };

        onCheckIn(newRecord);
        setLastCheckIn(newRecord);
        setShowSuccess(true);
        setName('');

        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

    const todayRecords = records.filter(r => r.date === new Date().toLocaleDateString());

    return (
        <div className="glass-card">
            <Link to="/" className="back-link">
                <ArrowLeft size={20} /> Back
            </Link>
            <h1>Staff Entry</h1>
            <p className="subtitle">Enter your name to register attendance</p>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                    <User className="icon" size={20} />
                    <input
                        type="text"
                        placeholder="Staff Member Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div className="action-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        onClick={(e) => handleAction(e, 'check-in')}
                        className="checkin-btn"
                        style={{ flex: 1 }}
                    >
                        <LogIn size={20} />
                        Check In
                    </button>
                    <button
                        onClick={(e) => handleAction(e, 'check-out')}
                        className="checkout-btn"
                        style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <LogOut size={20} />
                        Check Out
                    </button>
                </div>
            </form>

            <div className="history-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    <History size={18} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Recent Activity (Today)</span>
                </div>

                <div className="record-list">
                    {todayRecords.length === 0 ? (
                        <p className="no-records">No records yet today</p>
                    ) : (
                        todayRecords.slice(0, 5).map((record) => (
                            <div key={record.id} className="history-item">
                                <div className="name">
                                    {record.name}
                                    <span style={{
                                        fontSize: '0.75rem',
                                        marginLeft: '0.5rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        background: record.type === 'check-out' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(10, 245, 106, 0.2)',
                                        color: record.type === 'check-out' ? '#ff6b6b' : '#0af56a'
                                    }}>
                                        {record.type === 'check-out' ? 'OUT' : 'IN'}
                                    </span>
                                </div>
                                <div className="time">{record.time}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-icon">
                        <CheckCircle2 size={48} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>
                        {lastCheckIn?.type === 'check-out' ? 'Checked Out!' : 'Checked In!'}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {lastCheckIn?.name} {lastCheckIn?.type === 'check-out' ? 'left' : 'arrived'} at {lastCheckIn?.time}
                    </p>
                </div>
            )}
        </div>
    );
}

export default StaffPanel;
