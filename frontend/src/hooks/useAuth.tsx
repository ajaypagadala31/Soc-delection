/**
 * SENTINEL-X Authentication Context and Hooks
 *
 * Features:
 * - JWT-based authentication
 * - Token refresh
 * - Role and permission checking
 * - Secure token storage
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
  isMfaEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  requiresMfa: boolean;
}

interface TokenStorage {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'sentinelx_tokens';

const useTokenStorage = () => {
  const [tokens, setTokens] = useState<TokenStorage>(() => {
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if expired
        if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
          return { accessToken: null, refreshToken: null, expiresAt: null };
        }
        return parsed;
      }
    } catch {
      // Invalid JSON, reset
      localStorage.removeItem(TOKEN_KEY);
    }
    return { accessToken: null, refreshToken: null, expiresAt: null };
  });

  const saveTokens = useCallback((tokenData: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }) => {
    const data = { ...tokenData, expiresAt: Date.now() + tokenData.accessExpiresIn * 1000 };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
    setTokens({ accessToken: tokenData.accessToken, refreshToken: tokenData.refreshToken, expiresAt: data.expiresAt });
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setTokens({ accessToken: null, refreshToken: null, expiresAt: null });
  }, []);

  return { tokens, saveTokens, clearTokens };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { tokens, saveTokens, clearTokens } = useTokenStorage();

  const [user, setUser] = useState<User | null>(null);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user
  const { data: userData, isLoading: isUserLoading, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      return response.json();
    },
    enabled: !!tokens.accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Refresh token mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (!tokens.refreshToken) throw new Error('No refresh token');

      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.data?.accessToken) {
        saveTokens({
          accessToken: data.data.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: 900, // 15 minutes
        });
      }
    },
    onError: () => {
      clearTokens();
      setUser(null);
      navigate('/login');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    },
    onSuccess: () => {
      clearTokens();
      setUser(null);
      navigate('/login');
    },
  });

  // Set user data
  useEffect(() => {
    if (userData?.data) {
      setUser({
        id: userData.data.user.id,
        email: userData.data.user.email,
        firstName: userData.data.user.firstName,
        lastName: userData.data.user.lastName,
        roles: userData.data.roles,
        permissions: userData.data.permissions,
        isMfaEnabled: userData.data.user.isMfaEnabled,
        createdAt: userData.data.user.createdAt,
        lastLoginAt: userData.data.user.lastLoginAt,
      });
    }
  }, [userData]);

  // Set loading state
  useEffect(() => {
    setIsLoading(isUserLoading);
  }, [isUserLoading]);

  // Check if token is expired
  useEffect(() => {
    if (tokens.expiresAt && tokens.expiresAt < Date.now() + 60000) {
      // Token expires in less than 1 minute, refresh it
      refreshMutation.mutate();
    }
  }, [tokens.expiresAt, refreshMutation]);

  // Auto-refresh on window focus if token is close to expiry
  useEffect(() => {
    const handleFocus = () => {
      if (tokens.expiresAt && tokens.expiresAt < Date.now() + 5 * 60 * 1000) {
        // Token expires in less than 5 minutes
        refreshMutation.mutate();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [tokens.expiresAt, refreshMutation]);

  const login = useCallback((user: User, accessToken: string, refreshToken: string) => {
    const expiresIn = 15 * 60; // 15 minutes
    saveTokens({ accessToken, refreshToken, expiresIn });
    setUser(user);
    setRequiresMfa(user.isMfaEnabled);

    // Invalidate and refetch user queries
    queryClient.invalidateQueries(['currentUser']);
  }, [saveTokens, queryClient]);

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const refreshAccessToken = useCallback(async () => {
    await refreshMutation.mutateAsync();
  }, [refreshMutation]);

  const hasRole = useCallback((role: string) => {
    return user?.roles.includes(role) || false;
  }, [user]);

  const hasPermission = useCallback((permission: string) => {
    return user?.permissions.includes(permission) || false;
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !isLoading,
    isLoading,
    login,
    logout,
    refreshAccessToken,
    hasRole,
    hasPermission,
    requiresMfa,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};