
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const StudentManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Management</CardTitle>
        <CardDescription>View and manage students across all your courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-center py-8">Student management functionality will be implemented in the next phase.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentManagement;
