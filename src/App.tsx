import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CareerForm } from "./components/CareerForm";
import { AnalysisResult } from "./components/AnalysisResult";
import { Roadmap } from "./components/Roadmap";
import { SkillTest } from "./components/SkillTest";
import { TipsSection } from "./components/TipsSection";
import { ChatAdvisor } from "./components/ChatAdvisor";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { AboutUs } from "./components/AboutUs";
import { ContactUs } from "./components/ContactUs";
import { Dashboard } from "./components/Dashboard";
import { VoiceAdvisor } from "./components/VoiceAdvisor";
import { ResumeBuilder } from "./components/ResumeBuilder";
import { InterviewPractice } from "./components/InterviewPractice";
import { UserProfile, CareerSuggestion, AIResponse } from "./types";
import { analyzeCareer } from "./services/gemini";
import { motion, AnimatePresence } from "motion/react";
import { auth, db, doc, setDoc, getDoc, collection, onSnapshot, query, orderBy, OperationType, handleFirestoreError, User, googleProvider, signInWithPopup } from "./firebase";
import { History, Plus, Loader2 } from "lucide-react";

type View = "hero" | "dashboard" | "form" | "test" | "results" | "roadmap" | "history" | "tips" | "signin" | "signup" | "about" | "contact" | "voice-advisor" | "resume-builder" | "interview-practice";

