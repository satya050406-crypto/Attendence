import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

function StaffHistory({ records }) {
    const { name } = useParams();

    // Filter and sort records for this specific staff member
    const staffRecords = useMemo(() => {
        if (!Array.isArray(records)) return [];
        return records
            .filter(r => r && r.name === name)
            .sort((a, b) => {
                const dateA = a.timestamp ? new Date(a.timestamp) : 0;
                const dateB = b.timestamp ? new Date(b.timestamp) : 0;
                return dateB - dateA;
            });
    }, [records, name]);

    // Calculate stats
    const stats = useMemo(() => {
        const total = staffRecords.length;
        const checkIns = staffRecords.filter(r => r.type !== 'check-out').length;
        const checkOuts = staffRecords.filter(r => r.type === 'check-out').length;
        const daysPresent = new Set(staffRecords.map(r => r.date)).size;

        return { total, checkIns, checkOuts, daysPresent };
    }, [staffRecords]);

    if (!staffRecords.length) {
        return (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Link to="/admin" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <h2>No records found for "{name}"</h2>
            </div>
        );
    }

    return (
        <div className="glass-card admin-card">
            <div className="card-header">
                <Link to="/admin" className="back-link">
                    <ArrowLeft size={20} /> Back
                </Link>
                <h1>{name}'s History</h1>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <div className="stat-card">
                    <div className="stat-value">{stats.daysPresent}</div>
                    <div className="stat-label">Days Present</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.checkIns}</div>
                    <div className="stat-label">Check-ins</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.checkOuts}</div>
                    <div className="stat-label">Check-outs</div>
                </div>
            </div>

            <div className="records-table-container">
                <h3>Timeline</h3>
                <div className="records-list">
                    {staffRecords.map(record => (
                        <div key={record.id} className="record-item">
                            <div className="record-info">
                                <span className="record-name" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: record.type === 'check-out' ? '#ff6b6b' : '#0af56a'
                                }}>
                                    {record.type === 'check-out' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                    {record.type === 'check-out' ? 'Checked Out' : 'Checked In'}
                                </span>
                                <span className="record-date"><Calendar size={14} /> {record.date}</span>
                            </div>
                            <div className="record-time">
                                <Clock size={14} style={{ marginRight: '4px', opacity: 0.7 }} />
                                {record.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StaffHistory;
