import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import iskconLogo from "@/assets/iskcon-logo.png";
import aiheLogo from "@/assets/aihe-logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Our Inspiration", href: "#inspiration" },
    { name: "Courses", href: "#courses" },
    { name: "Our Faculty", href: "#instructors" },
    { name: "Contact", href: "#contact" },
  ];

  const courses = [
    { name: "Bhakti Shastri", href: "#courses" },
    { name: "ISKCON Disciple Course", href: "#courses" },
    { name: "Bhakti Vaibhava", href: "#courses" },
  ];

  return (
    <footer id="contact" className="bg-primary text-light-bg py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={aiheLogo} alt="AIHE" className="h-14 w-auto" />
              <div className="w-px h-10 bg-light-bg/30" />
              <img src={iskconLogo} alt="ISKCON Ujjain" className="h-12 w-auto invert" />
            </div>
            <p className="text-light-bg/70 text-sm leading-relaxed">
              Avantika Institute for Higher Education is dedicated to providing
              authentic spiritual education in the Gaudiya Vaishnava tradition
              under the guidance of ISKCON Ujjain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-light-bg/70 hover:text-orange transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Courses</h4>
            <ul className="space-y-2">
              {courses.map((course) => (
                <li key={course.name}>
                  <a
                    href={course.href}
                    className="text-light-bg/70 hover:text-orange transition-colors text-sm"
                  >
                    {course.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact ISKCON Ujjain</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                <span className="text-light-bg/70 text-sm">
                  Sri Sri Radha Madanmohanji Temple,<br />
                  Hare Krishna Dham, Ujjain,<br />
                  Madhya Pradesh 456010, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange shrink-0" />
                <a href="tel:+918717895059" className="text-light-bg/70 hover:text-orange transition-colors text-sm">
                  +91 8717895059
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange shrink-0" />
                <a href="mailto:aihe@iskconujjain.com" className="text-light-bg/70 hover:text-orange transition-colors text-sm">
                  aihe@iskconujjain.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-light-bg/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-light-bg/50 text-sm">
            © {new Date().getFullYear()} Avantika Institute for Higher Education. All rights reserved.
          </p>
          <a
            href="https://iskconujjain.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-orange hover:text-light-bg transition-colors text-sm"
          >
            Visit ISKCON Ujjain
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