export default function App() {
  const [view, setView] = useState<View>("hero");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [pastAnalyses, setPastAnalyses] = useState<any[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (e.detail) {
        setView(e.detail as View);
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      setIsAuthReady(true);
      if (u) {
        // Create/Update user profile in Firestore
        const userRef = doc(db, "users", u.uid);
        try {
          const userSnap = await getDoc(userRef);
          const now = new Date().toISOString();
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              createdAt: now,
              lastLogin: now
            });
          } else {
            await setDoc(userRef, {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              lastLogin: now
            }, { merge: true });
          }
          
          // Fetch the full profile to set it in state
          // We'll set a basic profile if it's new, or it will be updated via form
          setProfile({
            name: u.displayName || "User",
            email: u.email || "",
            skills: "",
            interests: "",
            education: "High School",
            goal: "Career Growth"
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${u.uid}`);
        }
        
        // If the user was on the hero or signin/signup page, move them to the dashboard
        if (view === "hero" || view === "signin" || view === "signup") {
          setView("dashboard");
        }
      } else {
        // If the user logs out, move them to the hero page
        if (view !== "about" && view !== "contact") {
          setView("hero");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && isAuthReady) {
      const analysesRef = collection(db, "users", user.uid, "analyses");
      const q = query(analysesRef, orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const analyses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPastAnalyses(analyses);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}/analyses`);
      });
      
      return () => unsubscribe();
    }
  }, [user, isAuthReady]);

  const handleStart = () => {
    if (!user) {
      setView("signin");
    } else {
      setView("form");
    }
  };

  const handleLogin = () => {
    setView("signin");
  };

  const handleFormSubmit = (data: UserProfile) => {
    setProfile(data);
    setView("test");
  };

  const handleTestComplete = async (results: { skillLevel: string; interestType: string; answers: Record<string, string> }) => {
    if (!profile) return;
    
    const finalProfile = { ...profile, testResults: results };
    setProfile(finalProfile);
    setIsLoading(true);
    setError(null);
    setView("results");

    try {
      const response = await analyzeCareer(finalProfile);
      setSuggestions(response.suggestions);
      
      if (user) {
        const analysisRef = doc(collection(db, "users", user.uid, "analyses"));
        await setDoc(analysisRef, {
          userId: user.uid,
          profile: finalProfile,
          suggestions: response.suggestions,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCareer = (career: CareerSuggestion) => {
    setSelectedCareer(career);
    setView("roadmap");
  };

  const handleBackToResults = () => setView("results");

  const handleViewHistory = () => setView("history");

  return (
    <div className="min-h-screen bg-dark-bg selection:bg-brand-500/30 selection:text-white">
      <div className="print-hide">
        <Header 
          user={user} 
          onLogin={handleLogin} 
          onLogout={() => { auth.signOut(); setView("hero"); }} 
          onViewHistory={() => setView("history")}
          onViewTips={() => setView("tips")}
          onHome={() => user ? setView("dashboard") : setView("hero")}
          onAbout={() => setView("about")}
          onContact={() => setView("contact")}
          isHomePage={view === "hero"}
        />
      </div>
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {view === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onStart={handleStart} />
            </motion.div>
          )}

          {view === "dashboard" && user && profile && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Dashboard 
                user={user} 
                profile={profile}
                onNewAnalysis={() => setView("form")} 
                onViewHistory={() => setView("history")}
                onVoiceAdvisor={() => setView("voice-advisor")}
                onResumeBuilder={() => setView("resume-builder")}
                onInterviewPractice={() => setView("interview-practice")}
                pastAnalysesCount={pastAnalyses.length}
              />
            </motion.div>
          )}

          {view === "voice-advisor" && profile && (
            <motion.div
              key="voice-advisor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VoiceAdvisor profile={profile} onClose={() => setView("dashboard")} />
            </motion.div>
          )}

          {view === "resume-builder" && profile && (
            <motion.div
              key="resume-builder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-6xl mx-auto px-4 pt-12">
                <button 
                  onClick={() => setView("dashboard")}
                  className="text-sm font-medium text-dark-muted hover:text-brand-400 transition-colors mb-4"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <ResumeBuilder profile={profile} />
            </motion.div>
          )}

          {view === "interview-practice" && profile && (
            <motion.div
              key="interview-practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-6xl mx-auto px-4 pt-12">
                <button 
                  onClick={() => setView("dashboard")}
                  className="text-sm font-medium text-dark-muted hover:text-brand-400 transition-colors mb-4"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <InterviewPractice profile={profile} />
            </motion.div>
          )}

          {view === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-20 px-4"
            >
              <div className="max-w-2xl mx-auto flex justify-between items-center mb-8">
                <button 
                  onClick={() => setView("dashboard")}
                  className="text-sm font-medium text-dark-muted hover:text-brand-400 transition-colors"
                >
                  ← Back to Dashboard
                </button>
                {pastAnalyses.length > 0 && (
                  <button 
                    onClick={handleViewHistory}
                    className="flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300"
                  >
                    <History className="w-4 h-4" />
                    View Past Analyses ({pastAnalyses.length})
                  </button>
                )}
              </div>
              <CareerForm onSubmit={handleFormSubmit} isLoading={isLoading} initialProfile={profile} />
              {error && (
                <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
              )}
            </motion.div>
          )}

          {view === "test" && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-20 px-4"
            >
              <SkillTest onComplete={handleTestComplete} />
            </motion.div>
          )}

          {view === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20"
            >
              <div className="max-w-6xl mx-auto px-4 mb-8 flex justify-between items-center">
                <button 
                  onClick={() => setView("form")}
                  className="text-sm font-medium text-dark-muted hover:text-brand-400 transition-colors"
                >
                  ← New Analysis
                </button>
                <button 
                  onClick={handleViewHistory}
                  className="flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300"
                >
                  <History className="w-4 h-4" />
                  History
                </button>
              </div>
              <AnalysisResult 
                suggestions={suggestions} 
                onSelect={handleSelectCareer} 
              />
            </motion.div>
          )}

          {view === "roadmap" && selectedCareer && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-20"
            >
              <Roadmap 
                suggestion={selectedCareer} 
                onBack={handleBackToResults} 
              />
            </motion.div>
          )}

          {view === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 px-4 max-w-4xl mx-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold font-display text-white">Your Analysis History</h2>
                <button 
                  onClick={() => setView("form")}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-full text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
                >
                  <Plus className="w-4 h-4" />
                  New Analysis
                </button>
              </div>

              <div className="space-y-6">
                {pastAnalyses.map((analysis) => (
                  <div 
                    key={analysis.id}
                    className="bg-dark-surface p-6 rounded-3xl border border-dark-border shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">
                          {new Date(analysis.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                        <h3 className="text-lg font-bold text-white">
                          {analysis.suggestions.map((s: any) => s.title).join(", ")}
                        </h3>
                      </div>
                      <button 
                        onClick={() => {
                          setSuggestions(analysis.suggestions);
                          setView("results");
                        }}
                        className="text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        View Results
                      </button>
                    </div>
                    <div className="flex gap-4 text-sm text-dark-muted">
                      <span>Skills: {analysis.profile.skills.substring(0, 50)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === "tips" && (
            <motion.div
              key="tips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TipsSection />
            </motion.div>
          )}

          {view === "signin" && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SignIn 
                onSuccess={() => setView("dashboard")} 
                onSwitchToSignUp={() => setView("signup")} 
              />
            </motion.div>
          )}

          {view === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SignUp 
                onSuccess={() => setView("dashboard")} 
                onSwitchToSignIn={() => setView("signin")} 
              />
            </motion.div>
          )}

          {view === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AboutUs />
            </motion.div>
          )}

          {view === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ContactUs />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="print-hide">
        {user && profile && <ChatAdvisor profile={profile} />}
      </div>

      <footer className="py-12 border-t border-dark-border bg-dark-bg print-hide">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-dark-muted text-sm">
            © 2026 CareerAI Guide. Powered by Google Gemini & Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
