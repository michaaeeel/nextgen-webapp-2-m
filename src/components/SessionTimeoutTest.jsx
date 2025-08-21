import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SessionTimeoutTest = () => {
  const { isAuthenticated, resetSessionTimer } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState('2:00:00');
  const [lastActivity, setLastActivity] = useState(new Date().toLocaleTimeString());

  // Simulate activity tracking for display purposes
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      setLastActivity(new Date().toLocaleTimeString());
    };

    // Listen for user activity to update last activity display
    const events = ['mousedown', 'keypress', 'scroll', 'click'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated]);

  const handleManualReset = () => {
    if (resetSessionTimer) {
      resetSessionTimer();
      setLastActivity(new Date().toLocaleTimeString());
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Session Timeout Status
          <Badge variant="outline" className="ml-auto">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Timeout Duration:</strong>
            <div className="text-muted-foreground">2 hours</div>
          </div>
          <div>
            <strong>Warning:</strong>
            <div className="text-muted-foreground">Disabled</div>
          </div>
          <div>
            <strong>Last Activity:</strong>
            <div className="text-muted-foreground">{lastActivity}</div>
          </div>
          <div>
            <strong>Auto Reset:</strong>
            <div className="text-green-600">Enabled</div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            The session will automatically reset on:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Mouse movement or clicks</li>
            <li>• Keyboard input</li>
            <li>• Page scrolling</li>
            <li>• Touch interactions</li>
            <li>• Page refresh/reload</li>
            <li>• Tab focus changes</li>
          </ul>
        </div>

        <Button 
          onClick={handleManualReset}
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          Manual Reset Timer
        </Button>
        
        <div className="text-xs text-muted-foreground text-center">
          Silent logout after 2 hours of inactivity
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionTimeoutTest;