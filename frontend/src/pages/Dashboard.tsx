import React, { useState, useEffect, useMemo } from 'react';

// ==================== SVG ICONS ====================
const ShieldIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const AlertTriangleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ActivityIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ServerIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const RadioIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.83a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
  </svg>
);

const SearchIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const TerminalIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const CpuIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const CrosshairIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

const LockIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const RefreshIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const UserIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CheckCircleIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ==================== MOCK DATA ====================
const INITIAL_ALERTS = [
  { id: 'ALT-8902', severity: 'CRITICAL', title: 'Ransomware Canary Triggered: Unauthorized Encrypted File Write', source: '10.0.4.112', host: 'DC-PRIMARY-01', mitre: 'T1486 Data Encrypted', time: 'Just now', status: 'Active' },
  { id: 'ALT-8901', severity: 'HIGH', title: 'LSASS Memory Dump Attempt via Mimikatz Signature', source: '192.168.1.84', host: 'FINANCE-PC-09', mitre: 'T1003.001 OS Credential Dumping', time: '1m ago', status: 'Investigating' },
  { id: 'ALT-8900', severity: 'CRITICAL', title: 'Anomalous Lateral Movement - Kerberoasting Ticket Request', source: '10.0.2.45', host: 'DEV-SRV-04', mitre: 'T1558.003 Steal or Forge Kerberos', time: '4m ago', status: 'Contained' },
  { id: 'ALT-8899', severity: 'MEDIUM', title: 'Multiple Failed SSH Authentication Spikes (Brute-Force)', source: '185.220.101.4', host: 'EDGE-GW-02', mitre: 'T1110.001 Password Guessing', time: '9m ago', status: 'Triaged' },
  { id: 'ALT-8898', severity: 'HIGH', title: 'Powershell Encoded Command Executed from Temp Directory', source: '10.0.8.210', host: 'WORKSTATION-142', mitre: 'T1059.001 PowerShell', time: '14m ago', status: 'Closed' },
  { id: 'ALT-8897', severity: 'LOW', title: 'Outbound Connection to Newly Registered Domain (NRD)', source: '10.0.1.15', host: 'HR-LAPTOP-03', mitre: 'T1071.001 Web Protocols', time: '22m ago', status: 'Closed' },
];

const INITIAL_INCIDENTS = [
  { id: 'INC-2026-041', title: 'APT29 Spearphishing Payload Execution & Credential Harvesting', severity: 'CRITICAL', status: 'In Progress', assignee: 'Alex Mercer', priority: 'P1', SLA: '3m remaining', alertsCount: 7 },
  { id: 'INC-2026-040', title: 'Suspicious Administrative Account Elevation on Domain Controller', severity: 'HIGH', status: 'Investigating', assignee: 'Sarah Connor', priority: 'P2', SLA: '24m remaining', alertsCount: 3 },
  { id: 'INC-2026-039', title: 'Exfiltration Spike to Unfiltered Cloud Storage Endpoint', severity: 'MEDIUM', status: 'Triaged', assignee: 'David Vance', priority: 'P3', SLA: '1h 15m remaining', alertsCount: 2 },
];

const MITRE_TACTICS = [
  { code: 'TA0001', name: 'Initial Access', count: 18, coverage: '94%', color: '#27D8F5' },
  { code: 'TA0002', name: 'Execution', count: 42, coverage: '88%', color: '#647DFF' },
  { code: 'TA0003', name: 'Persistence', count: 29, coverage: '91%', color: '#38BDF8' },
  { code: 'TA0004', name: 'Privilege Escalation', count: 15, coverage: '85%', color: '#FFB547' },
  { code: 'TA0005', name: 'Defense Evasion', count: 34, coverage: '79%', color: '#F43F5E' },
  { code: 'TA0006', name: 'Credential Access', count: 27, coverage: '96%', color: '#FF4D67' },
  { code: 'TA0008', name: 'Lateral Movement', count: 12, coverage: '82%', color: '#A855F7' },
  { code: 'TA0011', name: 'Command & Control', count: 21, coverage: '90%', color: '#20C997' },
];

