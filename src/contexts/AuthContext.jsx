import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase, signIn, signUp, signOut } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { user: authUser } = await signIn({ email, password });
      setUser(authUser);
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
            role: 'student', // Default role
          });

        if (profileError) throw profileError;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
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

  const value = {
    user,
    loading,
    login,
    register,
    logout,
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
