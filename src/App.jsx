import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import StaffPanel from './StaffPanel';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import StaffHistory from './StaffHistory';
import Home from './Home';

import { supabase } from './supabaseClient';

function App() {
  const [records, setRecords] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Fetch records from Supabase on mount
  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error);
      } else {
        setRecords(data || []);
      }
    };

    fetchRecords();

    // Set up real-time subscription
    const channel = supabase
      .channel('attendance_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, () => {
        fetchRecords();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCheckIn = async (newRecord) => {
    // Insert into Supabase
    const { data, error } = await supabase
      .from('attendance_records')
      .insert([newRecord])
      .select();

    if (error) {
      console.error('Error saving record:', error);
    } else {
      // Record will be updated via real-time subscription, or manually update state for better UX
      setRecords(prev => [data[0], ...prev]);
    }
  };

  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