const ENDPOINT_FLEET = [
  { id: 'EP-01', host: 'DC-PRIMARY-01', os: 'Windows Server 2022', ip: '10.0.4.112', status: 'WARNING', agent: 'Sentinel Agent v4.1', lastSeen: 'Just now' },
  { id: 'EP-02', host: 'FINANCE-PC-09', os: 'Windows 11 Pro', ip: '192.168.1.84', status: 'COMPROMISED', agent: 'Sentinel Agent v4.1', lastSeen: '1m ago' },
  { id: 'EP-03', host: 'DEV-SRV-04', os: 'Ubuntu 22.04 LTS', ip: '10.0.2.45', status: 'ISOLATED', agent: 'Sentinel Agent v4.0', lastSeen: '2m ago' },
  { id: 'EP-04', host: 'EDGE-GW-02', os: 'Debian 12 Firewall', ip: '185.220.101.4', status: 'HEALTHY', agent: 'Sentinel Agent v4.1', lastSeen: 'Just now' },
  { id: 'EP-05', host: 'WORKSTATION-142', os: 'Windows 11 Pro', ip: '10.0.8.210', status: 'HEALTHY', agent: 'Sentinel Agent v4.1', lastSeen: 'Just now' },
  { id: 'EP-06', host: 'HR-LAPTOP-03', os: 'macOS Sonoma', ip: '10.0.1.15', status: 'HEALTHY', agent: 'Sentinel Agent v4.1', lastSeen: '3m ago' },
];

const THREAT_INTEL = [
  { type: 'IPv4', value: '185.220.101.4', severity: 'CRITICAL', confidence: '98%', actor: 'APT29 / Cozy Bear', tags: ['Tor Exit', 'C2 Server'] },
  { type: 'MD5 Hash', value: '44d88612fea8a8f36de82e1278abb02f', severity: 'CRITICAL', confidence: '100%', actor: 'LockBit 3.0', tags: ['Ransomware', 'Payload'] },
  { type: 'Domain', value: 'auth-sec-verify-login.com', severity: 'HIGH', confidence: '92%', actor: 'Phishing Operations', tags: ['Credential Harvester'] },
];

