import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    query: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const gasUrl = import.meta.env.VITE_API_BASE_URL;

      if (gasUrl && !gasUrl.includes("REPLACE_WITH")) {
        // POST to Google Apps Script
        await fetch(gasUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "sendContactEmail", ...formData }),
        });
        setStatus("success");
      } else {
        // Fallback: open mailto
        const subject = encodeURIComponent(
          `Website Query from ${formData.name}`
        );
        const body = encodeURIComponent(
          `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nQuery:\n${formData.query}`
        );
        window.open(
          `mailto:aihe@iskconujjain.com?subject=${subject}&body=${body}`,
          "_self"
        );
        setStatus("success");
      }

      setFormData({ name: "", phone: "", email: "", query: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="font-sans text-accent font-medium tracking-widest uppercase text-xs sm:text-sm">
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mt-3 mb-4">
            Contact Us
          </h2>
          <p className="font-sans text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question or want to know more? We&rsquo;d love to hear from you.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* ───── Left: Contact Info ───── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-border space-y-6">
              <h3 className="font-serif text-xl font-bold text-primary">
                ISKCON Ujjain — AIHE
              </h3>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <p className="font-sans text-foreground/80 text-sm leading-relaxed">
                  Sri Sri Radha Madanmohanji Temple,<br />
                  Hare Krishna Dham, Ujjain,<br />
                  Madhya Pradesh 456010, India
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a
                  href="tel:+918717895059"
                  className="font-sans text-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  +91 8717895059
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a
                  href="mailto:aihe@iskconujjain.com"
                  className="font-sans text-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  aihe@iskconujjain.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* ───── Right: Form ───── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="font-sans text-sm font-medium text-foreground/90 mb-1.5 block"
                >
                  Full Name <span className="text-accent">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              {/* Phone & Email side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="font-sans text-sm font-medium text-foreground/90 mb-1.5 block"
                  >
                    Phone Number <span className="text-accent">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-sans text-sm font-medium text-foreground/90 mb-1.5 block"
                  >
                    Email Address <span className="text-accent">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>

              {/* Query */}
              <div>
                <label
                  htmlFor="contact-query"
                  className="font-sans text-sm font-medium text-foreground/90 mb-1.5 block"
                >
                  Your Query <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-query"
                  name="query"
                  required
                  rows={4}
                  value={formData.query}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={status === "sending"}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans font-medium"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending…
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </Button>

              {status === "error" && (
                <p className="text-destructive text-sm text-center font-sans">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
