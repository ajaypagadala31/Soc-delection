/**
 * SENTINEL-X MFA Verification Page
 *
 * Features:
 * - QR code display
 * - TOTP code input
 * - Backup code recovery
 * - Security-focused design
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Paper,
  IconButton,
  InputAdornment,
  Chip,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Shield as ShieldIcon,
  QrCode as QrCodeIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMutation } from 'react-query';

// Validation schema
const mfaSchema = z.object({
  code: z.string().length(6, 'Invalid verification code'),
});

type MFAFormData = z.infer<typeof mfaSchema>;

const BACKUP_CODES = [
  'B4R9-TK2M-Q8XN-Y3LP',
  'F7H2-W5JC-K9DM-1RTQ',
  'M3V8-P2XN-6QL9-ZY4R',
  'T1J5-L8CM-7WQ2-N3FP',
  'K9R2-W4XM-6QNL-V7CT',
  'P5N8-Y2QL-3JTM-9WCR',
  'X7C3-M1LP-8TQ5-F2RN',
  'R4J9-W2NM-7QVC-5TLX',
  'L8K1-P3MR-9TQ6-N2VJ',
  'F6W4-T9NX-2QLM-7CVR',
];

export default function MFAPage() {
  const [showCode, setShowCode] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { from } = (location.state as any) || { from: '/' };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: '',
    },
  });

  const mutation = useMutation(
    async (code: string) => {
      const response = await fetch('/api/v1/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, userId: sessionStorage.getItem('mfa_user_id') }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'MFA verification failed');
      }

      return response.json();
    },
    {
      onSuccess: async (data) => {
        await login(data.data, data.data.accessToken, data.data.refreshToken);
        sessionStorage.removeItem('mfa_user_id');
        navigate(from, { replace: true });
      },
    }
  );

  const onSubmit = async (data: MFAFormData) => {
    mutation.mutate(data.code);
  };

  // Generate QR code URL (simulated - in real app, fetch from backend)
  useState(() => {
    setQrCodeUrl(
      'otpauth://totp/SentinelX:admin@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Sentinel-X&algorithm=SHA256&digits=6&period=30'
    );
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'linear-gradient(135deg, #080d16 0%, #111827 50%, #162337 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={25}
        sx={{
          width: '100%',
          maxWidth: 480,
          bgcolor: '#111827',
          borderRadius: 3,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          border: '1px solid #1e293b',
          p: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <ShieldIcon sx={{ fontSize: 32, color: '#f59e0b', mr: 1 }} />
          <Typography variant="h5" component="h2" fontWeight={600}>
            Two-Factor Authentication
          </Typography>
        </Box>

        <Typography variant="body1" align="center" color="text.secondary" mb={3}>
          Enter the verification code from your authenticator app
        </Typography>

        {/* QR Code */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              p: 2,
              borderRadius: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QrCodeIcon sx={{ fontSize: 180, color: '#000' }} />
          </Box>
          <Typography variant="body2" color="text.secondary" textAlign="center" maxW="400px">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </Typography>
        </Box>

        {/* MFA Code Input */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {mutation.isError && (
              <Alert severity="error">{mutation.error instanceof Error ? mutation.error.message : 'Verification failed'}</Alert>
            )}

            <TextField
              label="Verification Code"
              type={showCode ? 'text' : 'number'}
              fullWidth
              value={''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').substring(0, 6);
                setValue('code', value);
              }}
              error={!!errors.code}
              helperText={errors.code?.message}
              inputProps={{
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                     aria-label="toggle code visibility"
                      onClick={() => setShowCode(!showCode)}
                      edge="end"
                      size="small"
                    >
                      {showCode ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#162337',
                  '& fieldset': {
                    borderColor: '#1e293b',
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting || mutation.isLoading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706, #ca8a04)',
                },
              }}
            >
              {isSubmitting || mutation.isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Verify'
              )}
            </Button>

            <Button
              variant="text"
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              sx={{
                color: '#94a3b8',
                textTransform: 'none',
              }}
            >
              <SyncIcon sx={{ mr: 1, mb: 0.5 }} />
              Use Backup Codes
            </Button>
          </Stack>
        </form>

        {/* Backup Codes Section */}
        {showBackupCodes && (
          <Box sx={{ mt: 4, p: 3, bgcolor: '#162337', borderRadius: 2 }}>
            <Typography variant="h6" component="h3" color="text.primary" mb={2}>
              Backup Codes
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Use these codes if you lose access to your authenticator app. Each code can only be used once.
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              {BACKUP_CODES.map((code) => (
                <Chip
                  key={code}
                  label={code}
                  variant="outlined"
                  sx={{
                    borderColor: '#3b82f6',
                    color: '#cbd5e1',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.1)',
                    },
                  }}
                  onClick={() => {
                    mutation.mutate(code);
                  }}
                />
              ))}
            </Stack>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowBackupCodes(false)}
              sx={{
                borderColor: '#64748b',
                color: '#94a3b8',
              }}
            >
              Hide Backup Codes
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Button
          variant="text"
          onClick={() => navigate('/login')}
          sx={{
            color: '#94a3b8',
            textTransform: 'none',
          }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
}