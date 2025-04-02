
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UpcomingDeadlines = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Assignments due in the next week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">React Hooks Quiz</p>
                <p className="text-sm text-muted-foreground">Advanced React Patterns</p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                Tomorrow
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Final Project</p>
                <p className="text-sm text-muted-foreground">Introduction to Web Development</p>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                In 5 days
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full">View All Deadlines</Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingDeadlines;
