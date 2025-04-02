
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const DashboardHeader = ({ user, logout, handleCreateCourse }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => logout()}>
          Sign Out
        </Button>
        <Button className="flex items-center gap-2" onClick={handleCreateCourse}>
          <PlusCircle size={16} />
          Create New Course
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
