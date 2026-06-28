import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, Activity, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import '../pages/Dashboard.css';

import { api } from '../services/api';
import { useToast } from '../components/Toast';

const MpOverview = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [complaints, setComplaints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await api.getComplaints();
        setComplaints(data);
      } catch (err) {
        console.error('Failed to load MP complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div style={{ color: 'white', padding: '3rem', fontFamily: 'Space Grotesk', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>ACCESSING SECURE CONSTITUENCY TELEMETRY...</h2>
      </div>
    );
  }

  const totalCount = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;
  const pendingCount = complaints.filter(c => ['FILED', 'ASSIGNED', 'VIEWED', 'IN_PROGRESS'].includes(c.status)).length;
  const criticalCount = complaints.filter(c => ['CRITICAL', 'CATASTROPHIC'].includes(c.criticality_level) && c.status !== 'RESOLVED').length;

  // Filter urgent escalations assigned to MP/Ministry or escalated
  const urgentEscalations = complaints
    .filter(c => (c.assigned_tier >= 3 || c.status === 'ESCALATED') && c.status !== 'RESOLVED')
    .slice(0, 4);

  return (
    <div className="dashboard-body" style={{ backgroundColor: 'transparent' }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-title">
            <h1 style={{ fontFamily: 'Space Grotesk', textTransform: 'uppercase' }}>
              CONSTITUENCY TELEMETRY
            </h1>
          </div>
          <div className="system-status">
            SYS_SECTOR: <span style={{ color: '#8B9DFF', fontWeight: 600 }}>BENGALURU SOUTH</span> // ACCOUNTABILITY WATCH: ENFORCED
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total Active Issues</span>
          </div>
          <div className="stat-value">
            {totalCount} <span className="stat-trend">&uarr;12% WoW</span>
          </div>
          <div className="stat-bg-icon"><Activity size={48} /></div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span>Resolved Incidents</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--cyber-emerald)' }}>
            {resolvedCount} <span className="stat-trend" style={{ color: 'var(--cyber-emerald)', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>{((resolvedCount / (totalCount || 1)) * 100).toFixed(0)}% RATE</span>
          </div>
          <div className="stat-bg-icon"><CheckCircle size={48} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Pending Action</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--cyber-amber)' }}>
            {pendingCount} <span className="stat-trend" style={{ color: 'var(--cyber-amber)', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>QUEUE</span>
          </div>
          <div className="stat-bg-icon"><Clock size={48} /></div>
        </div>

        <div className="stat-card critical">
          <div className="stat-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FCA5A5' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#EF4444', boxShadow: '0 0 6px #EF4444' }}></span>
              Critical Escalations
            </span>
          </div>
          <div className="stat-value" style={{ color: '#FCA5A5' }}>
            {criticalCount} <span className="stat-trend critical-trend">IMMEDIATE</span>
          </div>
          <div className="stat-bg-icon" style={{ color: '#EF4444' }}><AlertCircle size={48} /></div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="dashboard-split">
        
        {/* Urgent Escalations Queue */}
        <div className="queue-section">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', letterSpacing: '0.05em', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="#EF4444" /> URGENT ESCALATIONS (MP TIER)
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {urgentEscalations.map(item => (
              <div 
                key={item.id} 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.01)', 
                  border: '1px solid var(--border-glass)', 
                  borderLeft: `4px solid ${['CATASTROPHIC', 'CRITICAL'].includes(item.criticality_level) ? 'var(--cyber-rose)' : 'var(--cyber-amber)'}`,
                  padding: '1.25rem 1.5rem', 
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'var(--transition-smooth)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.01)';
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                  e.currentTarget.style.transform = 'none';
                }}
                onClick={() => navigate(`/official/complaint/${item.id}`)}
              >
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', alignItems: 'center' }}>
                    <span className={`badge ${['critical', 'catastrophic'].includes(item.criticality_level.toLowerCase()) ? 'badge-severe' : 'badge-high'}`} style={{ padding: '0.15rem 0.45rem', fontSize: '0.62rem' }}>
                       {item.criticality_level}
                    </span>
                    <span style={{ color: 'var(--cyber-indigo)', fontWeight: 600 }}>#{item.id.substring(0, 8).toUpperCase()}</span>
                    <span style={{ color: 'var(--text-muted)' }}>📍 {item.ward}</span>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: 'white', fontWeight: 600, letterSpacing: '-0.01em' }}>
                    {item.text_original || item.text_content}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Status: <span style={{ color: 'white', fontWeight: 500 }}>{item.status}</span> · Priority: <span style={{ color: 'var(--cyber-cyan)', fontWeight: 600 }}>{item.star_rating} Stars</span>
                  </p>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '8px', 
                    fontSize: '0.72rem', 
                    fontFamily: 'var(--font-mono)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    flexShrink: 0
                  }}
                >
                  INTERVENE <ArrowRight size={14} />
                </button>
              </div>
            ))}
            {urgentEscalations.length === 0 && (
              <div style={{ color: 'var(--text-muted)', padding: '2rem', fontStyle: 'italic', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed var(--border-glass)' }}>
                No urgent escalations at this time.
              </div>
            )}
          </div>
        </div>

        {/* Side Cognitive Panel */}
        <div className="side-panel">
          <div className="intel-brief">
            <div className="intel-header">
              <Sparkles size={14} color="#8B9DFF" /> AI COGNITIVE TELEMETRY
            </div>
            <div className="intel-content">
              <p style={{ color: 'white', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <strong>CONSTITUENCY HEALTH BRIEF:</strong> Live telemetry for Bengaluru South indicates an optimal overall resolution rate of <strong>74%</strong>. However, Ward 7 shows localized bottlenecks.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                System recommends routing extra water tankers to Sector 4 and validating the pipeline repairs currently marked under verification.
              </p>
            </div>
            <button className="btn-outline" onClick={() => showToast('DPR brief compiled.', 'success')}>
              GENERATE ACTION BRIEF
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MpOverview;
