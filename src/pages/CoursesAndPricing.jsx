
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CoursesAndPricing = () => {
  const courses = [
    {
      id: 1,
      title: "Basic Investment Course",
      description: "Learn the basics of investing with our introductory course.",
      price: "$99",
      buttonText: "Enroll Now"
    },
    {
      id: 2,
      title: "Advanced Investment Strategies",
      description: "Dive deeper into advanced investment strategies and techniques.",
      price: "$199",
      buttonText: "Enroll Now"
    },
    {
      id: 3,
      title: "Personalized Financial Planning",
      description: "Get personalized financial planning and advice tailored to your needs.",
      price: "$299",
      buttonText: "Enroll Now"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-left">
            Courses and Pricing
          </h1>
          
          <div className="space-y-8">
            {courses.map((course) => (
              <Card key={course.id} className="p-8 shadow-md rounded-lg border border-gray-200">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">{course.title}</h2>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <p className="text-3xl font-bold mb-6">{course.price}</p>
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                    {course.buttonText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesAndPricing;
