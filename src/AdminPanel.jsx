import React, { useState, useMemo } from 'react';
import { ArrowLeft, User, Calendar, Filter, Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

function AdminPanel({ records }) {
    // State for the selected month (YYYY-MM)
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    // Filter records by selected month
    const filteredRecords = useMemo(() => {
        if (!selectedMonth) return records;
        return records.filter(record => {
            if (!record.timestamp) return false;
            const recordDate = new Date(record.timestamp);
            const recordMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
            return recordMonth === selectedMonth;
        });
    }, [records, selectedMonth]);

    // Sort records by timestamp descending (newest first)
    const sortedRecords = [...filteredRecords].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Stats for the filtered month
    const stats = useMemo(() => {
        const total = filteredRecords.length;
        const checkIns = filteredRecords.filter(r => r.type !== 'check-out').length;
        const checkOuts = filteredRecords.filter(r => r.type === 'check-out').length;
        const uniqueStaff = new Set(filteredRecords.map(r => r.name)).size;
        return { total, checkIns, checkOuts, uniqueStaff };
    }, [filteredRecords]);

    const downloadCSV = () => {
        if (sortedRecords.length === 0) return;

        const headers = ['Name', 'Date', 'Time', 'Type'];
        const csvRows = [
            headers.join(','),
            ...sortedRecords.map(record => [
                `"${record.name}"`,
                `"${record.date}"`,
                `"${record.time}"`,
                `"${record.type.toUpperCase()}"`
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `attendance_${selectedMonth || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearRecords = async () => {
        if (window.confirm('Are you sure you want to delete all attendance records from the cloud? This action cannot be undone.')) {
            const { error } = await supabase
                .from('attendance_records')
                .delete()
                .neq('id', 0); // Delete all rows (neq id 0 is a safe way to target all)

            if (error) {
                console.error('Error clearing records:', error);
                alert('Failed to clear records. Check console for details.');
            } else {
                // The real-time subscription in App.jsx will update the state
                alert('All records have been cleared.');
            }
        }
    };

    return (
        <div className="glass-card admin-card">
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} /> Back
                    </Link>
                    <h1>Admin Dashboard</h1>
                </div>

                <div className="admin-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <div className="filter-container" style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <Filter size={18} style={{ opacity: 0.7 }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.8 }}>View Month:</span>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                outline: 'none',
                                cursor: 'pointer',
                                flex: 1
                            }}
                        />
                        {selectedMonth && (
                            <button
                                onClick={() => setSelectedMonth('')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <button
                        onClick={downloadCSV}
                        className="admin-btn download-btn"
                        title="Download CSV"
                        disabled={sortedRecords.length === 0}
                        style={{
                            background: 'rgba(10, 245, 106, 0.1)',
                            border: '1px solid rgba(10, 245, 106, 0.2)',
                            color: '#0af56a',
                            borderRadius: '12px',
                            padding: '0 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: sortedRecords.length === 0 ? 'not-allowed' : 'pointer',
                            opacity: sortedRecords.length === 0 ? 0.5 : 1
                        }}
                    >
                        <Download size={18} />
                        <span className="btn-text">Save CSV</span>
                    </button>

                    <button
                        onClick={clearRecords}
                        className="admin-btn clear-btn"
                        title="Clear All Data"
                        style={{
                            background: 'rgba(255, 107, 107, 0.1)',
                            border: '1px solid rgba(255, 107, 107, 0.2)',
                            color: '#ff6b6b',
                            borderRadius: '12px',
                            padding: '0 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Logs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.uniqueStaff}</div>
                    <div className="stat-label">Unique Staff</div>
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
                <h3>{selectedMonth ? `Records for ${new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}` : 'All Records'}</h3>
                {sortedRecords.length === 0 ? (
                    <p className="no-records">No attendance records found for this period.</p>
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
