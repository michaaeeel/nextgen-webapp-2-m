import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sendInstructorInvitation } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Send, ArrowLeft } from "lucide-react";

const NewInvitationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      await sendInstructorInvitation(
        formData.email,
        formData.firstName,
        formData.lastName
      );
      
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${formData.email}`,
      });
      
      navigate('/admin-dashboard/invitations');
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Failed to Send Invitation",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => navigate("/admin-dashboard/invitations")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invitations
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Send New Instructor Invitation</CardTitle>
                <CardDescription>
                  Send an invitation to a new instructor. They will receive an email with login instructions.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address*
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="instructor@example.com"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name*
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name*
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md text-sm">
                    <p className="text-blue-700 flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        The invited instructor will receive an email with a link to set up their account. 
                        A temporary password will be generated and included in the email.
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Send className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewInvitationPage;