import React from 'react';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminPanel({ records }) {
    // Sort records by timestamp descending (newest first)
    const sortedRecords = [...records].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="glass-card admin-card">
            <div className="card-header">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} /> Back
                </Link>
                <h1>Admin Dashboard</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{records.length}</div>
                    <div className="stat-label">Total Check-ins</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{new Set(records.map(r => r.name)).size}</div>
                    <div className="stat-label">Unique Staff</div>
                </div>
            </div>

            <div className="records-table-container">
                <h3>All Records</h3>
                {sortedRecords.length === 0 ? (
                    <p className="no-records">No attendance records found.</p>
                ) : (
                    <div className="records-list">
                        {sortedRecords.map(record => (
                            <div key={record.id} className="record-item">
                                <div className="record-info">
                                    <span className="record-name">
                                        <User size={16} />
                                        <Link
                                            to={`/admin/history/${record.name}`}
                                            style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed currentColor' }}
                                            title="View History"
                                            onMouseOver={(e) => e.target.style.opacity = 0.8}
                                            onMouseOut={(e) => e.target.style.opacity = 1}
                                        >
                                            {record.name}
                                        </Link>
                                    </span>
                                    <span className="record-date"><Calendar size={14} /> {record.date}</span>
                                </div>
                                <div className="record-time" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                                    <span>{record.time}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        background: record.type === 'check-out' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(10, 245, 106, 0.2)',
                                        color: record.type === 'check-out' ? '#ff6b6b' : '#0af56a',
                                        fontWeight: 600
                                    }}>
                                        {record.type === 'check-out' ? 'CHECK OUT' : 'CHECK IN'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;
