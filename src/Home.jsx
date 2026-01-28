import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ShieldCheck } from 'lucide-react';

function Home() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home-container">
            <div className="time-header">
                <div className="date-display">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div className="time-display">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </div>
            </div>

            <h1 className="main-title">Attendance System</h1>
            <p className="main-subtitle">Select your portal to continue</p>

            <div className="portal-cards">
                <Link to="/staff" className="portal-card staff-portal">
                    <div className="portal-icon">
                        <UserCheck size={40} />
                    </div>
                    <h2>Staff Entry</h2>
                    <p>Mark your daily attendance here</p>
                </Link>

                <Link to="/admin" className="portal-card admin-portal">
                    <div className="portal-icon">
                        <ShieldCheck size={40} />
                    </div>
                    <h2>Admin Dashboard</h2>
                    <p>View reports and history</p>
                </Link>
            </div>
        </div>
    );
}

export default Home;
