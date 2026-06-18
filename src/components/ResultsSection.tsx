import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Search, Award, AlertCircle, RefreshCw, Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useResults, useCourseCatalog } from "@/services/queries";
import type { ResultRecord } from "@/types";

const ResultsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [matchedResult, setMatchedResult] = useState<ResultRecord | null>(null);
  const [searchError, setSearchError] = useState("");

  const { data: resultsData, isLoading: resultsLoading } = useResults();
  const { data: catalogData, isLoading: catalogLoading } = useCourseCatalog();

  const courses = catalogData?.data || [];
  const results = resultsData?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setMatchedResult(null);

    // Form validations
    if (!name.trim()) {
      setSearchError("Please enter your name.");
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      setSearchError("Please enter a valid 10-digit mobile number without country code.");
      return;
    }

    if (!selectedCourseId) {
      setSearchError("Please select a course.");
      return;
    }

    const selectedCourseName = courses.find(c => c.courseId === selectedCourseId)?.name || "";

    // Search logic (case-insensitive name comparison and normalized digit mobile comparison)
    const found = results.find(r => {
      const isNameMatch = r.name.toLowerCase().trim() === name.toLowerCase().trim();
      const isMobileMatch = r.mobile.replace(/\D/g, "") === cleanMobile;
      const isCourseMatch =
        r.courseId.toLowerCase().trim() === selectedCourseId.toLowerCase().trim() ||
        r.courseName.toLowerCase().trim() === selectedCourseName.toLowerCase().trim();
      
      return isNameMatch && isMobileMatch && isCourseMatch;
    });

    if (found) {
      setMatchedResult(found);
    } else {
      setMatchedResult(null);
    }
    setSearchPerformed(true);
  };

  const resetForm = () => {
    setName("");
    setMobile("");
    setSelectedCourseId("");
    setSearchPerformed(false);
    setMatchedResult(null);
    setSearchError("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="results" className="py-20 md:py-24 bg-[#FAF8F3] border-y border-primary/5 relative overflow-hidden">
      {/* Subtle mandala / spiritual background pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-center bg-no-repeat bg-contain" 
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1000')` }} />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="w-16 h-16 rounded-3xl bg-accent/15 flex items-center justify-center mx-auto mb-6 border border-accent/20">
            <GraduationCap className="w-8 h-8 text-accent" />
          </div>
          
          <span className="font-sans text-accent font-bold tracking-[0.2em] text-xs sm:text-sm uppercase mb-3 block">
            Academic Portal
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mt-3 mb-6 tracking-wide leading-tight">
            Check Your Examination Results
          </h2>
          <p className="font-sans text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Students can verify their scorecards, closed/open book evaluation grades, sloka marks, and certificate eligibility.
          </p>

          {/* Dialog Container */}
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#2C1E4A] hover:bg-black text-white hover:scale-105 transition-all duration-300 font-bold px-10 py-6 rounded-2xl shadow-lg shadow-[#2C1E4A]/10 text-base">
                Check Result
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg rounded-3xl border border-primary/5 shadow-2xl p-0 overflow-hidden bg-white max-h-[90vh] flex flex-col">
              <DialogHeader className="p-6 md:p-8 bg-[#2C1E4A] text-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-orange" />
                  <div>
                    <DialogTitle className="font-serif text-xl md:text-2xl text-left text-white font-bold leading-none">
                      Academic Results Portal
                    </DialogTitle>
                    <DialogDescription className="text-light-bg/70 text-xs text-left mt-1.5 font-sans">
                      Enter details registered during your course enrollment.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="p-6 md:p-8 overflow-y-auto flex-grow">
                {!searchPerformed ? (
                  <form onSubmit={handleSearch} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-semibold text-[#2C1E4A]">
                        Student Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl border-[#8B7E9F]/20 focus:border-[#2C1E4A] focus:ring-0 text-sm h-11"
                        required
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile" className="text-sm font-semibold text-[#2C1E4A]">
                        10-Digit Mobile Number
                      </Label>
                      <Input
                        id="mobile"
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9876543210 (without country code)"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="rounded-xl border-[#8B7E9F]/20 focus:border-[#2C1E4A] focus:ring-0 text-sm h-11"
                        required
                      />
                    </div>

                    {/* Course Selection */}
                    <div className="space-y-1.5">
                      <Label htmlFor="course" className="text-sm font-semibold text-[#2C1E4A]">
                        Course
                      </Label>
                      <select
                        id="course"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full rounded-xl border border-[#8B7E9F]/20 bg-background px-3 h-11 text-sm text-foreground focus:outline-none focus:border-[#2C1E4A] transition"
                        required
                      >
                        <option value="">-- Select Registered Course --</option>
                        {courses.map((c) => (
                          <option key={c.courseId} value={c.courseId}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {searchError && (
                      <div className="flex items-center gap-2 text-destructive text-xs font-semibold font-sans bg-destructive/5 p-3 rounded-xl border border-destructive/10">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{searchError}</span>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={resultsLoading || catalogLoading}
                      className="w-full bg-[#2C1E4A] hover:bg-black text-white font-bold h-12 rounded-xl transition duration-300 gap-2 text-sm"
                    >
                      <Search className="w-4 h-4" />
                      Retrieve Scorecard
                    </Button>
                  </form>
                ) : matchedResult ? (
                  /* Scorecard Display */
                  <div className="space-y-6 print:p-0">
                    <div className="border-2 border-dashed border-[#8B7E9F]/20 rounded-2xl p-6 bg-[#FAF8F5] relative overflow-hidden">
                      {/* Faint mandala stamp */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] text-9xl select-none pointer-events-none">
                        🕉️
                      </div>
                      
                      <div className="text-center border-b border-[#8B7E9F]/10 pb-4 mb-4">
                        <h4 className="font-serif font-extrabold text-[#2C1E4A] text-lg">
                          AVANTIKA INSTITUTE FOR HIGHER EDUCATION
                        </h4>
                        <span className="text-[10px] tracking-widest font-bold text-accent uppercase font-sans">
                          Academic Transcript
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 text-xs mb-6 font-sans">
                        <div>
                          <span className="text-muted-foreground block">Student Name</span>
                          <span className="font-bold text-primary">{matchedResult.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Registered Mobile</span>
                          <span className="font-bold text-primary">{matchedResult.mobile}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground block">Course</span>
                          <span className="font-bold text-[#2C1E4A]">{matchedResult.courseName}</span>
                        </div>
                      </div>

                      {/* Marks Sheet Table */}
                      <div className="bg-white rounded-xl border border-[#8B7E9F]/10 overflow-hidden font-sans mb-4">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-secondary/40 border-b border-[#8B7E9F]/10">
                              <th className="p-3 font-semibold text-[#2C1E4A]">Evaluation Subject</th>
                              <th className="p-3 font-semibold text-[#2C1E4A] text-right">Score</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#8B7E9F]/10">
                            <tr>
                              <td className="p-3 text-muted-foreground">Closed Book Assessment (CBA)</td>
                              <td className="p-3 font-bold text-right text-primary">{matchedResult.cba}</td>
                            </tr>
                            <tr>
                              <td className="p-3 text-muted-foreground">Open Book Assessment (OBA)</td>
                              <td className="p-3 font-bold text-right text-primary">{matchedResult.oba}</td>
                            </tr>
                            <tr>
                              <td className="p-3 text-muted-foreground">Sloka Memorization & Recitation</td>
                              <td className="p-3 font-bold text-right text-primary">{matchedResult.sloka}</td>
                            </tr>
                            <tr className="bg-secondary/20 font-bold border-t-2 border-[#8B7E9F]/15">
                              <td className="p-3 text-[#2C1E4A]">Total Grade / Percentage</td>
                              <td className="p-3 text-right text-accent text-sm font-extrabold">{matchedResult.total}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center justify-between font-sans border-t border-[#8B7E9F]/10 pt-4 mt-4 text-xs">
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Status</span>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            matchedResult.status.toLowerCase().includes("fail")
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {matchedResult.status}
                          </span>
                        </div>
                        {matchedResult.remarks && (
                          <div className="text-right max-w-[60%]">
                            <span className="text-muted-foreground block mb-0.5">Remarks</span>
                            <span className="italic font-medium text-primary block">{matchedResult.remarks}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end font-sans">
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="rounded-xl border-[#8B7E9F]/20 text-[#2C1E4A] font-bold hover:bg-[#FAF8F5]"
                      >
                        Check Another
                      </Button>
                      <Button
                        onClick={handlePrint}
                        className="bg-[#2C1E4A] hover:bg-black text-white font-bold rounded-xl gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print Transcript
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Result Not Found Alert */
                  <div className="text-center py-6 font-sans space-y-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-xl text-primary">Result Not Found</h3>
                      <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                        We couldn't locate any record matching the details provided.
                      </p>
                    </div>

                    <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100 text-left text-xs text-red-800 space-y-1.5 max-w-sm mx-auto">
                      <p className="font-bold">Please verify the following:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>The spelling of your registered name matches the registration card.</li>
                        <li>Mobile number is exactly 10 digits without prefix (+91 or 0).</li>
                        <li>You have chosen the correct course from the selection dropdown.</li>
                      </ul>
                    </div>

                    <div className="flex justify-center gap-3 pt-2">
                      <Button
                        onClick={resetForm}
                        className="bg-[#2C1E4A] hover:bg-black text-white font-bold rounded-xl gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
