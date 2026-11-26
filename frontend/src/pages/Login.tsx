import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Icons
const ShieldIcon = ({ size = 28, color = '#27D8F5' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LockIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const KeyIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M21 2l-9.6 9.6" />
    <path d="M15.5 7.5l3 3L22 7l-3-3" />
  </svg>
);

const CheckIcon = ({ size = 16, color = '#20C997' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('alex.mercer@sentinelx.io');
  const [password, setPassword] = useState('SentinelX@2026!');
  const [fullName, setFullName] = useState('Alex Mercer');
  const [role, setRole] = useState('Lead Security Analyst (Tier 3)');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaStep, setMfaStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !fullName) {
      setError('Please provide your full legal name');
      return;
    }

    if (!email || !password) {
      setError('Please enter both corporate email and clearance password');
      return;
    }

    // Advance to MFA challenge for high-security simulation
    if (!mfaStep && mode === 'signin') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMfaStep(true);
      }, 600);
      return;
    }

    // Verify login
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('sentinel_user', JSON.stringify({
        name: fullName || 'Alex Mercer',
        email,
        role: role || 'Lead Security Analyst',
        clearance: 'Tier 3 (Full SOC Control)',
        mfa: 'TOTP Verified'
      }));
      navigate('/');
    }, 700);
  };

  const handleDemoLogin = (userRole: string, userName: string, userEmail: string) => {
    setFullName(userName);
    setEmail(userEmail);
    setRole(userRole);
    setPassword('SentinelX@2026!');
    setMfaStep(false);
    setError('');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('sentinel_user', JSON.stringify({
        name: userName,
        email: userEmail,
        role: userRole,
        clearance: 'Active Hardware Clearance',
        mfa: 'Enforced'
      }));
      navigate('/');
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#080D16',
      backgroundImage: `
        radial-gradient(circle at 50% 0%, rgba(39, 216, 245, 0.12) 0%, transparent 60%),
        radial-gradient(circle at 100% 100%, rgba(100, 125, 255, 0.08) 0%, transparent 50%),
        linear-gradient(rgba(30, 41, 59, 0.25) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30, 41, 59, 0.25) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#F1F5FA',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Banner Status Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '42px',
        backgroundColor: 'rgba(11, 18, 32, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#20C997', boxShadow: '0 0 8px #20C997' }}></span>
          <span style={{ color: '#94A3B8' }}>SECURE GATEWAY:</span>
          <span style={{ color: '#27D8F5', fontWeight: 600 }}>us-east-cluster.sentinelx.io:443</span>
        </div>
        <div style={{ color: '#94A3B8', fontSize: '11px', display: 'flex', gap: '16px' }}>
          <span>FIPS 140-3 COMPLIANT</span>
          <span>AES-256 ENCRYPTION</span>
          <span>TLS 1.3 ARMED</span>
        </div>
      </div>

      {/* Main Auth Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        marginTop: '30px',
        backgroundColor: '#0D1421',
        border: '1px solid rgba(39, 216, 245, 0.25)',
        borderRadius: '16px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(39, 216, 245, 0.08)',
        padding: '36px',
        position: 'relative'
      }}>
        {/* Glowing Top Edge Accent */}
        <div style={{
          position: 'absolute',
          top: -1,
          left: '20%',
          right: '20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #27D8F5, #647DFF, transparent)'
        }}></div>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(39, 216, 245, 0.15) 0%, rgba(100, 125, 255, 0.25) 100%)',
            border: '1px solid rgba(39, 216, 245, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 0 25px rgba(39, 216, 245, 0.25)'
          }}>
            <ShieldIcon size={30} color="#27D8F5" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '0.5px', color: '#F1F5FA' }}>
              SENTINEL-X
            </h1>
            <span style={{
              fontSize: '11px',
              backgroundColor: '#1E293B',
              color: '#27D8F5',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(39, 216, 245, 0.3)',
              fontWeight: 700
            }}>
              SOC v2.4
            </span>
          </div>

          <p style={{ color: '#94A3B8', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
            Autonomous Threat Detection & Security Operations Platform
          </p>
        </div>

        {/* Tab Toggle: Sign In / Sign Up */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
          backgroundColor: '#080D16',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #1E293B',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setMfaStep(false); setError(''); }}
            style={{
              padding: '10px 0',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: mode === 'signin' ? '#162337' : 'transparent',
              color: mode === 'signin' ? '#27D8F5' : '#94A3B8',
              fontWeight: mode === 'signin' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LockIcon size={15} color={mode === 'signin' ? '#27D8F5' : '#94A3B8'} />
            Analyst Sign In
          </button>

          <button
            type="button"
            onClick={() => { setMode('signup'); setMfaStep(false); setError(''); }}
            style={{
              padding: '10px 0',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: mode === 'signup' ? '#162337' : 'transparent',
              color: mode === 'signup' ? '#27D8F5' : '#94A3B8',
              fontWeight: mode === 'signup' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <KeyIcon size={15} color={mode === 'signup' ? '#27D8F5' : '#94A3B8'} />
            Request Account
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 77, 103, 0.12)',
            border: '1px solid #FF4D67',
            color: '#FF4D67',
            padding: '12px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {!mfaStep ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>
                    FULL OPERATOR NAME
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    style={{
                      width: '100%',
                      height: '42px',
                      backgroundColor: '#111C2D',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      padding: '0 14px',
                      color: '#F1F5FA',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>
                    DESIRED CLEARANCE ROLE
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      backgroundColor: '#111C2D',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      padding: '0 14px',
                      color: '#F1F5FA',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Lead Security Analyst (Tier 3)">Lead Security Analyst (Tier 3)</option>
                    <option value="SOC Incident Commander">SOC Incident Commander</option>
                    <option value="Threat Hunter & Forensics">Threat Hunter & Forensics</option>
                    <option value="Security Operations Manager">Security Operations Manager</option>
                    <option value="Tier 1 Security Analyst">Tier 1 Security Analyst</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>
                  CORPORATE SSO EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#111C2D',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    padding: '0 14px',
                    color: '#F1F5FA',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
                    CLEARANCE MASTER PASSWORD
                  </label>
                  {mode === 'signin' && (
                    <a href="#reset" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to corporate administrator.'); }} style={{ color: '#27D8F5', fontSize: '11px', textDecoration: 'none' }}>
                      Forgot PIN?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#111C2D',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    padding: '0 14px',
                    color: '#F1F5FA',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '46px',
                  background: 'linear-gradient(135deg, #27D8F5 0%, #647DFF 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#080D16',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 0 25px rgba(39, 216, 245, 0.35)',
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? 'Verifying Credentials...' : mode === 'signin' ? 'Verify & Continue →' : 'Submit Access Request →'}
              </button>
            </div>
          ) : (
            // ==================== MFA CHALLENGE STEP ====================
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                backgroundColor: 'rgba(39, 216, 245, 0.08)',
                border: '1px solid rgba(39, 216, 245, 0.3)',
                padding: '16px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#27D8F5', marginBottom: '4px' }}>
                  HARDWARE 2FA / TOTP REQUIRED
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Enter the 6-digit verification code from your Sentinel Token or Google Authenticator
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '6px', textAlign: 'center' }}>
                  SECURITY TOKEN CODE
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="8 4 9 2 0 1"
                  autoFocus
                  style={{
                    width: '100%',
                    height: '52px',
                    backgroundColor: '#111C2D',
                    border: '2px solid #27D8F5',
                    borderRadius: '8px',
                    color: '#27D8F5',
                    fontSize: '22px',
                    fontWeight: 800,
                    textAlign: 'center',
                    letterSpacing: '10px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '46px',
                  background: 'linear-gradient(135deg, #20C997 0%, #27D8F5 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#080D16',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 25px rgba(32, 201, 151, 0.35)',
                  marginTop: '6px'
                }}
              >
                {isLoading ? 'Authorizing Session...' : 'Authorize SOC Terminal Access'}
              </button>

              <button
                type="button"
                onClick={() => setMfaStep(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginTop: '4px'
                }}
              >
                ← Back to Password
              </button>
            </div>
          )}
        </form>

        {/* 1-Click Demo Profiles for Recruiters */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #1E293B'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#647DFF',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>RECRUITER 1-CLICK INSTANT ACCESS:</span>
            <span style={{ color: '#20C997', fontSize: '10px' }}>● DEMO READY</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('Lead Security Analyst (Tier 3)', 'Alex Mercer', 'alex.mercer@sentinelx.io')}
              style={{
                backgroundColor: '#111C2D',
                border: '1px solid rgba(39, 216, 245, 0.25)',
                color: '#F1F5FA',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 0.15s'
              }}
            >
              <div style={{ color: '#27D8F5', fontWeight: 700 }}>Alex Mercer</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Lead SOC Analyst</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('SOC Incident Commander', 'Sarah Connor', 'sarah.connor@sentinelx.io')}
              style={{
                backgroundColor: '#111C2D',
                border: '1px solid rgba(100, 125, 255, 0.25)',
                color: '#F1F5FA',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ color: '#647DFF', fontWeight: 700 }}>Sarah Connor</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Incident Commander</div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '11px',
          color: '#64748B'
        }}>
          Protected by SENTINEL Zero-Trust Enclave • All activity logged & audited
        </div>
      </div>
    </div>
  );
}