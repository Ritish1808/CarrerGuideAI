import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Play, CheckCircle2, Loader2, ArrowRight, X, ShieldCheck, Star, Award, User, Briefcase, RefreshCw, Send, Headphones, Download } from "lucide-react";
import { UserProfile, InterviewSession } from "../types";
import { startInterviewSession, getInterviewFeedback } from "../services/gemini";
import { jsPDF } from "jspdf";
import { domToCanvas } from "modern-screenshot";

interface InterviewPracticeProps {
  profile: UserProfile;
}

export function InterviewPractice({ profile }: InterviewPracticeProps) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadFeedback = async () => {
    const element = document.getElementById("interview-feedback");
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await domToCanvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Handle multi-page
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Interview_Feedback_${session?.role.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Feedback PDF generation failed:", err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const startNewSession = async (role: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { questions } = await startInterviewSession(role, profile);
      setSession({
        id: Date.now().toString(),
        role,
        questions,
        currentQuestionIndex: 0,
        feedback: [],
        status: "active"
      });
    } catch (err) {
      console.error(err);
      setError("Failed to start interview session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !currentAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const question = session.questions[session.currentQuestionIndex];
      const feedback = await getInterviewFeedback(question, currentAnswer);
      
      const updatedFeedback = [...session.feedback, feedback];
      const nextIndex = session.currentQuestionIndex + 1;
      
      if (nextIndex >= session.questions.length) {
        setSession({
          ...session,
          feedback: updatedFeedback,
          status: "completed"
        });
      } else {
        setSession({
          ...session,
          feedback: updatedFeedback,
          currentQuestionIndex: nextIndex
        });
      }
      setCurrentAnswer("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold font-display text-white mb-2">Interview Practice</h1>
          <p className="text-dark-muted">Sharpen your skills with AI-powered mock interviews.</p>
        </div>
        {session && (
          <button 
            onClick={() => setSession(null)}
            className="p-2 bg-dark-surface text-dark-muted rounded-xl hover:bg-dark-bg transition-colors border border-dark-border"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-400" />
                  Select a Role to Practice
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "Marketing Manager", "Sales Representative"].map((role) => (
                    <button
                      key={role}
                      onClick={() => startNewSession(role)}
                      className="p-6 bg-dark-bg border border-dark-border rounded-3xl text-left hover:border-brand-500 hover:bg-brand-500/5 transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{role}</span>
                        <ArrowRight className="w-4 h-4 text-dark-muted group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-dark-border">
                  <p className="text-sm font-bold text-dark-muted uppercase tracking-widest mb-4">Or enter a custom role</p>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="e.g. AI Researcher"
                      className="flex-1 p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') startNewSession(e.currentTarget.value);
                      }}
                    />
                    <button className="px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all">
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-dark-surface rounded-[2.5rem] text-white shadow-2xl border border-dark-border">
                <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-500/20">
                  <ShieldCheck className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">How it works</h3>
                <ul className="space-y-4 text-sm text-dark-muted">
                  <li className="flex gap-3">
                    <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">1</div>
                    AI generates personalized questions based on your profile and the selected role.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">2</div>
                    You provide your answers (text or voice).
                  </li>
                  <li className="flex gap-3">
                    <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">3</div>
                    AI provides instant, constructive feedback on each answer to help you improve.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        ) : session.status === "active" ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-brand-500/10 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/20">
                  Question {session.currentQuestionIndex + 1} of {session.questions.length}
                </div>
                <div className="text-sm font-bold text-dark-muted uppercase tracking-widest">
                  Role: {session.role}
                </div>
              </div>
              <div className="flex gap-1">
                {session.questions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-1 rounded-full ${i === session.currentQuestionIndex ? 'bg-brand-500' : i < session.currentQuestionIndex ? 'bg-green-500' : 'bg-dark-border'}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-12 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-xl mb-8">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-brand-500/20">
                  <MessageSquare className="w-8 h-8 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {session.questions[session.currentQuestionIndex]}
                  </h3>
                </div>
              </div>

              <form onSubmit={handleAnswerSubmit} className="space-y-6">
                <div className="relative">
                  <textarea
                    required
                    rows={6}
                    placeholder="Type your answer here..."
                    className="w-full p-6 bg-dark-bg border border-dark-border rounded-3xl focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none text-lg text-white placeholder:text-dark-muted/50"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      type="button"
                      className="p-3 bg-dark-surface border border-dark-border rounded-xl text-dark-muted hover:text-brand-400 transition-all shadow-sm"
                    >
                      <Headphones className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-dark-muted italic">
                    Tip: Be specific and use the STAR method (Situation, Task, Action, Result).
                  </p>
                  <button
                    disabled={isSubmitting || !currentAnswer.trim()}
                    type="submit"
                    className="px-12 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Answer"}
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {session.feedback.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-green-500/10 rounded-[2.5rem] border border-green-500/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-dark-surface rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-dark-border">
                    <Star className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-400 mb-2">Previous Feedback</h4>
                    <p className="text-sm text-dark-muted leading-relaxed">
                      {session.feedback[session.feedback.length - 1]}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto"
            id="interview-feedback"
          >
            <div className="p-12 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-xl text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <Award className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Interview Completed!</h2>
              <p className="text-dark-muted mb-12 max-w-md mx-auto">
                Great job! You've completed the mock interview for the **{session.role}** position. Review your feedback below to improve.
              </p>

              <div className="space-y-6 text-left mb-12">
                {session.questions.map((q, i) => (
                  <div key={i} className="p-6 bg-dark-bg rounded-3xl border border-dark-border">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-[10px]">{i + 1}</span>
                      {q}
                    </h4>
                    <div className="p-4 bg-dark-surface rounded-2xl border border-dark-border text-sm text-dark-muted leading-relaxed">
                      <p className="font-bold text-green-400 mb-1">Feedback:</p>
                      {session.feedback[i]}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 print-hide">
                <button
                  onClick={() => setSession(null)}
                  className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Another Role
                </button>
                <button
                  disabled={isDownloading}
                  onClick={handleDownloadFeedback}
                  className="flex-1 py-4 bg-white text-dark-bg font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  Download Feedback
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
            <p className="font-bold text-white">Preparing your personalized interview...</p>
          </div>
        </div>
      )}
    </div>
  );
}
