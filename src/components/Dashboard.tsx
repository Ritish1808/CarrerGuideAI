import { motion } from "motion/react";
import { User, Mail, Phone, MapPin, History, Plus, Facebook, Instagram, Linkedin, ExternalLink, Mic, FileText, MessageSquare, ArrowRight } from "lucide-react";
import { User as FirebaseUser } from "../firebase";
import { UserProfile } from "../types";

interface DashboardProps {
  user: FirebaseUser;
  profile: UserProfile;
  onNewAnalysis: () => void;
  onViewHistory: () => void;
  onVoiceAdvisor: () => void;
  onResumeBuilder: () => void;
  onInterviewPractice: () => void;
  pastAnalysesCount: number;
}

export function Dashboard({ 
  user, 
  profile, 
  onNewAnalysis, 
  onViewHistory, 
  onVoiceAdvisor, 
  onResumeBuilder, 
  onInterviewPractice, 
  pastAnalysesCount 
}: DashboardProps) {
  const contactDetails = {
    email: "ritishk2004@gmail.com",
    phone: "9019854584",
    address: "yedumadu village, bengaluru 562112",
    mapLink: "https://maps.app.goo.gl/yKSKnpakTX8bm9Xi7",
    socials: {
      facebook: "https://www.facebook.com/ritish.k.7",
      instagram: "https://www.instagram.com/ritish1808/",
      linkedin: "https://www.linkedin.com/in/ritish-kannur-3a20082a6/"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-display text-white mb-2">Welcome back, {user.displayName || "User"}!</h1>
        <p className="text-dark-muted">Here's an overview of your career journey and support options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewAnalysis}
              className="p-8 bg-brand-600 rounded-[2.5rem] text-white shadow-xl shadow-brand-500/20 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">New Analysis</h3>
              <p className="text-brand-100 text-sm">Start a new career path discovery session with AI.</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewHistory}
              className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-xl flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <History className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">View History</h3>
              <p className="text-dark-muted text-sm">You have {pastAnalysesCount} past analyses saved.</p>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onVoiceAdvisor}
              className="p-6 bg-dark-surface rounded-[2rem] border border-dark-border shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6 text-brand-500" />
              </div>
              <h4 className="font-bold text-white mb-1 font-display">Voice AI</h4>
              <p className="text-dark-muted text-xs">Real-time career advice via voice.</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResumeBuilder}
              className="p-6 bg-dark-surface rounded-[2rem] border border-dark-border shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-brand-500" />
              </div>
              <h4 className="font-bold text-white mb-1 font-display">Resume Builder</h4>
              <p className="text-dark-muted text-xs">Create professional resumes in minutes.</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onInterviewPractice}
              className="p-6 bg-dark-surface rounded-[2rem] border border-dark-border shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-brand-500" />
              </div>
              <h4 className="font-bold text-white mb-1 font-display">Interview Practice</h4>
              <p className="text-dark-muted text-xs">Practice mock interviews with AI.</p>
            </motion.button>
          </div>

          {/* User Info Card */}
          <div className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-display">
              <User className="w-5 h-5 text-brand-500" />
              Your Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-dark-muted uppercase tracking-widest">Display Name</p>
                <p className="text-white font-medium">{user.displayName || "Not set"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-dark-muted uppercase tracking-widest">Email Address</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-dark-muted uppercase tracking-widest">Account ID</p>
                <p className="text-dark-muted text-xs font-mono">{user.uid}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-dark-muted uppercase tracking-widest">Member Since</p>
                <p className="text-white font-medium">
                  {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Contact (The "Specified Modules") */}
        <div className="space-y-8">
          <div className="p-8 bg-dark-surface rounded-[2.5rem] text-white shadow-2xl border border-dark-border">
            <h3 className="text-xl font-bold mb-6 font-display">Support & Contact</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-500/10 rounded-xl border border-brand-500/20">
                  <Mail className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark-muted uppercase tracking-widest mb-1">Email Support</p>
                  <a href={`mailto:${contactDetails.email}`} className="text-sm hover:text-brand-400 transition-colors">{contactDetails.email}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-500/10 rounded-xl border border-brand-500/20">
                  <Phone className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark-muted uppercase tracking-widest mb-1">Phone Support</p>
                  <a href={`tel:${contactDetails.phone}`} className="text-sm hover:text-brand-400 transition-colors">{contactDetails.phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-500/10 rounded-xl border border-brand-500/20">
                  <MapPin className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark-muted uppercase tracking-widest mb-1">Visit Us</p>
                  <p className="text-sm">{contactDetails.address}</p>
                  <a 
                    href={contactDetails.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:underline flex items-center gap-1 mt-1"
                  >
                    View on Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-dark-border">
              <p className="text-xs font-bold text-dark-muted uppercase tracking-widest mb-4">Follow Us</p>
              <div className="flex gap-4">
                <a href={contactDetails.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-dark-bg rounded-xl hover:bg-dark-surface transition-all border border-dark-border">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={contactDetails.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-dark-bg rounded-xl hover:bg-dark-surface transition-all border border-dark-border">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={contactDetails.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-dark-bg rounded-xl hover:bg-dark-surface transition-all border border-dark-border">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-8 bg-brand-500/10 rounded-[2.5rem] border border-brand-500/20">
            <h4 className="font-bold text-white mb-2 font-display">Need immediate help?</h4>
            <p className="text-sm text-dark-muted mb-4 leading-relaxed">
              Our AI Career Advisor is available 24/7 to answer your questions and guide you.
            </p>
            <button 
              onClick={onNewAnalysis}
              className="text-sm font-bold text-brand-500 hover:underline flex items-center gap-1"
            >
              Start Chatting <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
