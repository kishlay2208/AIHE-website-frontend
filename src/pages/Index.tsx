import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import OurInspiration from "@/components/OurInspiration";
import SystematicStudy from "@/components/SystematicStudy";
import Courses from "@/components/Courses";
import Instructors from "@/components/Instructors";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Course } from "@/types";

import { useEffect } from "react";
import { apiClient } from "@/services/api";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Prefetch all data to cache it
    apiClient.getAllData();
  }, []);

  const handleRegister = (course: Course) => {
    if (course.registrationFormUrl) {
      window.open(course.registrationFormUrl, "_blank");
    } else {
      toast({
        title: "Registration starting soon",
        description: "Please check back later for the registration link.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        <About />
        <OurInspiration />
        <SystematicStudy />
        <Courses onRegister={handleRegister} />
        <Instructors />
        <Contact />
      </main>
      
      <Footer />
      <WhatsAppButton />
      <Toaster />
    </div>
  );
};

export default Index;

