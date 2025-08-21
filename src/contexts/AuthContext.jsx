import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase, signIn, signUp, signOut } from '@/lib/supabase';

const AuthContext = createContext(null);

// 2 hours in milliseconds
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Session timeout management
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    if (!user) return;

    lastActivityRef.current = Date.now();

    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(async () => {
      try {
        await signOut();
        setUser(null);
        navigate('/');
      } catch (error) {
        console.error('Error during session timeout logout:', error);
      }
    }, SESSION_TIMEOUT);
  }, [user, navigate]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Only reset timer if more than 30 seconds have passed to avoid excessive resets
    if (timeSinceLastActivity > 30000) {
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      console.log("User:", user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Session timeout effect
  useEffect(() => {
    if (!user) {
      // Clear timer if user is not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Initialize timer when user is authenticated
    resetTimer();

    // Activity events to monitor
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
      'blur',
      'visibilitychange'
    ];

    // Add event listeners
    events.forEach(event => {
      if (event === 'visibilitychange') {
        document.addEventListener(event, handleActivity, true);
      } else {
        window.addEventListener(event, handleActivity, true);
      }
    });

    // Handle page refresh/reload - reset timer on page load
    const handlePageLoad = () => {
      resetTimer();
    };
    window.addEventListener('load', handlePageLoad);

    // Cleanup function
    return () => {
      events.forEach(event => {
        if (event === 'visibilitychange') {
          document.removeEventListener(event, handleActivity, true);
        } else {
          window.removeEventListener(event, handleActivity, true);
        }
      });
      window.removeEventListener('load', handlePageLoad);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, resetTimer, handleActivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { user: authUser } = await signIn({ email, password });
      setUser(authUser);
      // Reset session timer on successful login
      resetTimer();
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      return authUser;
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { user: authUser } = await signUp({
        email: userData.email,
        password: userData.password,
        ...userData
      });
      
      // Create profile in profiles table
      if (authUser) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            role: 'student', // Default role
          });

        if (profileError) throw profileError;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      // Reset session timer on successful registration
      if (authUser) {
        resetTimer();
      }
      
      return authUser;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive"
      });
    }
  };

  const getAllUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive"
      });
      return [];
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    getAllUsers,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