const AUDIT_LOGS = [
  { id: 'AUD-901', time: '11:52:10 UTC', user: 'Alex Mercer', action: 'HOST_ISOLATED', target: 'DEV-SRV-04', status: 'SUCCESS' },
  { id: 'AUD-900', time: '11:48:02 UTC', user: 'System Service', action: 'RULE_TRIGGERED', target: 'ALT-8902', status: 'SUCCESS' },
  { id: 'AUD-899', time: '11:30:15 UTC', user: 'Sarah Connor', action: 'INCIDENT_CREATED', target: 'INC-2026-041', status: 'SUCCESS' },
  { id: 'AUD-898', time: '11:15:00 UTC', user: 'Alex Mercer', action: 'USER_LOGIN_MFA', target: 'alex.mercer@sentinelx.io', status: 'SUCCESS' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'incidents' | 'mitre' | 'endpoints' | 'intel' | 'rules' | 'audit'>('overview');
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [endpoints, setEndpoints] = useState(ENDPOINT_FLEET);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());
  const [selectedAlert, setSelectedAlert] = useState<typeof INITIAL_ALERTS[0] | null>(null);

  // Modals & Drawers
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Live time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live incoming threat ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        id: `ALT-${Math.floor(8903 + Math.random() * 500)}`,
        severity: Math.random() > 0.6 ? 'CRITICAL' : Math.random() > 0.4 ? 'HIGH' : 'MEDIUM',
        title: [
          'Suspicious Process Injection Into Svchost.exe',
          'Shadow Copy Deletion Command Detected via vssadmin',
          'Potential Cobalt Strike Beacon Traffic Observed',
          'Unauthorized Active Directory Schema Modification Query',
        ][Math.floor(Math.random() * 4)],
        source: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 250)}`,
        host: `NODE-SEC-${Math.floor(Math.random() * 90 + 10)}`,
        mitre: 'T1055 Process Injection',
        time: 'Just now',
        status: 'Active',
      };
      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return { bg: '#2C0D15', border: '#FF4D67', text: '#FF4D67', badge: '#FF4D6722' };
      case 'HIGH':
        return { bg: '#2B1A0E', border: '#FFB547', text: '#FFB547', badge: '#FFB54722' };
      case 'MEDIUM':
        return { bg: '#182438', border: '#27D8F5', text: '#27D8F5', badge: '#27D8F522' };
      default:
        return { bg: '#111C2D', border: '#94A3B8', text: '#94A3B8', badge: '#94A3B822' };
    }
  };

  const handleIsolateHost = (hostName: string) => {
    setEndpoints((prev) =>
      prev.map((e) => (e.host === hostName ? { ...e, status: 'ISOLATED' } : e))
    );
    alert(`⚡ HOST ISOLATION COMMAND DISPATCHED: ${hostName} is now air-gapped from the network.`);
  };

  // Filtered alerts for search bar
  const filteredAlerts = useMemo(() => {
    if (!searchQuery) return alerts;
    const q = searchQuery.toLowerCase();
    return alerts.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.host.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.mitre.toLowerCase().includes(q)
    );
  }, [alerts, searchQuery]);

  // ==================== AUTHENTICATION SCREEN (LOGIN / SIGNUP) ====================
  if (isLoggedOut) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#080D16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        color: '#F1F5FA',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#0B1220',
          border: '1px solid #27D8F544',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
        }}>
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #27D8F5 0%, #647DFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(39, 216, 245, 0.4)'
            }}>
              <ShieldIcon size={24} color="#080D16" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '1px' }}>SENTINEL-X</div>
              <div style={{ fontSize: '11px', color: '#27D8F5' }}>Intelligent SOC Operations Platform</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              {authMode === 'login' ? 'Analyst Authentication' : 'Create SOC Analyst Credentials'}
            </h2>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
              {authMode === 'login' ? 'Enter security credentials to access active telemetry' : 'Register new analyst profile on security gateway'}
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedOut(false); }}>
            {authMode === 'signup' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  style={{ width: '100%', height: '42px', backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '8px', padding: '0 14px', color: '#F1F5FA', fontSize: '13px', outline: 'none' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Corporate Email / ID</label>
              <input
                type="email"
                required
                defaultValue="alex.mercer@sentinelx.io"
                style={{ width: '100%', height: '42px', backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '8px', padding: '0 14px', color: '#F1F5FA', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Security Password</label>
              <input
                type="password"
                required
                defaultValue="••••••••••••"
                style={{ width: '100%', height: '42px', backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '8px', padding: '0 14px', color: '#F1F5FA', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                height: '44px',
                background: 'linear-gradient(135deg, #27D8F5 0%, #647DFF 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#080D16',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(39, 216, 245, 0.3)'
              }}
            >
              {authMode === 'login' ? 'Authenticate & Enter SOC' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#94A3B8' }}>
            {authMode === 'login' ? (
              <span>Need analyst credentials? <button onClick={() => setAuthMode('signup')} style={{ color: '#27D8F5', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>Request Access</button></span>
            ) : (
              <span>Already registered? <button onClick={() => setAuthMode('login')} style={{ color: '#27D8F5', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>Sign In</button></span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN PLATFORM INTERFACE ====================
  return (
    <div style={{ backgroundColor: '#080D16', color: '#F1F5FA', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ==================== PERFECT TOP NAVIGATION BAR ==================== */}
      <header style={{
        height: '64px',
        backgroundColor: '#0B1220',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        {/* Brand & Logo - FIXED NO WRAPPING */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, minWidth: '280px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #27D8F5 0%, #647DFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(39, 216, 245, 0.4)',
            flexShrink: 0
          }}>
            <ShieldIcon size={22} color="#080D16" />
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.5px', color: '#F1F5FA', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1.2 }}>
              <span>SENTINEL-X</span>
              <span style={{ fontSize: '10px', backgroundColor: '#1E293B', color: '#27D8F5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #27D8F544', fontWeight: 700 }}>
                v2.4
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500, marginTop: '2px' }}>
              Intelligent Threat Detection & SOC Platform
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: 1, maxWidth: '420px', margin: '0 20px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '9px', color: '#647DFF' }}>
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="Global Search (IPs, Hashes, CVEs, Hosts, Alert IDs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '36px',
              backgroundColor: '#111C2D',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              paddingLeft: '36px',
              paddingRight: '12px',
              color: '#F1F5FA',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>

        {/* Status Indicators & User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          {/* API Health Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#111C2D',
            border: '1px solid #20C99744',
            padding: '5px 10px',
            borderRadius: '16px',
            fontSize: '11px',
            color: '#20C997',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#20C997', boxShadow: '0 0 8px #20C997' }}></span>
            API ONLINE (:3001)
          </div>

          {/* UTC Clock */}
          <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace', backgroundColor: '#111C2D', padding: '5px 10px', borderRadius: '6px', border: '1px solid #1E293B', whiteSpace: 'nowrap' }}>
            {currentTime}
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              backgroundColor: '#111C2D',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F1F5FA',
              cursor: 'pointer'
            }}
          >
            <BellIcon size={18} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#FF4D67',
              boxShadow: '0 0 8px #FF4D67'
            }}></span>
          </button>

          {/* User Profile Button */}
          <div
            onClick={() => setShowProfileModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingLeft: '10px',
              borderLeft: '1px solid #1E293B',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#647DFF22',
              border: '1px solid #647DFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#27D8F5',
              fontWeight: 700,
              fontSize: '12px'
            }}>
              AM
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#F1F5FA' }}>Alex Mercer</div>
              <div style={{ fontSize: '10px', color: '#27D8F5' }}>Lead Security Analyst</div>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTAINER ==================== */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        {/* SIDEBAR NAVIGATION */}
        <aside style={{
          width: '240px',
          backgroundColor: '#0B1220',
          borderRight: '1px solid #1E293B',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#647DFF', paddingLeft: '12px', marginBottom: '8px', letterSpacing: '1px' }}>
              OPERATIONS COMMAND
            </div>

            {[
              { id: 'overview', label: 'SOC Dashboard', icon: <ActivityIcon size={18} /> },
              { id: 'alerts', label: 'Threat Detections', icon: <AlertTriangleIcon size={18} />, badge: alerts.length },
              { id: 'incidents', label: 'Incident Workspace', icon: <CrosshairIcon size={18} />, badge: incidents.length },
              { id: 'mitre', label: 'MITRE ATT&CK Matrix', icon: <RadioIcon size={18} /> },
              { id: 'endpoints', label: 'Endpoint Fleet (12)', icon: <ServerIcon size={18} /> },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#162337' : 'transparent',
                    border: isActive ? '1px solid #27D8F544' : '1px solid transparent',
                    color: isActive ? '#27D8F5' : '#94A3B8',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon}
                    {item.label}
                  </div>
                  {item.badge && (
                    <span style={{
                      backgroundColor: isActive ? '#27D8F522' : '#1E293B',
                      color: isActive ? '#27D8F5' : '#F1F5FA',
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 700
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div style={{ fontSize: '10px', fontWeight: 700, color: '#647DFF', paddingLeft: '12px', marginTop: '24px', marginBottom: '8px', letterSpacing: '1px' }}>
              INTELLIGENCE & CONFIG
            </div>

            {[
              { id: 'intel', label: 'Threat Intel & IOCs', icon: <CpuIcon size={18} /> },
              { id: 'rules', label: 'Detection Rules', icon: <TerminalIcon size={18} /> },
              { id: 'audit', label: 'Audit Trail Logs', icon: <LockIcon size={18} /> },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#162337' : 'transparent',
                    border: isActive ? '1px solid #27D8F544' : '1px solid transparent',
                    color: isActive ? '#27D8F5' : '#94A3B8',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Defense Status Card */}
          <div style={{
            backgroundColor: '#111C2D',
            border: '1px solid #1E293B',
            borderRadius: '10px',
            padding: '14px',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>DEFENSE STATUS</span>
              <span style={{ color: '#FFB547', fontWeight: 700 }}>DEFCON 3</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F1F5FA', marginTop: '4px' }}>
              Elevated Alert State
            </div>
            <div style={{
              height: '4px',
              backgroundColor: '#1E293B',
              borderRadius: '2px',
              marginTop: '10px',
              overflow: 'hidden'
            }}>
              <div style={{ width: '68%', height: '100%', backgroundColor: '#FFB547', boxShadow: '0 0 10px #FFB547' }}></div>
            </div>
          </div>
        </aside>

        {/* MAIN BODY DYNAMIC VIEWS */}
        <main style={{ flex: 1, padding: '24px', backgroundColor: '#080D16', overflowY: 'auto' }}>

          {/* ==================== VIEW 1: SOC OVERVIEW DASHBOARD ==================== */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#F1F5FA', letterSpacing: '-0.5px' }}>
                    SECURITY OPERATIONS CENTER OVERVIEW
                  </h1>
                  <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                    Real-time SIEM ingestion, automated threat correlation & incident pipeline
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0B1220', border: '1px solid #1E293B', padding: '4px', borderRadius: '8px' }}>
                  {['1h', '24h', '7d', '30d'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      style={{
                        backgroundColor: timeFilter === filter ? '#162337' : 'transparent',
                        color: timeFilter === filter ? '#27D8F5' : '#94A3B8',
                        border: timeFilter === filter ? '1px solid #27D8F544' : 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#111C2D', border: '1px solid #FF4D6744', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>ACTIVE CRITICAL THREATS</div>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: '#FF4D67', marginTop: '6px' }}>14</div>
                    </div>
                    <AlertTriangleIcon size={24} color="#FF4D67" />
                  </div>
                  <div style={{ fontSize: '12px', color: '#FF4D67', marginTop: '12px' }}>↑ +18% vs last 24h</div>
                </div>

                <div style={{ backgroundColor: '#111C2D', border: '1px solid #FFB54744', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>OPEN INCIDENT WORKSPACES</div>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFB547', marginTop: '6px' }}>{incidents.length}</div>
                    </div>
                    <CrosshairIcon size={24} color="#FFB547" />
                  </div>
                  <div style={{ fontSize: '12px', color: '#20C997', marginTop: '12px' }}>Avg SLA: 4m 12s</div>
                </div>

                <div style={{ backgroundColor: '#111C2D', border: '1px solid #27D8F544', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>MONITORED ENDPOINTS</div>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: '#27D8F5', marginTop: '6px' }}>1,428</div>
                    </div>
                    <ServerIcon size={24} color="#27D8F5" />
                  </div>
                  <div style={{ fontSize: '12px', color: '#20C997', marginTop: '12px' }}>● 1,425 Online • 3 Warning</div>
                </div>

                <div style={{ backgroundColor: '#111C2D', border: '1px solid #647DFF44', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>TELEMETRY THROUGHPUT</div>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: '#647DFF', marginTop: '6px' }}>8,450 <span style={{ fontSize: '14px', color: '#94A3B8' }}>EPS</span></div>
                    </div>
                    <ActivityIcon size={24} color="#647DFF" />
                  </div>
                  <div style={{ fontSize: '12px', color: '#27D8F5', marginTop: '12px' }}>Wazuh Agent Sync Active</div>
                </div>
              </div>

              {/* Live Alerts Stream Table */}
              <div style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#F1F5FA', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF4D67', boxShadow: '0 0 8px #FF4D67' }}></span>
                    Live Threat Detections ({filteredAlerts.length})
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1E293B', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Alert ID</th>
                        <th style={{ padding: '12px' }}>Severity</th>
                        <th style={{ padding: '12px' }}>Title</th>
                        <th style={{ padding: '12px' }}>MITRE</th>
                        <th style={{ padding: '12px' }}>Target Host</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlerts.map((item) => {
                        const style = getSeverityStyle(item.severity);
                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid #1E293B' }} onClick={() => setSelectedAlert(item)}>
                            <td style={{ padding: '12px', color: '#27D8F5', fontWeight: 700, fontFamily: 'monospace' }}>{item.id}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ backgroundColor: style.badge, color: style.text, border: `1px solid ${style.border}`, padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                                {item.severity}
                              </span>
                            </td>
                            <td style={{ padding: '12px', color: '#F1F5FA', fontWeight: 600 }}>{item.title}</td>
                            <td style={{ padding: '12px', color: '#647DFF', fontFamily: 'monospace', fontSize: '12px' }}>{item.mitre}</td>
                            <td style={{ padding: '12px', color: '#94A3B8' }}>{item.host}</td>
                            <td style={{ padding: '12px', color: '#20C997', fontWeight: 600 }}>{item.status}</td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <button onClick={(e) => { e.stopPropagation(); handleIsolateHost(item.host); }} style={{ backgroundColor: '#162337', border: '1px solid #FF4D6744', color: '#FF4D67', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                                Isolate Host
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 2: THREAT DETECTIONS ==================== */}
          {activeTab === 'alerts' && (
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Threat Detections Center</h1>
              <div style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input type="text" placeholder="Filter alerts by keyword..." style={{ width: '300px', height: '36px', backgroundColor: '#0B1220', border: '1px solid #1E293B', borderRadius: '6px', padding: '0 12px', color: '#FFF' }} />
                  <button style={{ backgroundColor: '#162337', border: '1px solid #27D8F544', color: '#27D8F5', padding: '0 16px', borderRadius: '6px', cursor: 'pointer' }}>Filter Critical</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {alerts.map((alt) => (
                    <div key={alt.id} style={{ backgroundColor: '#0B1220', border: '1px solid #1E293B', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: '#27D8F5', fontWeight: 700, fontFamily: 'monospace' }}>{alt.id}</span>
                          <span style={{ backgroundColor: getSeverityStyle(alt.severity).badge, color: getSeverityStyle(alt.severity).text, padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{alt.severity}</span>
                          <span style={{ fontSize: '12px', color: '#94A3B8' }}>{alt.time}</span>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '6px' }}>{alt.title}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Source IP: {alt.source} • Host: {alt.host} • {alt.mitre}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setSelectedAlert(alt)} style={{ backgroundColor: '#162337', border: '1px solid #27D8F544', color: '#27D8F5', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Investigate</button>
                        <button onClick={() => handleIsolateHost(alt.host)} style={{ backgroundColor: '#2C0D15', border: '1px solid #FF4D67', color: '#FF4D67', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Isolate Host</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 3: INCIDENT WORKSPACE ==================== */}
          {activeTab === 'incidents' && (
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Active Incident Workspace</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {incidents.map((inc) => (
                  <div key={inc.id} style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#27D8F5', fontWeight: 700, fontFamily: 'monospace' }}>{inc.id}</span>
                      <span style={{ backgroundColor: '#FF4D6722', color: '#FF4D67', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{inc.priority}</span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginTop: '10px', color: '#F1F5FA' }}>{inc.title}</h3>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>Assignee: <strong style={{ color: '#F1F5FA' }}>{inc.assignee}</strong></div>
                      <div>SLA Deadline: <strong style={{ color: '#FFB547' }}>{inc.SLA}</strong></div>
                      <div>Related Alerts: <strong style={{ color: '#27D8F5' }}>{inc.alertsCount} telemetry alerts</strong></div>
                    </div>
                    <button
                      onClick={() => alert(`Opening incident details for ${inc.id}`)}
                      style={{ width: '100%', marginTop: '16px', backgroundColor: '#162337', border: '1px solid #27D8F544', color: '#27D8F5', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
                    >
                      Open Incident Command →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== VIEW 4: MITRE ATT&CK MATRIX ==================== */}
          {activeTab === 'mitre' && (
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>MITRE ATT&CK® Enterprise Matrix</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {MITRE_TACTICS.map((t) => (
                  <div key={t.code} style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ color: t.color, fontWeight: 800, fontSize: '12px' }}>{t.code}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>{t.name}</div>
                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#94A3B8' }}>
                      <div>Active Detections: <strong style={{ color: '#F1F5FA' }}>{t.count}</strong></div>
                      <div>Detection Coverage: <strong style={{ color: '#20C997' }}>{t.coverage}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== VIEW 5: ENDPOINT FLEET ==================== */}
          {activeTab === 'endpoints' && (
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Monitored Endpoint Fleet</h1>
              <div style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '12px', padding: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1E293B', color: '#94A3B8' }}>
                      <th style={{ padding: '10px' }}>Host Name</th>
                      <th style={{ padding: '10px' }}>OS Platform</th>
                      <th style={{ padding: '10px' }}>IP Address</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Agent Version</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoints.map((ep) => (
                      <tr key={ep.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#F1F5FA' }}>{ep.host}</td>
                        <td style={{ padding: '12px', color: '#94A3B8' }}>{ep.os}</td>
                        <td style={{ padding: '12px', color: '#647DFF', fontFamily: 'monospace' }}>{ep.ip}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            backgroundColor: ep.status === 'HEALTHY' ? '#20C99722' : ep.status === 'ISOLATED' ? '#A855F722' : '#FF4D6722',
                            color: ep.status === 'HEALTHY' ? '#20C997' : ep.status === 'ISOLATED' ? '#A855F7' : '#FF4D67',
                            padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700
                          }}>
                            {ep.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#94A3B8' }}>{ep.agent}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {ep.status !== 'ISOLATED' ? (
                            <button onClick={() => handleIsolateHost(ep.host)} style={{ backgroundColor: '#2C0D15', border: '1px solid #FF4D67', color: '#FF4D67', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Isolate Host</button>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#A855F7', fontWeight: 700 }}>AIR-GAPPED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 6: THREAT INTEL ==================== */}
          {activeTab === 'intel' && (
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Threat Intelligence & IOC Database</h1>
              <div style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {THREAT_INTEL.map((ioc, idx) => (
                    <div key={idx} style={{ backgroundColor: '#0B1220', border: '1px solid #1E293B', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#647DFF', fontWeight: 700 }}>{ioc.type} • Confidence {ioc.confidence}</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'monospace', color: '#FF4D67', marginTop: '4px' }}>{ioc.value}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Associated Threat Actor: <strong style={{ color: '#F1F5FA' }}>{ioc.actor}</strong></div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {ioc.tags.map(t => (
                          <span key={t} style={{ backgroundColor: '#162337', border: '1px solid #27D8F544', color: '#27D8F5', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 7: AUDIT LOGS ==================== */}
          {activeTab === 'audit' && (
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Immutable Security Audit Trail</h1>
              <div style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', borderRadius: '12px', padding: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1E293B', color: '#94A3B8' }}>
                      <th style={{ padding: '10px' }}>Log ID</th>
                      <th style={{ padding: '10px' }}>Timestamp</th>
                      <th style={{ padding: '10px' }}>Actor</th>
                      <th style={{ padding: '10px' }}>Security Action</th>
                      <th style={{ padding: '10px' }}>Target Resource</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_LOGS.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '12px', color: '#27D8F5', fontFamily: 'monospace' }}>{log.id}</td>
                        <td style={{ padding: '12px', color: '#94A3B8' }}>{log.time}</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#F1F5FA' }}>{log.user}</td>
                        <td style={{ padding: '12px', color: '#FFB547', fontWeight: 700 }}>{log.action}</td>
                        <td style={{ padding: '12px', color: '#647DFF', fontFamily: 'monospace' }}>{log.target}</td>
                        <td style={{ padding: '12px', color: '#20C997', fontWeight: 700 }}>{log.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==================== USER PROFILE & SETTINGS MODAL ==================== */}
      {showProfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(8, 13, 22, 0.85)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0B1220', border: '1px solid #27D8F566',
            borderRadius: '16px', width: '460px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>Analyst Security Profile</div>
              <button onClick={() => setShowProfileModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', backgroundColor: '#111C2D', padding: '16px', borderRadius: '10px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#647DFF', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>AM</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>Alex Mercer</div>
                <div style={{ fontSize: '12px', color: '#27D8F5' }}>alex.mercer@sentinelx.io</div>
                <div style={{ fontSize: '11px', color: '#20C997', marginTop: '2px' }}>● Role: Super Admin / Lead Security Analyst</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '8px' }}>
                <span>MFA Status:</span> <strong style={{ color: '#20C997' }}>ACTIVE (Hardware TOTP)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '8px' }}>
                <span>Session Duration:</span> <strong style={{ color: '#F1F5FA' }}>15m token auto-refresh</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '8px' }}>
                <span>API Clearance Level:</span> <strong style={{ color: '#27D8F5' }}>Level 4 (Full Access)</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setShowProfileModal(false);
                setIsLoggedOut(true);
              }}
              style={{
                width: '100%',
                backgroundColor: '#2C0D15',
                border: '1px solid #FF4D67',
                color: '#FF4D67',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Log Out of SOC Session
            </button>
          </div>
        </div>
      )}

      {/* ==================== NOTIFICATIONS DRAWER ==================== */}
      {showNotifications && (
        <div style={{
          position: 'fixed', top: '70px', right: '24px', width: '320px',
          backgroundColor: '#0B1220', border: '1px solid #1E293B', borderRadius: '12px',
          padding: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', zIndex: 1000
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Security Notifications</span>
            <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ backgroundColor: '#2C0D15', border: '1px solid #FF4D6744', padding: '10px', borderRadius: '6px' }}>
              <strong style={{ color: '#FF4D67' }}>Critical Alert:</strong> LSASS memory dump detected on FINANCE-PC-09.
            </div>
            <div style={{ backgroundColor: '#2B1A0E', border: '1px solid #FFB54744', padding: '10px', borderRadius: '6px' }}>
              <strong style={{ color: '#FFB547' }}>New Incident:</strong> INC-2026-041 created and assigned to you.
            </div>
            <div style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', padding: '10px', borderRadius: '6px' }}>
              <strong style={{ color: '#27D8F5' }}>Wazuh Sync:</strong> 8,450 events ingested in last 60 seconds.
            </div>
          </div>
        </div>
      )}

      {/* ==================== ALERT INVESTIGATION MODAL ==================== */}
      {selectedAlert && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(8, 13, 22, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0B1220', border: '1px solid #27D8F566',
            borderRadius: '16px', width: '640px', maxWidth: '90%', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{
                  backgroundColor: getSeverityStyle(selectedAlert.severity).badge,
                  color: getSeverityStyle(selectedAlert.severity).text,
                  border: `1px solid ${getSeverityStyle(selectedAlert.severity).border}`,
                  padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800
                }}>
                  {selectedAlert.severity} SEVERITY
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: '8px', color: '#F1F5FA' }}>
                  {selectedAlert.title}
                </h2>
              </div>
              <button onClick={() => setSelectedAlert(null)} style={{ backgroundColor: '#111C2D', border: '1px solid #1E293B', color: '#94A3B8', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#111C2D', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <div><span style={{ color: '#94A3B8' }}>Alert ID:</span> <strong style={{ color: '#27D8F5' }}>{selectedAlert.id}</strong></div>
              <div><span style={{ color: '#94A3B8' }}>Target Host:</span> <strong style={{ color: '#F1F5FA' }}>{selectedAlert.host}</strong></div>
              <div><span style={{ color: '#94A3B8' }}>Source IP:</span> <strong style={{ color: '#647DFF' }}>{selectedAlert.source}</strong></div>
              <div><span style={{ color: '#94A3B8' }}>MITRE Mapping:</span> <strong style={{ color: '#27D8F5' }}>{selectedAlert.mitre}</strong></div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#647DFF', marginBottom: '6px' }}>RECOMMENDED ACTION WORKFLOW</div>
              <div style={{ fontSize: '13px', color: '#94A3B8', backgroundColor: '#111C2D', padding: '12px', borderRadius: '8px' }}>
                1. Revoke active Kerberos session tickets for account on target endpoint.<br/>
                2. Execute automated memory forensic dump via Sentinel Agent.<br/>
                3. Apply firewall drop rule for IP <code>{selectedAlert.source}</code> on Edge Gateway.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  handleIsolateHost(selectedAlert.host);
                  setSelectedAlert(null);
                }}
                style={{
                  backgroundColor: '#FF4D67', color: '#FFFFFF', border: 'none',
                  padding: '10px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                }}
              >
                Execute Automated Containment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}