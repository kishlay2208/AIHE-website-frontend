import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import OurInspiration from "@/components/OurInspiration";
import SystematicStudy from "@/components/SystematicStudy";
import Courses from "@/components/Courses";
import Instructors from "@/components/Instructors";
import Footer from "@/components/Footer";
import RegistrationDialog, { RegistrationData } from "@/components/RegistrationDialog";
import CartSheet from "@/components/CartSheet";
import type { Course } from "@/types";

const Index = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<RegistrationData[]>([]);
  const { toast } = useToast();

  const handleRegister = (course: Course) => {
    setSelectedCourse(course);
    setIsRegistrationOpen(true);
  };

  const handleAddToCart = (registration: RegistrationData) => {
    setCartItems((prev) => [...prev, registration]);
    toast({
      title: "Added to cart!",
      description: `${registration.course.title} registration added successfully.`,
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Removed from cart",
      description: "Registration removed from your cart.",
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Proceeding to payment",
      description: "Redirecting to Razorpay...",
    });
    // In a real app, integrate with Razorpay here
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
      </main>
      
      <Footer />

      {/* Dialogs */}
      <RegistrationDialog
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        course={selectedCourse}
        onAddToCart={handleAddToCart}
      />

      <CartSheet
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <Toaster />
    </div>
  );
};

export default Index;
