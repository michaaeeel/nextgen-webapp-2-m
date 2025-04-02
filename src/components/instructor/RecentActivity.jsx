
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Clock } from "lucide-react";

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions from your students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="rounded-full bg-secondary p-2">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Assignment Submitted</p>
              <p className="text-sm text-muted-foreground">John Doe submitted "JavaScript Basics"</p>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Clock className="inline mr-1 h-3 w-3" /> 2 hours ago
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="rounded-full bg-secondary p-2">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">New Enrollment</p>
              <p className="text-sm text-muted-foreground">Sarah Miller joined "Advanced React Patterns"</p>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Clock className="inline mr-1 h-3 w-3" /> 5 hours ago
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full">View All Activity</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivity;
