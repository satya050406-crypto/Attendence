import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StaffPanel from './StaffPanel';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import StaffHistory from './StaffHistory';
import Home from './Home';

function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('attendance_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.setItem('attendance_records', JSON.stringify(records));
  }, [records]);

  const handleCheckIn = (newRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/staff" element={<StaffPanel records={records} onCheckIn={handleCheckIn} />} />
          <Route
            path="/admin"
            element={
              isAdminAuthenticated
                ? <AdminPanel records={records} />
                : <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
            }
          />
          <Route
            path="/admin/history/:name"
            element={
              isAdminAuthenticated
                ? <StaffHistory records={records} />
                : <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
