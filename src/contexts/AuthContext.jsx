
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
    const loadSessionAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile with role
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            // Combine auth data with profile data
            const userWithProfile = {
              ...session.user,
              role: profile.role || session.user.user_metadata?.role || 'student',
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || session.user.email,
            };
            console.log("User with profile:", userWithProfile);
            setUser(userWithProfile);
          } else {
            // Fallback to just auth data
            const userWithoutProfile = {
              ...session.user,
              role: session.user.user_metadata?.role || 'student',
              name: session.user.email,
            };
            console.log("User without profile:", userWithoutProfile);
            setUser(userWithoutProfile);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadSessionAndProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Get user profile with role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          // Combine auth data with profile data
          const userWithProfile = {
            ...session.user,
            role: profile.role || session.user.user_metadata?.role || 'student',
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || session.user.email,
          };
          console.log("Auth change - User with profile:", userWithProfile);
          setUser(userWithProfile);
        } else {
          // Fallback to just auth data
          const userWithoutProfile = {
            ...session.user,
            role: session.user.user_metadata?.role || 'student',
            name: session.user.email,
          };
          console.log("Auth change - User without profile:", userWithoutProfile);
          setUser(userWithoutProfile);
        }
      } else {
        setUser(null);
      }
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
