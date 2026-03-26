import { useState } from "react";
import { Briefcase, LogIn, LogOut, User as UserIcon, History, Lightbulb, Home, Info, Mail, Menu, X } from "lucide-react";
import { User } from "../firebase";

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onViewHistory: () => void;
  onViewTips: () => void;
  onHome: () => void;
  onAbout: () => void;
  onContact: () => void;
  isHomePage?: boolean;
}

export function Header({ 
  user, 
  onLogin, 
  onLogout, 
  onViewHistory, 
  onViewTips, 
  onHome, 
  onAbout, 
  onContact,
  isHomePage 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", icon: Home, onClick: onHome, showOnHome: false },
    { label: "Career Tips", icon: Lightbulb, onClick: onViewTips, showOnHome: true },
    { label: "About Us", icon: Info, onClick: onAbout, showOnHome: true },
    { label: "Contact Us", icon: Mail, onClick: onContact, showOnHome: true },
    { label: "History", icon: History, onClick: onViewHistory, showOnHome: false, authRequired: true },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired && !user) return false;
    if (isHomePage) return item.showOnHome;
    return true;
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button onClick={onHome} className="flex items-center gap-2 group transition-all">
            <div className="p-2 bg-brand-600 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-brand-500/20">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-white">
              Career<span className="text-brand-500">AI</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {filteredNavItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="nav-link"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-dark-border">
                <div className="flex items-center gap-2 px-3 py-1 bg-dark-surface rounded-full border border-dark-border">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ""} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-dark-muted" />
                  )}
                  <span className="text-sm font-bold text-white">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-dark-muted hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-dark-muted hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-dark-bg/95 backdrop-blur-lg border-t border-dark-border animate-in slide-in-from-right">
          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              {filteredNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-dark-surface border border-dark-border text-white font-semibold hover:bg-brand-600/10 hover:border-brand-500/50 transition-all"
                >
                  <item.icon className="w-5 h-5 text-brand-500" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-dark-border">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-surface border border-dark-border">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ""} className="w-12 h-12 rounded-full border border-dark-border" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white">{user.displayName}</p>
                      <p className="text-xs text-dark-muted">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
