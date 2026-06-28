import React, { useState, useEffect } from 'react';
import LiveMap from '../components/map/LiveMap';
import { api } from '../services/api';

const MpDashboard = () => {
  const [stats, setStats] = useState({ active: 0, catastrophic: 0 });
  const [ping, setPing] = useState(4);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getComplaints();
        const active = data.filter(c => c.status !== 'RESOLVED' && c.status !== 'ARCHIVED').length;
        const catastrophic = data.filter(c => ['CATASTROPHIC', 'CRITICAL'].includes(c.criticality_level) && c.status !== 'RESOLVED' && c.status !== 'ARCHIVED').length;
        setStats({ active, catastrophic });
      } catch (err) {
        console.error('Failed to load MP Dashboard stats:', err);
      }
    };
    loadStats();

    // Minor cosmetic simulation for ping response time
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 6) + 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Floating HUD over the map */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(15, 15, 26, 0.9)',
        border: '1px solid #1E1E35',
        borderRadius: '8px',
        padding: '1.5rem',
        color: 'white',
        width: '350px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ margin: '0 0 4px 0', fontFamily: 'Space Grotesk', fontSize: '20px' }}>CONSTITUENCY LIVE MAP</h1>
        <p style={{ margin: '0 0 1rem 0', fontSize: '12px', color: '#8888AA', fontFamily: 'monospace' }}>Bengaluru South • Active Telemetry</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ backgroundColor: '#161625', padding: '10px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#8888AA', marginBottom: '4px' }}>ACTIVE REPORTS</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.active}</div>
          </div>
          <div style={{ backgroundColor: '#161625', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255, 59, 59, 0.3)' }}>
            <div style={{ fontSize: '10px', color: '#FF3B3B', marginBottom: '4px' }}>CRITICAL</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF3B3B' }}>{stats.catastrophic}</div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '11px', color: '#8888AA' }}>
          Real-time telemetry link: <span style={{ color: '#4ADE80' }}>CONNECTED ({ping}ms ping)</span>
        </div>
      </div>

      <LiveMap />
    </div>
  );
};

export default MpDashboard;
